Breathe ESG Platform
Overview

The data model is built around a four-layer pipeline:

Raw Ingestion → Normalization → Review → Audit

Each layer has a dedicated model. The design ensures that:

Raw data is never lost
Transformations are traceable
All decisions are auditable
Workflow state is separated from analytical data
Models
1. Tenant (tenants app)
name        CharField
created_at  DateTimeField
Why

Multi-tenancy is a core requirement. Every normalized ESG record is linked to a Tenant, ensuring strict logical separation between client datasets.

Design intent

A single deployment can serve multiple organizations. Each organization is represented as a tenant, and all ESG records are scoped through a foreign key relationship.

Note

Row-level security middleware was not implemented in this prototype; tenant isolation is enforced at the application query layer.

2. RawIngestion (ingestion app)
source_type   CharField  [SAP | UTILITY | TRAVEL]
raw_data      JSONField
uploaded_at   DateTimeField (auto)
processed     BooleanField
uploaded_by   CharField
Why

This is the immutable source-of-truth layer. Every uploaded record is stored exactly as received before any transformation.

Design decisions
JSONField is used to support heterogeneous schemas across SAP, utility, and travel systems.
No relational structure is enforced at this layer intentionally.
Normalization is responsible for schema interpretation.
Important clarification

This layer is not intended for analytics or querying. It exists only for traceability and replayability of transformations.

3. NormalizedEmission (ingestion app)
tenant            ForeignKey → Tenant (nullable)
raw_record        ForeignKey → RawIngestion
scope             CharField  [Scope 1 | Scope 2 | Scope 3]
category          CharField  [Fuel Combustion | Purchased Electricity | Business Travel]
normalized_value  FloatField
unit              CharField  [liters | kWh | km]
emission_factor   FloatField
emissions_kg_co2e FloatField
status            CharField  [PENDING | APPROVED | REJECTED | FLAGGED]
created_at        DateTimeField (auto)
edited_at         DateTimeField (nullable)
edited_by         CharField (nullable)
Why this is the core model

This model converts raw heterogeneous inputs into a standardized ESG-comparable representation while preserving full lineage.

Field-level justification
tenant → ensures logical data separation per client
raw_record → permanent traceability to original input
scope → assigned using a rule-based heuristic mapping of source system to likely emission category (not full GHG compliance classification)
category → functional classification of emission activity
normalized_value + unit → standardized activity metric
emission_factor → stored per record to preserve historical accuracy
emissions_kg_co2e → precomputed for audit stability
status → workflow state (PENDING / APPROVED / REJECTED / FLAGGED)
edited_at, edited_by → human correction tracking
Emission factors (baseline assumptions)
Source	Factor	Basis
SAP (fuel proxy)	2.68 kg CO₂e / litre	DEFRA 2023
Utility (electricity)	0.82 kg CO₂e / kWh	India CEA grid average 2023
Travel (air)	0.255 kg CO₂e / km	DEFRA 2023
Important note

These are fixed baseline factors used for reproducibility in a prototype system. In production systems, emission factors are region- and time-dependent.

4. ReviewQueue (reviews app)
record        ForeignKey → NormalizedEmission
reviewer      CharField (nullable)
review_notes  TextField
status        CharField  [PENDING | APPROVED | REJECTED]
reviewed_at   DateTimeField (nullable)
Why

Separates human workflow metadata from core ESG data.

Design reasoning
NormalizedEmission.status reflects system state
ReviewQueue captures analyst interaction details

This avoids polluting analytical datasets with workflow-specific fields.

5. AuditLog (audit app)
entity_type   CharField
entity_id     IntegerField
action        CharField  [INGESTED | APPROVED | REJECTED]
old_data      JSONField (nullable)
new_data      JSONField (nullable)
performed_by  CharField
timestamp     DateTimeField (auto)
Why

Provides immutable traceability of all state transitions.

Key properties
Append-only structure
Stores full before/after snapshots
Enables reconstruction of full record lifecycle
Multi-Tenancy

Each NormalizedEmission is linked to a Tenant.

In this prototype:

Tenant assignment is request-based
In production, tenant context would be injected via authentication middleware
Scope Classification
Source Type	Scope	Basis
SAP-derived operational data	Scope 1 proxy	Direct operational emissions heuristic
Utility consumption	Scope 2	Purchased electricity and energy
Travel data	Scope 3	Business travel (value chain emissions)
Important clarification

This is a rule-based heuristic mapping from source system to emission category, not a full GHG Protocol compliance engine.

Source-of-Truth Tracking

Three-layer traceability:

RawIngestion.raw_data → original unmodified payload
NormalizedEmission fields → computed analytical representation
AuditLog → immutable lifecycle history

Together, these ensure full data lineage from ingestion to final decision.

Unit Normalization
Source	Input Field	Canonical Unit
SAP	Fuel_Amount_Liters	liters
Utility	Consumption_kWh	kWh
Travel	Distance_km	km

Normalization ensures all emissions are comparable via CO₂e conversion.

What This Model Does NOT Cover

This system intentionally does not implement:

Row-level database security middleware
Machine learning-based anomaly detection
Full GHG Protocol compliance calculation engine

These were excluded to maintain focus on:

ingestion → normalization → classification → auditability pipeline design

Final System Positioning

This is a prototype ESG data pipeline focused on:

Traceability
Modular ingestion
Deterministic transformation
Audit readiness

It is not intended to be a regulatory certification-grade ESG reporting system.