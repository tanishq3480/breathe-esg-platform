# TRADEOFFS.md

# Deliberate Tradeoffs

---

# 1. No Production-Grade Authentication / RBAC

Basic Django admin authentication exists for backend administration, but full enterprise authentication was intentionally not implemented.

Not built:

* JWT authentication
* role-based permissions
* SSO/SAML integration

Why:
The assignment emphasized ingestion modeling, normalization, auditability, and review workflows more heavily than enterprise identity management.

Tradeoff:
The prototype demonstrates the ESG operational workflow clearly, but would require enterprise authentication hardening before production deployment.

---

# 2. No Real External API Integrations

Not built:

* live SAP integration
* utility APIs
* Concur OAuth ingestion

Why:
Real integrations require:

* enterprise credentials
* API contracts
* long setup timelines

CSV ingestion was chosen to demonstrate realistic operational workflows.

---

# 3. No Advanced Analytics Dashboard

Not built:

* charts
* trend analysis
* forecasting
* anomaly scoring

Why:
The assignment emphasized:

* normalization
* reviewability
* auditability

The review workflow was prioritized over executive reporting visuals.

---

# Additional Constraints

Given the 4-day timeline:

* SQLite was used instead of PostgreSQL
* emission factors were simplified
* PDF parsing was skipped
* async queues were omitted
