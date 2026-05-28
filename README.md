# Breathe ESG Platform

Prototype ESG Intelligence & Emissions Review Platform built using Django and React.

---

# Overview

Breathe ESG Platform is a full-stack ESG data ingestion and emissions review system that allows organizations to:

* Upload ESG CSV datasets
* Normalize emissions data
* Review and approve flagged records
* Maintain audit logs
* Track Scope 1, Scope 2, and Scope 3 emissions

The platform demonstrates a simplified enterprise ESG workflow for sustainability reporting and emissions monitoring.

---

# Features

## ESG CSV Upload

Supports CSV uploads from:

* SAP
* Utility systems
* Travel systems

---

## Automated Emission Calculations

The system:

* Extracts numeric ESG values
* Applies emission factors
* Calculates kg CO2e emissions

---

## Review Workflow

Users can:

* View pending ESG records
* Approve records
* Reject records

---

## Audit Logging

Tracks:

* Upload actions
* Approval actions
* Rejection actions

---

## REST APIs

Backend APIs built using Django REST Framework.

---

## Frontend Dashboard

React frontend includes:

* Upload interface
* Review queue
* Audit logs
* ESG metrics cards

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

* Frontend deployed on Vercel
* Backend deployed on Render

---

# Project Structure

```bash id="w1a3pm"
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

## Clone Repository

```bash id="htf3gj"
git clone https://github.com/tanishq3480/breathe-esg-platform.git
cd breathe-esg-platform
```

---

## Create Virtual Environment

```bash id="pfdjlwm"
cd backend
python -m venv venv
```

Activate environment:

### Windows

```bash id="p98l2h"
venv\Scripts\activate
```

### Linux / Mac

```bash id="r7c4n0"
source venv/bin/activate
```

---

## Install Dependencies

```bash id="2m4m9f"
pip install -r requirements.txt
```

---

## Run Migrations

```bash id="9j1aj8"
python manage.py makemigrations
python manage.py migrate
```

---

## Create Admin User

```bash id="8qjcs6"
python manage.py createsuperuser
```

---

## Start Backend

```bash id="ik0yeu"
python manage.py runserver
```

Backend URL:

```bash id="i3gkq5"
http://127.0.0.1:8000
```

---

# Frontend Setup

## Navigate to Frontend

```bash id="9v02mx"
cd frontend
```

---

## Install Dependencies

```bash id="k5n0ls"
npm install
```

---

## Configure API URL

Inside `src/App.js`:

Local backend:

```javascript id="jlwm2r"
const API = "http://127.0.0.1:8000/api"
```

Production backend:

```javascript id="7mpjlwm"
const API = "https://your-render-url.onrender.com/api"
```

---

## Start Frontend

```bash id="0dzd0m"
npm start
```

Frontend URL:

```bash id="t7ey6x"
http://localhost:3000
```

---

# API Endpoints

## Upload CSV

```http id="1l5t1n"
POST /api/upload/
```

---

## Review Queue

```http id="4l5g2r"
GET /api/reviews/queue/
```

---

## Approve Record

```http id="ln9n6s"
POST /api/review/approve/<id>/
```

---

## Reject Record

```http id="xmx8bq"
POST /api/review/reject/<id>/
```

---

## Audit Logs

```http id="0kh91e"
GET /api/audit/logs/
```

---

## All Records

```http id="zq90b6"
GET /api/records/
```

---

# Authentication

Django admin authentication is enabled.

Admin panel:

```bash id="8ckmzg"
/admin
```

Create admin user:

```bash id="m6nvsk"
python manage.py createsuperuser
```

---

# Deployment

## Backend (Render)

Build command:

```bash id="q7r4q7"
pip install -r requirements.txt
```

Start command:

```bash id="w5p3vb"
gunicorn config.wsgi
```

---

## Frontend (Vercel)

Push changes to GitHub:

```bash id="v3gyyf"
git add .
git commit -m "deployment update"
git push origin main
```

Vercel auto-deploys from GitHub.

---

# ESG Workflow

1. Upload CSV file
2. Backend normalizes ESG data
3. Emissions are calculated
4. Records enter review queue
5. User approves/rejects records
6. Audit logs are generated

---

# Current Limitations

* Frontend authentication and role-based authorization are not currently implemented.
* Administrative access is handled through Django Admin.
* The current implementation focuses on ESG ingestion, normalization, review workflows, and audit tracking.
* Authentication APIs and frontend login flows can be added as future enhancements if required.

---

# Future Enhancements

* JWT/token-based authentication
* Role-based access control
* Protected frontend routes
* PostgreSQL integration
* ESG analytics dashboards
* AI anomaly detection
* PDF report exports
* Real-time ESG visualization

---

# Author

Tanishq Sharma

---

# License

Developed for educational and assessment purposes.
