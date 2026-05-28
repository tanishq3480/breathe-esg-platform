# Breathe ESG Platform

Enterprise ESG Intelligence & Emissions Review Platform built using Django + React.

---

# Overview

Breathe ESG Platform is an ESG data ingestion and emissions intelligence system that allows organizations to:

* Upload ESG CSV datasets
* Normalize emissions data
* Review & approve flagged emissions
* Maintain audit logs
* Support multi-tenant ESG workflows
* Track Scope 1, Scope 2, and Scope 3 emissions

The platform simulates an enterprise-grade ESG pipeline similar to real sustainability reporting systems.

---

# Features

## ESG CSV Upload

* Upload CSV files from:

  * SAP
  * Utility systems
  * Travel systems

## Automated Emission Calculations

System automatically:

* Detects emission values
* Applies emission factors
* Calculates kg CO2e

## Multi-Tenant Support

Supports separate tenants for:

* Different organizations
* Business units
* Clients

## Review Workflow

Analysts can:

* Approve records
* Reject records
* Review flagged emissions

## Audit Logging

Tracks:

* Upload actions
* Approvals
* Rejections
* User activity

## REST APIs

Complete backend API using Django REST Framework.

## Responsive Frontend

Modern React dashboard with:

* Upload interface
* Review queue
* Audit logs
* ESG metrics

---

# Tech Stack

## Frontend

* React
* Axios
* React Router
* CSS

## Backend

* Django
* Django REST Framework
* SQLite
* Pandas

## Deployment

* Frontend → Vercel
* Backend → Render

---

# Project Structure

```bash
breathe_esg/
│
├── backend/
│   ├── ingestion/
│   ├── reviews/
│   ├── audit/
│   ├── tenants/
│   ├── normalization/
│   └── config/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   └── public/
│
└── README.md
```

---

# Backend Setup

## 1. Clone Repository

```bash
git clone https://github.com/tanishq3480/breathe-esg-platform.git
cd breathe-esg-platform
```

---

## 2. Create Virtual Environment

```bash
cd backend

python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 5. Create Superuser

```bash
python manage.py createsuperuser
```

---

## 6. Start Backend Server

```bash
python manage.py runserver
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Navigate to Frontend

```bash
cd frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Backend API

Inside:

```bash
src/App.js
```

Set:

```javascript
const API = "http://127.0.0.1:8000/api"
```

For deployed backend:

```javascript
const API = "https://your-render-backend-url.onrender.com/api"
```

---

## 4. Start Frontend

```bash
npm start
```

Frontend runs at:

```bash
http://localhost:3000
```

---

# API Endpoints

## Upload CSV

```http
POST /api/upload/
```

---

## Review Queue

```http
GET /api/reviews/queue/
```

---

## Approve Record

```http
POST /api/review/approve/<id>/
```

---

## Reject Record

```http
POST /api/review/reject/<id>/
```

---

## Audit Logs

```http
GET /api/audit/logs/
```

---

## All Records

```http
GET /api/records/
```

---

# Authentication

Django Admin Authentication is enabled.

Admin panel:

```bash
/admin
```

Create admin user:

```bash
python manage.py createsuperuser
```

---

# Deployment

## Backend Deployment (Render)

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn config.wsgi
```

---

## Frontend Deployment (Vercel)

Push frontend changes to GitHub:

```bash
git add .
git commit -m "frontend deployment"
git push origin main
```

Vercel auto-deploys from GitHub.

---

# Sample ESG Workflow

1. Upload CSV
2. Backend normalizes data
3. Emissions calculated automatically
4. Records enter review queue
5. Analyst approves/rejects
6. Audit logs generated

---

# Sample Emission Factors

| Source Type | Factor |
| ----------- | ------ |
| SAP         | 2.68   |
| Utility     | 0.82   |
| Travel      | 0.255  |

---

# Future Improvements

* JWT Authentication
* Role-based access control
* PostgreSQL integration
* ESG analytics dashboard
* AI anomaly detection
* PDF reporting
* Real-time charts

---

# Author

Tanishq Sharma

---

# License

This project is developed for educational and assessment purposes.
