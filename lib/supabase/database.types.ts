export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      event_attendees: {
        Row: {
          attended_at: string | null;
          created_at: string | null;
          event_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          attended_at?: string | null;
          created_at?: string | null;
          event_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          attended_at?: string | null;
          created_at?: string | null;
          event_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          capacity: number | null;
          category: string | null;
          cover_image_url: string | null;
          created_at: string | null;
          description: string | null;
          ends_at: string | null;
          id: string;
          location: string | null;
          starts_at: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          capacity?: number | null;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          location?: string | null;
          starts_at: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          capacity?: number | null;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          location?: string | null;
          starts_at?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          date_of_birth: string | null;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          location: string | null;
          phone: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          location?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          location?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_event_attendees: {
        Args: { target_event: string };
        Returns: {
          attendee_id: string;
          user_id: string;
          full_name: string | null;
          username: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          location: string | null;
          rsvped_at: string | null;
          attended_at: string | null;
        }[];
      };
      event_attendee_counts: {
        Args: { event_ids: string[] };
        Returns: {
          attendee_count: number;
          event_id: string;
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
