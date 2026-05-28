# MODEL.md

# Data Model Design

The platform was designed around the idea that ESG data originates from multiple heterogeneous enterprise systems and must eventually converge into a single normalized reviewable format.

The core challenge was not calculation logic but preserving:

* source traceability
* auditability
* normalization history
* analyst review lifecycle

---

# Core Models

## RawIngestion

Purpose:
Stores source-of-truth raw uploaded data exactly as received.

Fields:

* source_type
* raw_data (JSON)
* uploaded_at
* uploaded_by

Why:
Enterprise ESG systems frequently contain malformed, inconsistent, or partially complete data. Preserving the raw payload allows:

* audit recovery
* reprocessing
* debugging normalization logic
* defensible compliance review

---

## NormalizedEmission

Purpose:
Stores normalized ESG emission records after transformation.

Fields:

* tenant
* raw_record
* scope
* category
* normalized_value
* unit
* emission_factor
* emissions_kg_co2e
* status
* edited_at
* edited_by

Why:
Different systems expose different units and structures. This model acts as the canonical ESG representation.

Supports:

* Scope 1
* Scope 2
* Scope 3 categorization

---

## ReviewQueue

Purpose:
Tracks analyst review workflow.

Fields:

* record
* status
* reviewed_at

Why:
Enterprise ESG reporting requires human verification before auditor signoff.

---

## AuditLog

Purpose:
Immutable audit trail for all important actions.

Fields:

* entity_type
* entity_id
* action
* old_data
* new_data
* performed_by
* timestamp

Why:
ESG reporting systems require traceability for regulatory and audit compliance.

---

## Tenant

Purpose:
Supports multi-tenancy.

Why:
Different enterprise clients must remain isolated while sharing the same infrastructure.

---

# Relationships

RawIngestion
↓
NormalizedEmission
↓
ReviewQueue

AuditLog records actions across all entities.

---

# Scope Categorization

## Scope 1

Direct fuel emissions

## Scope 2

Purchased electricity

## Scope 3

Business travel emissions

---

# Unit Normalization

Different source systems expose:

* liters
* kWh
* km

Normalization converts them into standardized emissions using emission factors.

---

# Why JSON Storage Was Chosen

Raw ingestion uses JSON instead of rigid relational schemas because:

* SAP exports vary heavily
* utility providers expose inconsistent formats
* travel systems differ across vendors

---

# Future Improvements

* versioned normalization pipelines
* configurable emission factors
* approval hierarchies
* anomaly detection
