-- Mentalist Phase 2.3 — automatic profile creation on signup + safe reconciliation.
-- No table/column changes. profiles keeps its Phase 2.2 policies (own-row SELECT/UPDATE only);
-- users still cannot INSERT profiles directly — only these functions create them.

-- Shared, sanitised display-name extraction from auth metadata (trimmed, blank -> NULL, max 50 chars).
CREATE OR REPLACE FUNCTION public.profile_display_name_from_metadata(meta jsonb)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT left(nullif(btrim(regexp_replace(coalesce(meta ->> 'display_name', ''), '[[:cntrl:]]', '', 'g')), ''), 50)
$$;
REVOKE ALL ON FUNCTION public.profile_display_name_from_metadata(jsonb) FROM PUBLIC, anon, authenticated;

-- Trigger function: runs as owner, id always comes from the new auth row (never from client input).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, public.profile_display_name_from_metadata(NEW.raw_user_meta_data))
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Never block account creation; public.ensure_my_profile() reconciles on next sign-in.
    RAISE WARNING 'handle_new_user: profile creation failed for %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reconciliation: a signed-in user can create ONLY their own missing profile.
-- Uses auth.uid(); never overwrites an existing profile.
CREATE OR REPLACE FUNCTION public.ensure_my_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.profiles (id, display_name)
  SELECT u.id, public.profile_display_name_from_metadata(u.raw_user_meta_data)
  FROM auth.users u
  WHERE u.id = uid
  ON CONFLICT (id) DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_my_profile() TO authenticated;

-- One-time backfill for any existing account without a profile (additive, no overwrite).
INSERT INTO public.profiles (id, display_name)
SELECT u.id, public.profile_display_name_from_metadata(u.raw_user_meta_data)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;