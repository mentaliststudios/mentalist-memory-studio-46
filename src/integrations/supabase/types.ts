export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      memory_items: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          location_id: string | null
          mnemonic: string | null
          recall_answer: string | null
          recall_prompt: string | null
          source_text: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          visual_association: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          mnemonic?: string | null
          recall_answer?: string | null
          recall_prompt?: string | null
          source_text?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          visual_association?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          mnemonic?: string | null
          recall_answer?: string | null
          recall_prompt?: string | null
          source_text?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          visual_association?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_items_location_owner_fkey"
            columns: ["location_id", "user_id"]
            isOneToOne: false
            referencedRelation: "palace_locations"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "memory_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_palaces: {
        Row: {
          archived_at: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
          template_key: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          template_key?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          template_key?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_palaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      palace_locations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          position_x: number | null
          position_y: number | null
          room_id: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          position_x?: number | null
          position_y?: number | null
          room_id: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          position_x?: number | null
          position_y?: number | null
          room_id?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "palace_locations_room_owner_fkey"
            columns: ["room_id", "user_id"]
            isOneToOne: false
            referencedRelation: "palace_rooms"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "palace_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      palace_rooms: {
        Row: {
          created_at: string
          id: string
          name: string
          palace_id: string
          room_type: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          palace_id: string
          room_type: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          palace_id?: string
          room_type?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "palace_rooms_palace_owner_fkey"
            columns: ["palace_id", "user_id"]
            isOneToOne: false
            referencedRelation: "memory_palaces"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "palace_rooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          activity_key: string
          completed_at: string | null
          correct_items: number | null
          difficulty: string | null
          duration_seconds: number
          id: string
          result_data: Json
          score: number | null
          session_type: string
          started_at: string
          status: string
          total_items: number | null
          user_id: string
        }
        Insert: {
          activity_key: string
          completed_at?: string | null
          correct_items?: number | null
          difficulty?: string | null
          duration_seconds?: number
          id?: string
          result_data?: Json
          score?: number | null
          session_type: string
          started_at?: string
          status?: string
          total_items?: number | null
          user_id: string
        }
        Update: {
          activity_key?: string
          completed_at?: string | null
          correct_items?: number | null
          difficulty?: string | null
          duration_seconds?: number
          id?: string
          result_data?: Json
          score?: number | null
          session_type?: string
          started_at?: string
          status?: string
          total_items?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string | null
          id: string
          locale: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          locale?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_events: {
        Row: {
          id: string
          interval_days: number | null
          memory_item_id: string
          next_due_at: string | null
          previous_due_at: string | null
          rating: string
          response_time_ms: number | null
          reviewed_at: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          interval_days?: number | null
          memory_item_id: string
          next_due_at?: string | null
          previous_due_at?: string | null
          rating: string
          response_time_ms?: number | null
          reviewed_at?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          interval_days?: number | null
          memory_item_id?: string
          next_due_at?: string | null
          previous_due_at?: string | null
          rating?: string
          response_time_ms?: number | null
          reviewed_at?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_events_item_owner_fkey"
            columns: ["memory_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "memory_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "review_events_session_owner_fkey"
            columns: ["session_id", "user_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "review_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_schedule: {
        Row: {
          created_at: string
          due_at: string
          ease_factor: number
          id: string
          interval_days: number
          lapses: number
          last_reviewed_at: string | null
          memory_item_id: string
          repetitions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_at: string
          ease_factor?: number
          id?: string
          interval_days?: number
          lapses?: number
          last_reviewed_at?: string | null
          memory_item_id: string
          repetitions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          lapses?: number
          last_reviewed_at?: string | null
          memory_item_id?: string
          repetitions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_schedule_item_owner_fkey"
            columns: ["memory_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "memory_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "review_schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_my_profile: { Args: never; Returns: undefined }
      profile_display_name_from_metadata: {
        Args: { meta: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
