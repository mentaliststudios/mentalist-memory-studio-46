-- Mentalist Phase 2.2 — core schema.
-- Ownership: every table carries user_id and composite (id, user_id) keys so child rows
-- can only reference parents owned by the same user. user_id references public.profiles(id)
-- (which cascades from auth.users) instead of auth.users directly, per Lovable Cloud schema rules.

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- profiles ---------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NULL,
  avatar_path text NULL,
  locale text NOT NULL DEFAULT 'en',
  timezone text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_locale_not_blank CHECK (locale ~ '\S'),
  CONSTRAINT profiles_timezone_not_blank CHECK (timezone ~ '\S')
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- memory_palaces ---------------------------------------------------------
CREATE TABLE public.memory_palaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NULL,
  template_key text NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz NULL,
  CONSTRAINT memory_palaces_name_not_blank CHECK (name ~ '\S'),
  CONSTRAINT memory_palaces_sort_order_nonneg CHECK (sort_order >= 0),
  CONSTRAINT memory_palaces_id_user_key UNIQUE (id, user_id)
);
CREATE INDEX memory_palaces_user_sort_idx ON public.memory_palaces (user_id, sort_order);

-- palace_rooms -----------------------------------------------------------
CREATE TABLE public.palace_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  palace_id uuid NOT NULL,
  name text NOT NULL,
  room_type text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT palace_rooms_palace_owner_fkey FOREIGN KEY (palace_id, user_id)
    REFERENCES public.memory_palaces (id, user_id) ON DELETE CASCADE,
  CONSTRAINT palace_rooms_name_not_blank CHECK (name ~ '\S'),
  CONSTRAINT palace_rooms_room_type_not_blank CHECK (room_type ~ '\S'),
  CONSTRAINT palace_rooms_sort_order_nonneg CHECK (sort_order >= 0),
  CONSTRAINT palace_rooms_id_user_key UNIQUE (id, user_id)
);
CREATE INDEX palace_rooms_palace_sort_idx ON public.palace_rooms (palace_id, sort_order);
CREATE INDEX palace_rooms_user_idx ON public.palace_rooms (user_id);

-- palace_locations -------------------------------------------------------
CREATE TABLE public.palace_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id uuid NOT NULL,
  name text NOT NULL,
  description text NULL,
  position_x numeric NULL,
  position_y numeric NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT palace_locations_room_owner_fkey FOREIGN KEY (room_id, user_id)
    REFERENCES public.palace_rooms (id, user_id) ON DELETE CASCADE,
  CONSTRAINT palace_locations_name_not_blank CHECK (name ~ '\S'),
  CONSTRAINT palace_locations_sort_order_nonneg CHECK (sort_order >= 0),
  CONSTRAINT palace_locations_position_x_valid CHECK (position_x IS NULL OR position_x <> 'NaN'::numeric),
  CONSTRAINT palace_locations_position_y_valid CHECK (position_y IS NULL OR position_y <> 'NaN'::numeric),
  CONSTRAINT palace_locations_id_user_key UNIQUE (id, user_id)
);
CREATE INDEX palace_locations_room_sort_idx ON public.palace_locations (room_id, sort_order);
CREATE INDEX palace_locations_user_idx ON public.palace_locations (user_id);

-- memory_items -----------------------------------------------------------
CREATE TABLE public.memory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_id uuid NULL,
  title text NOT NULL,
  source_text text NULL,
  recall_prompt text NULL,
  recall_answer text NULL,
  mnemonic text NULL,
  visual_association text NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz NULL,
  CONSTRAINT memory_items_location_owner_fkey FOREIGN KEY (location_id, user_id)
    REFERENCES public.palace_locations (id, user_id) ON DELETE RESTRICT,
  CONSTRAINT memory_items_title_not_blank CHECK (title ~ '\S'),
  CONSTRAINT memory_items_status_valid CHECK (status IN ('active', 'archived')),
  CONSTRAINT memory_items_id_user_key UNIQUE (id, user_id)
);
CREATE INDEX memory_items_user_status_idx ON public.memory_items (user_id, status);
CREATE INDEX memory_items_location_idx ON public.memory_items (location_id) WHERE location_id IS NOT NULL;

