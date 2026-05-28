
# Breathe ESG Platform — Data Model

Enterprise ESG Data Modeling Layer for ingestion, normalization, review, and audit tracking.

Built using:

- Django
- Django ORM
- JSONField-based ingestion design
- Relational + audit hybrid modeling

---

# Overview

The data model follows a structured ESG pipeline:

- Raw Ingestion Layer
- Normalization Layer
- Review Layer
- Audit Layer

This ensures:
- Full traceability of ESG data
- Separation of raw and processed data
- Audit-ready transformation history
- Multi-tenant data isolation

---

# Models

---

## Tenant Model

Represents an organization using the platform.

### Fields

- name (CharField)
- created_at (DateTimeField)

### Purpose

- Enables multi-company support
- Ensures ESG data separation between clients

---

## RawIngestion Model

Stores raw uploaded ESG data before processing.

### Fields

- source_type (CharField: SAP | UTILITY | TRAVEL)
- raw_data (JSONField)
- uploaded_at (DateTimeField)
- processed (BooleanField)
- uploaded_by (CharField)

### Purpose

- Stores original ESG input without modification
- Supports multiple data formats using JSON structure
- Acts as immutable ingestion layer

---

## NormalizedEmission Model

Core ESG processing model.

### Fields

- tenant (ForeignKey → Tenant)
- raw_record (ForeignKey → RawIngestion)
- scope (CharField: Scope 1 | Scope 2 | Scope 3)
- category (CharField)
- normalized_value (FloatField)
- unit (CharField)
- emission_factor (FloatField)
- emissions_kg_co2e (FloatField)
- status (CharField: PENDING | APPROVED | REJECTED | FLAGGED)
- created_at (DateTimeField)
- edited_at (DateTimeField)
- edited_by (CharField)

### Purpose

- Converts raw data into standardized ESG emissions
- Ensures comparability across different data sources
- Stores computed emissions for audit stability

---

### Emission Factors Used

- SAP (fuel proxy): 2.68 kg CO₂e / litre  
- Utility electricity: 0.82 kg CO₂e / kWh  
- Travel: 0.255 kg CO₂e / km  

These are fixed baseline values used for prototype consistency.

---

## ReviewQueue Model

Handles analyst review workflow.

### Fields

- record (ForeignKey → NormalizedEmission)
- reviewer (CharField)
- review_notes (TextField)
- status (CharField: PENDING | APPROVED | REJECTED)
- reviewed_at (DateTimeField)

### Purpose

- Enables human validation of ESG records
- Separates workflow data from core ESG dataset

---

## AuditLog Model

Tracks all changes in the system.

### Fields

- entity_type (CharField)
- entity_id (IntegerField)
- action (CharField: INGESTED | APPROVED | REJECTED)
- old_data (JSONField)
- new_data (JSONField)
- performed_by (CharField)
- timestamp (DateTimeField)

### Purpose

- Maintains complete audit trail
- Stores before/after state of changes
- Ensures regulatory traceability

---

# Multi-Tenancy

- Every ESG record is linked to a Tenant
- Ensures strict separation between organizations
- In production, tenant assignment would be handled via authentication middleware

---

# Scope Classification Logic

- SAP-derived data → Scope 1 (proxy mapping)
- Utility data → Scope 2
- Travel data → Scope 3

This is a rule-based heuristic mapping, not a full GHG Protocol engine.

---

# Data Flow

RawIngestion → NormalizedEmission → ReviewQueue → AuditLog

This ensures:
- traceability
- validation
- audit compliance
- structured ESG lifecycle tracking

---

# What This Model Does NOT Include

- Machine learning-based anomaly detection
- Full GHG Protocol compliance engine
- Row-level database security

# Breathe ESG Platform — Data Model

Enterprise ESG Data Modeling Layer for ingestion, normalization, review, and audit tracking.

Built using:

- Django
- Django ORM
- JSONField-based ingestion design
- Relational + audit hybrid modeling

---

# Overview

The data model follows a structured ESG pipeline:

- Raw Ingestion Layer
- Normalization Layer
- Review Layer
- Audit Layer

This ensures:
- Full traceability of ESG data
- Separation of raw and processed data
- Audit-ready transformation history
- Multi-tenant data isolation

---

# Models

---

## Tenant Model

Represents an organization using the platform.

### Fields

- name (CharField)
- created_at (DateTimeField)

### Purpose

- Enables multi-company support
- Ensures ESG data separation between clients

---

## RawIngestion Model

Stores raw uploaded ESG data before processing.

### Fields

- source_type (CharField: SAP | UTILITY | TRAVEL)
- raw_data (JSONField)
- uploaded_at (DateTimeField)
- processed (BooleanField)
- uploaded_by (CharField)

### Purpose

- Stores original ESG input without modification
- Supports multiple data formats using JSON structure
- Acts as immutable ingestion layer

---

## NormalizedEmission Model

Core ESG processing model.

### Fields

- tenant (ForeignKey → Tenant)
- raw_record (ForeignKey → RawIngestion)
- scope (CharField: Scope 1 | Scope 2 | Scope 3)
- category (CharField)
- normalized_value (FloatField)
- unit (CharField)
- emission_factor (FloatField)
- emissions_kg_co2e (FloatField)
- status (CharField: PENDING | APPROVED | REJECTED | FLAGGED)
- created_at (DateTimeField)
- edited_at (DateTimeField)
- edited_by (CharField)

### Purpose

- Converts raw data into standardized ESG emissions
- Ensures comparability across different data sources
- Stores computed emissions for audit stability

---

### Emission Factors Used

- SAP (fuel proxy): 2.68 kg CO₂e / litre  
- Utility electricity: 0.82 kg CO₂e / kWh  
- Travel: 0.255 kg CO₂e / km  

These are fixed baseline values used for prototype consistency.

---

## ReviewQueue Model

Handles analyst review workflow.

### Fields

- record (ForeignKey → NormalizedEmission)
- reviewer (CharField)
- review_notes (TextField)
- status (CharField: PENDING | APPROVED | REJECTED)
- reviewed_at (DateTimeField)

### Purpose

- Enables human validation of ESG records
- Separates workflow data from core ESG dataset

---

## AuditLog Model

Tracks all changes in the system.

### Fields

- entity_type (CharField)
- entity_id (IntegerField)
- action (CharField: INGESTED | APPROVED | REJECTED)
- old_data (JSONField)
- new_data (JSONField)
- performed_by (CharField)
- timestamp (DateTimeField)

### Purpose

- Maintains complete audit trail
- Stores before/after state of changes
- Ensures regulatory traceability

---

# Multi-Tenancy

- Every ESG record is linked to a Tenant
- Ensures strict separation between organizations
- In production, tenant assignment would be handled via authentication middleware

---

# Scope Classification Logic

- SAP-derived data → Scope 1 (proxy mapping)
- Utility data → Scope 2
- Travel data → Scope 3

This is a rule-based heuristic mapping, not a full GHG Protocol engine.

---

# Data Flow

RawIngestion → NormalizedEmission → ReviewQueue → AuditLog

This ensures:
- traceability
- validation
- audit compliance
- structured ESG lifecycle tracking

---

# What This Model Does NOT Include

- Machine learning-based anomaly detection
- Full GHG Protocol compliance engine
- Row-level database security
- Real-time SAP integration (IDoc/OData/BAPI)
