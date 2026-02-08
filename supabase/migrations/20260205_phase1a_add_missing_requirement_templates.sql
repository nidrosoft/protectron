-- Phase 1A: Add Missing EU AI Act Requirement Templates
-- Adds requirement templates for Articles 17, 27, 47, 49, 61, 62, 71
-- These were identified as gaps in the existing compliance coverage

-- Article 17: Quality Management System
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-17', 'Article 17', 'Quality Management System', 'Implement a quality management system covering the AI system lifecycle, including design, development, testing, and post-market monitoring processes', ARRAY['high'], 1),
  ('art-17', 'Article 17', 'QMS Documentation', 'Document all QMS policies, procedures, and processes in a structured and auditable manner', ARRAY['high'], 2),
  ('art-17', 'Article 17', 'QMS Review & Update', 'Establish regular review cycles to keep the quality management system current and effective', ARRAY['high'], 3),
  ('art-17', 'Article 17', 'Change Management Procedures', 'Manage changes to the AI system through structured change control processes including impact assessment and approval workflows', ARRAY['high'], 4),
  ('art-17', 'Article 17', 'Standards Compliance Mapping', 'Map compliance requirements to harmonised standards (ISO 42001, ISO 23894, etc.) and track conformity', ARRAY['high'], 5);

-- Article 61: Post-Market Monitoring
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-61', 'Article 61', 'Post-Market Monitoring Plan', 'Establish a post-market monitoring system proportionate to the nature and risk level of the AI system', ARRAY['high', 'limited'], 1),
  ('art-61', 'Article 61', 'Performance Tracking', 'Continuously track AI system performance, accuracy, and reliability metrics post-deployment', ARRAY['high', 'limited'], 2),
  ('art-61', 'Article 61', 'Corrective Actions', 'Implement corrective and preventive actions based on post-market monitoring findings', ARRAY['high'], 3);

-- Article 62: Serious Incident Reporting
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-62', 'Article 62', 'Incident Response Plan', 'Establish comprehensive procedures for identifying, classifying, and handling serious incidents involving AI systems', ARRAY['high', 'limited'], 1),
  ('art-62', 'Article 62', 'Authority Notification', 'Report serious incidents to market surveillance authorities within required timelines (72 hours for initial report)', ARRAY['high'], 2),
  ('art-62', 'Article 62', 'Incident Investigation', 'Investigate and document root causes of incidents, including corrective measures taken', ARRAY['high'], 3);

-- Article 27: Fundamental Rights Impact Assessment
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-27', 'Article 27', 'Fundamental Rights Impact Assessment', 'Conduct a thorough assessment of the AI system''s impact on fundamental rights before deployment', ARRAY['high'], 1),
  ('art-27', 'Article 27', 'FRIA Stakeholder Consultation', 'Consult with affected parties, representative groups, and data protection authorities as part of the FRIA process', ARRAY['high'], 2),
  ('art-27', 'Article 27', 'FRIA Mitigation Measures', 'Document specific measures to prevent or mitigate identified fundamental rights risks', ARRAY['high'], 3);

-- Article 49: CE Marking
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-49', 'Article 49', 'CE Marking Affixation', 'Affix CE marking visibly, legibly, and indelibly to the high-risk AI system or its documentation', ARRAY['high'], 1),
  ('art-49', 'Article 49', 'Conformity Assessment Completion', 'Complete all applicable conformity assessment procedures before affixing CE marking', ARRAY['high'], 2);

-- Article 47/48: EU Declaration of Conformity
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-47', 'Article 47', 'EU Declaration of Conformity', 'Draw up a written machine-readable EU declaration of conformity containing all required elements', ARRAY['high'], 1),
  ('art-47', 'Article 47', 'Conformity Documentation Maintenance', 'Keep the EU declaration of conformity up to date and available for 10 years after the AI system is placed on the market', ARRAY['high'], 2);

-- Article 71: EU Database Registration
INSERT INTO requirement_templates (article_id, article_title, title, description, applies_to_risk_levels, sort_order)
VALUES
  ('art-71', 'Article 71', 'EU Database Registration', 'Register the high-risk AI system in the EU public database before placing it on the market', ARRAY['high'], 1),
  ('art-71', 'Article 71', 'Registration Information Maintenance', 'Keep EU database registration information accurate and up to date throughout the system''s lifecycle', ARRAY['high'], 2);