-- practice_sessions (before review_events, which references it) ----------
CREATE TABLE public.practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL,
  activity_key text NOT NULL,
  difficulty text NULL,
  status text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL,
  duration_seconds integer NOT NULL DEFAULT 0,
  score numeric NULL,
  total_items integer NULL,
  correct_items integer NULL,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT practice_sessions_session_type_not_blank CHECK (session_type ~ '\S'),
  CONSTRAINT practice_sessions_activity_key_not_blank CHECK (activity_key ~ '\S'),
  CONSTRAINT practice_sessions_status_valid CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  CONSTRAINT practice_sessions_duration_nonneg CHECK (duration_seconds >= 0),
  CONSTRAINT practice_sessions_score_valid CHECK (score IS NULL OR (score >= 0 AND score <> 'NaN'::numeric)),
  CONSTRAINT practice_sessions_total_items_nonneg CHECK (total_items IS NULL OR total_items >= 0),
  CONSTRAINT practice_sessions_correct_items_nonneg CHECK (correct_items IS NULL OR correct_items >= 0),
  CONSTRAINT practice_sessions_correct_le_total CHECK (
    total_items IS NULL OR correct_items IS NULL OR correct_items <= total_items),
  CONSTRAINT practice_sessions_completed_has_time CHECK (status <> 'completed' OR completed_at IS NOT NULL),
  CONSTRAINT practice_sessions_id_user_key UNIQUE (id, user_id)
);
CREATE INDEX practice_sessions_user_started_idx ON public.practice_sessions (user_id, started_at DESC);
CREATE INDEX practice_sessions_user_status_idx ON public.practice_sessions (user_id, status);

-- review_schedule --------------------------------------------------------
CREATE TABLE public.review_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_item_id uuid NOT NULL,
  due_at timestamptz NOT NULL,
  interval_days numeric NOT NULL DEFAULT 0,
  ease_factor numeric NOT NULL DEFAULT 2.5,
  repetitions integer NOT NULL DEFAULT 0,
  lapses integer NOT NULL DEFAULT 0,
  last_reviewed_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT review_schedule_item_owner_fkey FOREIGN KEY (memory_item_id, user_id)
    REFERENCES public.memory_items (id, user_id) ON DELETE CASCADE,
  CONSTRAINT review_schedule_memory_item_key UNIQUE (memory_item_id),
  CONSTRAINT review_schedule_interval_valid CHECK (interval_days >= 0 AND interval_days <> 'NaN'::numeric),
  CONSTRAINT review_schedule_ease_valid CHECK (ease_factor > 0 AND ease_factor <> 'NaN'::numeric),
  CONSTRAINT review_schedule_repetitions_nonneg CHECK (repetitions >= 0),
  CONSTRAINT review_schedule_lapses_nonneg CHECK (lapses >= 0)
);
CREATE INDEX review_schedule_user_due_idx ON public.review_schedule (user_id, due_at);

-- review_events ----------------------------------------------------------
CREATE TABLE public.review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_item_id uuid NOT NULL,
  session_id uuid NULL,
  rating text NOT NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  previous_due_at timestamptz NULL,
  next_due_at timestamptz NULL,
  interval_days numeric NULL,
  response_time_ms integer NULL,
  CONSTRAINT review_events_item_owner_fkey FOREIGN KEY (memory_item_id, user_id)
    REFERENCES public.memory_items (id, user_id) ON DELETE CASCADE,
  -- Only session_id is nulled when a session is deleted; user_id stays intact.
  CONSTRAINT review_events_session_owner_fkey FOREIGN KEY (session_id, user_id)
    REFERENCES public.practice_sessions (id, user_id) ON DELETE SET NULL (session_id),
  CONSTRAINT review_events_rating_valid CHECK (rating IN ('again', 'hard', 'good', 'easy')),
  CONSTRAINT review_events_interval_valid CHECK (
    interval_days IS NULL OR (interval_days >= 0 AND interval_days <> 'NaN'::numeric)),
  CONSTRAINT review_events_response_time_nonneg CHECK (response_time_ms IS NULL OR response_time_ms >= 0)
);
CREATE INDEX review_events_user_reviewed_idx ON public.review_events (user_id, reviewed_at DESC);
CREATE INDEX review_events_memory_item_idx ON public.review_events (memory_item_id);
CREATE INDEX review_events_session_idx ON public.review_events (session_id) WHERE session_id IS NOT NULL;

-- Grants, RLS and owner policies for all user_id tables ------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['memory_palaces','palace_rooms','palace_locations','memory_items',
                           'practice_sessions','review_schedule','review_events']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Users can view their own rows" ON public.%I FOR SELECT TO authenticated USING (user_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "Users can insert their own rows" ON public.%I FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "Users can update their own rows" ON public.%I FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "Users can delete their own rows" ON public.%I FOR DELETE TO authenticated USING (user_id = auth.uid())', t);
  END LOOP;
END $$;

-- updated_at triggers
CREATE TRIGGER memory_palaces_set_updated_at BEFORE UPDATE ON public.memory_palaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER palace_rooms_set_updated_at BEFORE UPDATE ON public.palace_rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER palace_locations_set_updated_at BEFORE UPDATE ON public.palace_locations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER memory_items_set_updated_at BEFORE UPDATE ON public.memory_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER review_schedule_set_updated_at BEFORE UPDATE ON public.review_schedule
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();