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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_description: string
          action_type: string
          ai_system_id: string | null
          created_at: string | null
          id: string
          is_system_action: boolean | null
          metadata: Json | null
          organization_id: string
          target_id: string | null
          target_name: string | null
          target_type: string | null
          user_avatar_url: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          ai_system_id?: string | null
          created_at?: string | null
          id?: string
          is_system_action?: boolean | null
          metadata?: Json | null
          organization_id: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          user_avatar_url?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          ai_system_id?: string | null
          created_at?: string | null
          id?: string
          is_system_action?: boolean | null
          metadata?: Json | null
          organization_id?: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          user_avatar_url?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_audit_events: {
        Row: {
          action: string | null
          ai_system_id: string
          alternatives: string[] | null
          confidence: number | null
          created_at: string | null
          details: Json | null
          duration_ms: number | null
          event_id_external: string
          event_name: string | null
          event_timestamp: string
          event_type: string
          id: string
          input_data: Json | null
          metadata: Json | null
          output_data: Json | null
          override_by: string | null
          override_decision: string | null
          override_reason: string | null
          parent_span_id: string | null
          pii_detected: boolean | null
          pii_redacted: boolean | null
          reasoning: string | null
          response_time_seconds: number | null
          session_id: string | null
          span_id: string | null
          tokens_input: number | null
          tokens_output: number | null
          trace_id: string
        }
        Insert: {
          action?: string | null
          ai_system_id: string
          alternatives?: string[] | null
          confidence?: number | null
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          event_id_external: string
          event_name?: string | null
          event_timestamp: string
          event_type: string
          id?: string
          input_data?: Json | null
          metadata?: Json | null
          output_data?: Json | null
          override_by?: string | null
          override_decision?: string | null
          override_reason?: string | null
          parent_span_id?: string | null
          pii_detected?: boolean | null
          pii_redacted?: boolean | null
          reasoning?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          span_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          trace_id: string
        }
        Update: {
          action?: string | null
          ai_system_id?: string
          alternatives?: string[] | null
          confidence?: number | null
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          event_id_external?: string
          event_name?: string | null
          event_timestamp?: string
          event_type?: string
          id?: string
          input_data?: Json | null
          metadata?: Json | null
          output_data?: Json | null
          override_by?: string | null
          override_decision?: string | null
          override_reason?: string | null
          parent_span_id?: string | null
          pii_detected?: boolean | null
          pii_redacted?: boolean | null
          reasoning?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          span_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          trace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_audit_events_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_emergency_stops: {
        Row: {
          active_sessions_terminated: number | null
          ai_system_id: string | null
          created_at: string | null
          id: string
          reason: string
          resume_reason: string | null
          resumed_at: string | null
          resumed_by_user_id: string | null
          stop_type: string
          stopped_at: string
          triggered_by_email: string
          triggered_by_user_id: string | null
        }
        Insert: {
          active_sessions_terminated?: number | null
          ai_system_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          resume_reason?: string | null
          resumed_at?: string | null
          resumed_by_user_id?: string | null
          stop_type: string
          stopped_at: string
          triggered_by_email: string
          triggered_by_user_id?: string | null
        }
        Update: {
          active_sessions_terminated?: number | null
          ai_system_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          resume_reason?: string | null
          resumed_at?: string | null
          resumed_by_user_id?: string | null
          stop_type?: string
          stopped_at?: string
          triggered_by_email?: string
          triggered_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_emergency_stops_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_evidence_generations: {
        Row: {
          ai_system_id: string | null
          covers_articles: string[] | null
          created_at: string | null
          document_id: string | null
          error_message: string | null
          events_count: number | null
          evidence_period_end: string
          evidence_period_start: string
          evidence_type: string
          generated_at: string | null
          id: string
          status: string | null
          summary_data: Json | null
        }
        Insert: {
          ai_system_id?: string | null
          covers_articles?: string[] | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          events_count?: number | null
          evidence_period_end: string
          evidence_period_start: string
          evidence_type: string
          generated_at?: string | null
          id?: string
          status?: string | null
          summary_data?: Json | null
        }
        Update: {
          ai_system_id?: string | null
          covers_articles?: string[] | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          events_count?: number | null
          evidence_period_end?: string
          evidence_period_start?: string
          evidence_type?: string
          generated_at?: string | null
          id?: string
          status?: string | null
          summary_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_evidence_generations_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_evidence_generations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_hitl_rules: {
        Row: {
          ai_system_id: string
          approval_timeout_minutes: number | null
          auto_reject_on_timeout: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          notify_emails: string[] | null
          notify_slack_channel: string | null
          requires_approval: boolean | null
          rule_description: string | null
          rule_name: string
          trigger_conditions: Json
          updated_at: string | null
        }
        Insert: {
          ai_system_id: string
          approval_timeout_minutes?: number | null
          auto_reject_on_timeout?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notify_emails?: string[] | null
          notify_slack_channel?: string | null
          requires_approval?: boolean | null
          rule_description?: string | null
          rule_name: string
          trigger_conditions: Json
          updated_at?: string | null
        }
        Update: {
          ai_system_id?: string
          approval_timeout_minutes?: number | null
          auto_reject_on_timeout?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notify_emails?: string[] | null
          notify_slack_channel?: string | null
          requires_approval?: boolean | null
          rule_description?: string | null
          rule_name?: string
          trigger_conditions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_hitl_rules_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_human_overrides: {
        Row: {
          ai_system_id: string
          audit_event_id: string | null
          created_at: string | null
          hitl_rule_id: string | null
          human_decision: string | null
          human_reasoning: string | null
          id: string
          original_action: string
          original_confidence: number | null
          original_reasoning: string | null
          override_type: string
          requested_at: string
          responded_at: string | null
          response_time_seconds: number | null
          reviewer_email: string
          reviewer_user_id: string | null
          status: string | null
        }
        Insert: {
          ai_system_id: string
          audit_event_id?: string | null
          created_at?: string | null
          hitl_rule_id?: string | null
          human_decision?: string | null
          human_reasoning?: string | null
          id?: string
          original_action: string
          original_confidence?: number | null
          original_reasoning?: string | null
          override_type: string
          requested_at: string
          responded_at?: string | null
          response_time_seconds?: number | null
          reviewer_email: string
          reviewer_user_id?: string | null
          status?: string | null
        }
        Update: {
          ai_system_id?: string
          audit_event_id?: string | null
          created_at?: string | null
          hitl_rule_id?: string | null
          human_decision?: string | null
          human_reasoning?: string | null
          id?: string
          original_action?: string
          original_confidence?: number | null
          original_reasoning?: string | null
          override_type?: string
          requested_at?: string
          responded_at?: string | null
          response_time_seconds?: number | null
          reviewer_email?: string
          reviewer_user_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_human_overrides_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_human_overrides_audit_event_id_fkey"
            columns: ["audit_event_id"]
            isOneToOne: false
            referencedRelation: "agent_audit_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_human_overrides_hitl_rule_id_fkey"
            columns: ["hitl_rule_id"]
            isOneToOne: false
            referencedRelation: "agent_hitl_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_incidents: {
        Row: {
          affected_individual_categories: string[] | null
          affected_individuals_count: number | null
          ai_system_id: string
          created_at: string | null
          description: string
          harm_description: string | null
          id: string
          incident_detected_at: string
          incident_occurred_at: string
          incident_reported_at: string | null
          incident_resolved_at: string | null
          incident_type: string
          organization_id: string
          preventive_measures: string | null
          regulator_reference: string | null
          related_event_ids: string[] | null
          reported_by_email: string | null
          reported_by_user_id: string | null
          reported_to_regulator: boolean | null
          reported_to_regulator_at: string | null
          resolution_description: string | null
          severity: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_individual_categories?: string[] | null
          affected_individuals_count?: number | null
          ai_system_id: string
          created_at?: string | null
          description: string
          harm_description?: string | null
          id?: string
          incident_detected_at: string
          incident_occurred_at: string
          incident_reported_at?: string | null
          incident_resolved_at?: string | null
          incident_type: string
          organization_id: string
          preventive_measures?: string | null
          regulator_reference?: string | null
          related_event_ids?: string[] | null
          reported_by_email?: string | null
          reported_by_user_id?: string | null
          reported_to_regulator?: boolean | null
          reported_to_regulator_at?: string | null
          resolution_description?: string | null
          severity: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_individual_categories?: string[] | null
          affected_individuals_count?: number | null
          ai_system_id?: string
          created_at?: string | null
          description?: string
          harm_description?: string | null
          id?: string
          incident_detected_at?: string
          incident_occurred_at?: string
          incident_reported_at?: string | null
          incident_resolved_at?: string | null
          incident_type?: string
          organization_id?: string
          preventive_measures?: string | null
          regulator_reference?: string | null
          related_event_ids?: string[] | null
          reported_by_email?: string | null
          reported_by_user_id?: string | null
          reported_to_regulator?: boolean | null
          reported_to_regulator_at?: string | null
          resolution_description?: string | null
          severity?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_incidents_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_relationships: {
        Row: {
          child_agent_id: string
          created_at: string | null
          delegation_rules: Json | null
          id: string
          organization_id: string
          parent_agent_id: string
          relationship_type: string
        }
        Insert: {
          child_agent_id: string
          created_at?: string | null
          delegation_rules?: Json | null
          id?: string
          organization_id: string
          parent_agent_id: string
          relationship_type: string
        }
        Update: {
          child_agent_id?: string
          created_at?: string | null
          delegation_rules?: Json | null
          id?: string
          organization_id?: string
          parent_agent_id?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_relationships_child_agent_id_fkey"
            columns: ["child_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_relationships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_relationships_parent_agent_id_fkey"
            columns: ["parent_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_sdk_configs: {
        Row: {
          agent_id_external: string
          ai_system_id: string
          api_key_created_at: string | null
          api_key_hash: string
          api_key_prefix: string
          created_at: string | null
          encryption_enabled: boolean | null
          id: string
          is_active: boolean | null
          log_retention_months: number | null
          metadata_only_mode: boolean | null
          pii_redaction_enabled: boolean | null
          updated_at: string | null
          webhook_events: string[] | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          agent_id_external: string
          ai_system_id: string
          api_key_created_at?: string | null
          api_key_hash: string
          api_key_prefix: string
          created_at?: string | null
          encryption_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          log_retention_months?: number | null
          metadata_only_mode?: boolean | null
          pii_redaction_enabled?: boolean | null
          updated_at?: string | null
          webhook_events?: string[] | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          agent_id_external?: string
          ai_system_id?: string
          api_key_created_at?: string | null
          api_key_hash?: string
          api_key_prefix?: string
          created_at?: string | null
          encryption_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          log_retention_months?: number | null
          metadata_only_mode?: boolean | null
          pii_redaction_enabled?: boolean | null
          updated_at?: string | null
          webhook_events?: string[] | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_sdk_configs_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: true
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_statistics: {
        Row: {
          ai_system_id: string
          avg_response_time_ms: number | null
          avg_tokens_per_action: number | null
          computed_at: string | null
          decisions: number | null
          error_rate: number | null
          errors: number | null
          escalation_rate: number | null
          escalations: number | null
          human_overrides: number | null
          human_oversight_rate: number | null
          id: string
          override_rate: number | null
          period_end: string
          period_start: string
          period_type: string
          tool_calls: number | null
          total_events: number | null
        }
        Insert: {
          ai_system_id: string
          avg_response_time_ms?: number | null
          avg_tokens_per_action?: number | null
          computed_at?: string | null
          decisions?: number | null
          error_rate?: number | null
          errors?: number | null
          escalation_rate?: number | null
          escalations?: number | null
          human_overrides?: number | null
          human_oversight_rate?: number | null
          id?: string
          override_rate?: number | null
          period_end: string
          period_start: string
          period_type: string
          tool_calls?: number | null
          total_events?: number | null
        }
        Update: {
          ai_system_id?: string
          avg_response_time_ms?: number | null
          avg_tokens_per_action?: number | null
          computed_at?: string | null
          decisions?: number | null
          error_rate?: number | null
          errors?: number | null
          escalation_rate?: number | null
          escalations?: number | null
          human_overrides?: number | null
          human_oversight_rate?: number | null
          id?: string
          override_rate?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          tool_calls?: number | null
          total_events?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_statistics_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_system_certifications: {
        Row: {
          ai_system_id: string
          cert_id: string | null
          certified_at: string | null
          compliance_score: number | null
          created_at: string | null
          id: string
          next_verification_at: string | null
          requirements_snapshot: Json | null
          status: string | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          ai_system_id: string
          cert_id?: string | null
          certified_at?: string | null
          compliance_score?: number | null
          created_at?: string | null
          id?: string
          next_verification_at?: string | null
          requirements_snapshot?: Json | null
          status?: string | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          ai_system_id?: string
          cert_id?: string | null
          certified_at?: string | null
          compliance_score?: number | null
          created_at?: string | null
          id?: string
          next_verification_at?: string | null
          requirements_snapshot?: Json | null
          status?: string | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_system_certifications_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: true
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_system_requirements: {
        Row: {
          ai_system_id: string
          article_id: string
          article_title: string
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          id: string
          linked_document_id: string | null
          linked_evidence_id: string | null
          notes: string | null
          requirement_template_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_system_id: string
          article_id: string
          article_title: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          linked_document_id?: string | null
          linked_evidence_id?: string | null
          notes?: string | null
          requirement_template_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_system_id?: string
          article_id?: string
          article_title?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          linked_document_id?: string | null
          linked_evidence_id?: string | null
          notes?: string | null
          requirement_template_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_system_requirements_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_system_requirements_requirement_template_id_fkey"
            columns: ["requirement_template_id"]
            isOneToOne: false
            referencedRelation: "requirement_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_systems: {
        Row: {
          agent_capabilities: string[] | null
          agent_framework: string | null
          assessment_data: Json | null
          category: string | null
          compliance_progress: number | null
          compliance_status: string | null
          created_at: string | null
          created_by: string | null
          deployment_status: string | null
          description: string | null
          established_in_eu: boolean | null
          id: string
          is_multi_agent: boolean | null
          lifecycle_status: string | null
          model_name: string | null
          name: string
          organization_id: string
          processes_in_eu: boolean | null
          provider: string | null
          risk_level: string
          sdk_connected: boolean | null
          sdk_events_total: number | null
          sdk_last_event_at: string | null
          serves_eu: boolean | null
          system_type: string
          updated_at: string | null
        }
        Insert: {
          agent_capabilities?: string[] | null
          agent_framework?: string | null
          assessment_data?: Json | null
          category?: string | null
          compliance_progress?: number | null
          compliance_status?: string | null
          created_at?: string | null
          created_by?: string | null
          deployment_status?: string | null
          description?: string | null
          established_in_eu?: boolean | null
          id?: string
          is_multi_agent?: boolean | null
          lifecycle_status?: string | null
          model_name?: string | null
          name: string
          organization_id: string
          processes_in_eu?: boolean | null
          provider?: string | null
          risk_level?: string
          sdk_connected?: boolean | null
          sdk_events_total?: number | null
          sdk_last_event_at?: string | null
          serves_eu?: boolean | null
          system_type?: string
          updated_at?: string | null
        }
        Update: {
          agent_capabilities?: string[] | null
          agent_framework?: string | null
          assessment_data?: Json | null
          category?: string | null
          compliance_progress?: number | null
          compliance_status?: string | null
          created_at?: string | null
          created_by?: string | null
          deployment_status?: string | null
          description?: string | null
          established_in_eu?: boolean | null
          id?: string
          is_multi_agent?: boolean | null
          lifecycle_status?: string | null
          model_name?: string | null
          name?: string
          organization_id?: string
          processes_in_eu?: boolean | null
          provider?: string | null
          risk_level?: string
          sdk_connected?: boolean | null
          sdk_events_total?: number | null
          sdk_last_event_at?: string | null
          serves_eu?: boolean | null
          system_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_systems_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_settings: {
        Row: {
          ai_system_id: string | null
          alert_type: string
          created_at: string | null
          email_enabled: boolean | null
          email_recipients: string[] | null
          id: string
          is_active: boolean | null
          organization_id: string
          slack_enabled: boolean | null
          slack_webhook_url: string | null
          threshold_period_minutes: number | null
          threshold_value: number | null
          updated_at: string | null
        }
        Insert: {
          ai_system_id?: string | null
          alert_type: string
          created_at?: string | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          threshold_period_minutes?: number | null
          threshold_value?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_system_id?: string | null
          alert_type?: string
          created_at?: string | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          threshold_period_minutes?: number | null
          threshold_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_settings_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      document_generation_log: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          document_id: string | null
          ai_system_id: string | null
          document_type: string
          tokens_input: number | null
          tokens_output: number | null
          model_used: string | null
          generation_time_ms: number | null
          status: string | null
          error_message: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          document_id?: string | null
          ai_system_id?: string | null
          document_type: string
          tokens_input?: number | null
          tokens_output?: number | null
          model_used?: string | null
          generation_time_ms?: number | null
          status?: string | null
          error_message?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          document_id?: string | null
          ai_system_id?: string | null
          document_type?: string
          tokens_input?: number | null
          tokens_output?: number | null
          model_used?: string | null
          generation_time_ms?: number | null
          status?: string | null
          error_message?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_generation_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_log_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_system_id: string | null
          created_at: string | null
          created_by: string | null
          document_type: string
          file_size: string | null
          generated_by: string | null
          generation_prompt: Json | null
          id: string
          mime_type: string | null
          name: string
          organization_id: string
          parent_document_id: string | null
          status: string | null
          storage_path: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          ai_system_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type: string
          file_size?: string | null
          generated_by?: string | null
          generation_prompt?: Json | null
          id?: string
          mime_type?: string | null
          name: string
          organization_id: string
          parent_document_id?: string | null
          status?: string | null
          storage_path?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          ai_system_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          file_size?: string | null
          generated_by?: string | null
          generation_prompt?: Json | null
          id?: string
          mime_type?: string | null
          name?: string
          organization_id?: string
          parent_document_id?: string | null
          status?: string | null
          storage_path?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          ai_system_id: string | null
          description: string | null
          file_size: string | null
          file_type: string
          id: string
          linked_to_article: string | null
          linked_to_description: string | null
          linked_to_requirement_id: string | null
          mime_type: string | null
          name: string
          organization_id: string
          storage_path: string
          tags: string[] | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          ai_system_id?: string | null
          description?: string | null
          file_size?: string | null
          file_type: string
          id?: string
          linked_to_article?: string | null
          linked_to_description?: string | null
          linked_to_requirement_id?: string | null
          mime_type?: string | null
          name: string
          organization_id: string
          storage_path: string
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          ai_system_id?: string | null
          description?: string | null
          file_size?: string | null
          file_type?: string
          id?: string
          linked_to_article?: string | null
          linked_to_description?: string | null
          linked_to_requirement_id?: string | null
          mime_type?: string | null
          name?: string
          organization_id?: string
          storage_path?: string
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_linked_to_requirement_id_fkey"
            columns: ["linked_to_requirement_id"]
            isOneToOne: false
            referencedRelation: "ai_system_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_api_keys: {
        Row: {
          created_at: string | null
          created_by: string
          environment: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          organization_id: string
          revoked_at: string | null
          revoked_by: string | null
          status: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          environment?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          organization_id: string
          revoked_at?: string | null
          revoked_by?: string | null
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          environment?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string
          revoked_at?: string | null
          revoked_by?: string | null
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          company_size: string | null
          country: string | null
          created_at: string | null
          has_eu_presence: boolean | null
          id: string
          industry: string | null
          legal_name: string | null
          logo_url: string | null
          max_ai_systems: number | null
          max_team_members: number | null
          name: string
          plan: string | null
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string | null
          token_reset_date: string | null
          tokens_used_this_month: number | null
          trust_center_enabled: boolean | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          has_eu_presence?: boolean | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          logo_url?: string | null
          max_ai_systems?: number | null
          max_team_members?: number | null
          name: string
          plan?: string | null
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          token_reset_date?: string | null
          tokens_used_this_month?: number | null
          trust_center_enabled?: boolean | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          has_eu_presence?: boolean | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          logo_url?: string | null
          max_ai_systems?: number | null
          max_team_members?: number | null
          name?: string
          plan?: string | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          token_reset_date?: string | null
          tokens_used_this_month?: number | null
          trust_center_enabled?: boolean | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_comply_sessions: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          ai_system_id: string | null
          status: string
          current_section: string | null
          progress_percentage: number | null
          form_data: Json | null
          sections_completed: Json | null
          chat_messages: Json | null
          risk_classification: string | null
          applicable_articles: Json | null
          documents_generated: Json | null
          subscription_tier: string | null
          tokens_used: number | null
          started_at: string | null
          completed_at: string | null
          last_activity_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          ai_system_id?: string | null
          status?: string
          current_section?: string | null
          progress_percentage?: number | null
          form_data?: Json | null
          sections_completed?: Json | null
          chat_messages?: Json | null
          risk_classification?: string | null
          applicable_articles?: Json | null
          documents_generated?: Json | null
          subscription_tier?: string | null
          tokens_used?: number | null
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          ai_system_id?: string | null
          status?: string
          current_section?: string | null
          progress_percentage?: number | null
          form_data?: Json | null
          sections_completed?: Json | null
          chat_messages?: Json | null
          risk_classification?: string | null
          applicable_articles?: Json | null
          documents_generated?: Json | null
          subscription_tier?: string | null
          tokens_used?: number | null
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_comply_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_comply_sessions_ai_system_id_fkey"
            columns: ["ai_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          file_size: string | null
          file_url: string | null
          generated_by: string | null
          generated_by_avatar: string | null
          generated_by_name: string | null
          id: string
          include_options: Json | null
          name: string
          organization_id: string
          report_type: string
          scope: string | null
          selected_system_id: string | null
          status: string
          systems_included: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: string | null
          file_url?: string | null
          generated_by?: string | null
          generated_by_avatar?: string | null
          generated_by_name?: string | null
          id?: string
          include_options?: Json | null
          name: string
          organization_id: string
          report_type: string
          scope?: string | null
          selected_system_id?: string | null
          status?: string
          systems_included?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: string | null
          file_url?: string | null
          generated_by?: string | null
          generated_by_avatar?: string | null
          generated_by_name?: string | null
          id?: string
          include_options?: Json | null
          name?: string
          organization_id?: string
          report_type?: string
          scope?: string | null
          selected_system_id?: string | null
          status?: string
          systems_included?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_selected_system_id_fkey"
            columns: ["selected_system_id"]
            isOneToOne: false
            referencedRelation: "ai_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_templates: {
        Row: {
          applies_to_risk_levels: string[] | null
          applies_to_system_types: string[] | null
          article_id: string
          article_title: string
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          applies_to_risk_levels?: string[] | null
          applies_to_system_types?: string[] | null
          article_id: string
          article_title: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
        }
        Update: {
          applies_to_risk_levels?: string[] | null
          applies_to_system_types?: string[] | null
          article_id?: string
          article_title?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      team_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: string | null
          status: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: string | null
          status?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: string | null
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: { Args: never; Returns: string }
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
  public: {
    Enums: {},
  },
} as const
