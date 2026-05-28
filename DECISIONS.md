# DECISIONS.md

# Architectural Decisions

---

# SAP Ingestion Choice

Decision:
CSV flat-file upload.

Why:
Real SAP integrations commonly expose:

* IDocs
* BAPIs
* OData services
* scheduled exports

CSV export ingestion was chosen because:

* it realistically mirrors operational ESG workflows
* sustainability teams frequently export SAP data manually
* it reduced infrastructure overhead

Subset handled:

* fuel procurement records

Ignored:

* real-time SAP sync
* procurement hierarchies
* multilingual SAP metadata

---

# Utility Data Choice

Decision:
CSV utility export ingestion.

Why:
Many facilities teams manually download electricity data from utility portals as CSV exports.

Subset handled:

* electricity consumption
* kWh normalization

Ignored:

* tariff structures
* PDF parsing

---

# Travel Data Choice

Decision:
Travel CSV upload modeled after Concur/Navan exports.

Why:
Travel APIs vary heavily between providers and often require OAuth integration.

Subset handled:

* business travel distance records

Ignored:

* airport-code geolocation
* hotel emissions

---

# Review Workflow

Decision:
Human analyst approval required before finalization.

Why:
ESG reporting frequently requires manual verification before audit submission.

---

# Emission Factors

Decision:
Static defensible defaults.

Why:
Production ESG systems typically use:

* DEFRA
* EPA
* IEA
* GHG Protocol datasets

---

# Multi-Tenancy

Decision:
Tenant foreign-key isolation.

Why:
The assignment explicitly required multi-tenancy support.

---

# Questions I Would Ask the PM

* Which ESG framework is primary?
* Are emission factors client configurable?
* Should rejected rows remain editable?
* Is approval multi-stage?
