export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      match_scores: {
        Row: {
          created_at: string
          id: number
          match: number | null
          score_team1: number | null
          score_team2: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          match?: number | null
          score_team1?: number | null
          score_team2?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          match?: number | null
          score_team1?: number | null
          score_team2?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_match_fkey"
            columns: ["match"]
            isOneToOne: false
            referencedRelation: "matchs"
            referencedColumns: ["id"]
          },
        ]
      }
      matchs: {
        Row: {
          created_at: string
          id: number
          number: number
          team1: number
          team2: number
          tournament: number
        }
        Insert: {
          created_at?: string
          id?: number
          number: number
          team1: number
          team2: number
          tournament: number
        }
        Update: {
          created_at?: string
          id?: number
          number?: number
          team1?: number
          team2?: number
          tournament?: number
        }
        Relationships: [
          {
            foreignKeyName: "day_team1_fkey"
            columns: ["team1"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "day_team1_fkey"
            columns: ["team1"]
            isOneToOne: false
            referencedRelation: "tournament_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "day_team2_fkey"
            columns: ["team2"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "day_team2_fkey"
            columns: ["team2"]
            isOneToOne: false
            referencedRelation: "tournament_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "day_tournament_fkey"
            columns: ["tournament"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: number
          name: string
          tel: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
          tel?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          tel?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          availabilities: Json | null
          created_at: string
          id: number
          name: string
          player1: number | null
          player2: number | null
        }
        Insert: {
          availabilities?: Json | null
          created_at?: string
          id?: number
          name?: string
          player1?: number | null
          player2?: number | null
        }
        Update: {
          availabilities?: Json | null
          created_at?: string
          id?: number
          name?: string
          player1?: number | null
          player2?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_player1_fkey"
            columns: ["player1"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_player2_fkey"
            columns: ["player2"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_teams: {
        Row: {
          created_at: string
          id: number
          team: number
          tournament: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          team: number
          tournament?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          team?: number
          tournament?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "tournament_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_fkey"
            columns: ["tournament"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          id: number
          month_start: number | null
          name: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          year: number
        }
        Insert: {
          created_at?: string
          id?: number
          month_start?: number | null
          name?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          year: number
        }
        Update: {
          created_at?: string
          id?: number
          month_start?: number | null
          name?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      tournament_summary: {
        Row: {
          goal_average: number | null
          number: number | null
          team_id: number | null
          team_name: string | null
          total_points: number | null
          tournament: number | null
        }
        Relationships: [
          {
            foreignKeyName: "day_tournament_fkey"
            columns: ["tournament"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tournament_status: "not_started" | "started" | "finished"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      tournament_status: ["not_started", "started", "finished"],
    },
  },
} as const

