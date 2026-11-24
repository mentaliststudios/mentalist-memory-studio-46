-- Narrow table privileges to what the app actually uses. Row security already blocked
-- these paths; this removes the broader platform defaults as defence in depth.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'memory_palaces', 'palace_rooms', 'palace_locations',
    'memory_items', 'review_schedule', 'review_events', 'practice_sessions'
  ] LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.%I FROM authenticated', t);
  END LOOP;
END $$;

-- Profiles: created only by the signup trigger / ensure_my_profile(), never deleted by users,
-- and only user-facing fields are editable (not id or timestamps).
REVOKE INSERT, DELETE, UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name, avatar_path, locale, timezone) ON public.profiles TO authenticated;

-- Server-side length limits matching the app's forms.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length CHECK (display_name IS NULL OR char_length(display_name) <= 50);
ALTER TABLE public.memory_palaces
  ADD CONSTRAINT memory_palaces_name_length CHECK (char_length(name) <= 80),
  ADD CONSTRAINT memory_palaces_description_length CHECK (description IS NULL OR char_length(description) <= 500);

-- Reject time zones the database does not recognise.
CREATE OR REPLACE FUNCTION public.validate_profile_timezone()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.timezone IS DISTINCT FROM OLD.timezone THEN
    BEGIN
      PERFORM now() AT TIME ZONE NEW.timezone;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'unrecognised time zone' USING ERRCODE = '22023';
    END;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_profile_timezone() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER profiles_validate_timezone
  BEFORE INSERT OR UPDATE OF timezone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_timezone();