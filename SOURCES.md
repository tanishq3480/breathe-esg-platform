# SOURCES.md

# Source Research and Assumptions

---

# 1. SAP Fuel & Procurement Data

## Research

Typical SAP ESG exports commonly appear as:

* CSV exports
* IDocs
* BAPIs
* OData feeds

Real SAP exports frequently contain:

* inconsistent naming
* plant codes
* mixed units
* multilingual columns

---

## Chosen Format

CSV upload.

Why:
This realistically reflects sustainability teams exporting operational data manually from SAP systems.

---

## Sample Data Shape

Included:

* fuel quantity
* procurement value
* transaction dates

Example fields:

* Fuel_Amount_Liters
* Quantity
* Plant_Code

---

## What Would Break in Production

* inconsistent SAP schemas
* localized fields
* unit mismatches
* duplicate records

---

# 2. Utility Electricity Data

## Research

Facilities teams commonly obtain electricity usage through:

* utility portals
* CSV downloads
* billing exports

---

## Chosen Format

Portal CSV export.

---

## Sample Data Shape

Included:

* kWh consumption
* billing period
* meter identifier

---

## What Would Break in Production

* overlapping billing periods
* tariff complexity
* estimated readings

---

# 3. Corporate Travel Data

## Research

Platforms researched:

* Concur
* Navan

Typical exports include:

* flight segments
* hotel stays
* transport categories

---

## Chosen Format

CSV export.

---

## Sample Data Shape

Included:

* travel distance
* transport mode
* category

---

## What Would Break in Production

* airport-code calculations
* incomplete itineraries
* multi-leg journeys

---

# Key Learning

The hardest ESG problem is not emissions calculation.

The hardest problem is:

* inconsistent enterprise data
* missing metadata
* unreliable source systems
* normalization quality
* auditability
