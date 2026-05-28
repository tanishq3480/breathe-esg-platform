from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from reviews.models import ReviewQueue
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import pandas as pd

from .models import RawIngestion, NormalizedEmission
from audit.models import AuditLog
from tenants.models import Tenant


# kg CO2e per unit — defensible defaults
EMISSION_FACTORS = {
    'SAP':     2.68,   # per litre diesel (DEFRA 2023)
    'UTILITY': 0.82,   # per kWh, India CEA grid average 2023
    'TRAVEL':  0.255,  # per km, economy class air (DEFRA 2023)
}

# Candidate column names per source — tries each in order
VALUE_COLUMNS = {
    'SAP':     ['Fuel_Amount_Liters', 'Fuel Amount', 'fuel_amount', 'Quantity'],
    'UTILITY': ['Consumption_kWh', 'kwh_consumed', 'Usage_kWh', 'kWh', 'Fuel Amount'],
    'TRAVEL':  ['Distance_km', 'distance_km', 'Distance', 'km', 'Fuel Amount'],
}


def extract_value(row_dict, source_type):
    for col in VALUE_COLUMNS.get(source_type, []):
        if col in row_dict and row_dict[col] not in (None, ''):
            try:
                return float(row_dict[col])
            except (ValueError, TypeError):
                continue
    # last resort: first positive numeric value in the row
    for v in row_dict.values():
        try:
            val = float(v)
            if val > 0:
                return val
        except (ValueError, TypeError):
            continue
    return 0.0


@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter('file', openapi.IN_FORM,
            description="CSV file", type=openapi.TYPE_FILE, required=True),
        openapi.Parameter('source_type', openapi.IN_FORM,
            description="SAP / UTILITY / TRAVEL", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('tenant_id', openapi.IN_FORM,
            description="Tenant ID (integer)", type=openapi.TYPE_INTEGER, required=False),
    ]
)
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request):

    file = request.FILES.get('file')
    source_type = request.data.get('source_type', 'SAP').upper()
    tenant_id = request.data.get('tenant_id')
    actor = request.user.username if request.user.is_authenticated else 'system'

    tenant = None
    if tenant_id:
        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            return Response(
                {"error": f"Tenant {tenant_id} not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

    if not file:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    scope_map    = {'SAP': 'Scope 1', 'UTILITY': 'Scope 2', 'TRAVEL': 'Scope 3'}
    category_map = {'SAP': 'Fuel Combustion', 'UTILITY': 'Purchased Electricity', 'TRAVEL': 'Business Travel'}
    unit_map     = {'SAP': 'liters', 'UTILITY': 'kWh', 'TRAVEL': 'km'}

    if source_type not in scope_map:
        return Response({"error": "source_type must be SAP, UTILITY, or TRAVEL"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        file.seek(0)
        df = pd.read_csv(file)
        ef = EMISSION_FACTORS[source_type]
        rows_created = 0

        for _, row in df.iterrows():
            row_dict = row.to_dict()

            raw = RawIngestion.objects.create(
                source_type=source_type,
                raw_data=row_dict,
                uploaded_by=actor,
            )
            
            value = extract_value(row_dict, source_type)
            emissions = round(value * ef, 4)
            record_status = 'FLAGGED' if value > 10000 else 'PENDING'

            emission = NormalizedEmission.objects.create(
                tenant=tenant,
                raw_record=raw,
                scope=scope_map[source_type],
                category=category_map[source_type],
                normalized_value=value,
                unit=unit_map[source_type],
                emission_factor=ef,
                emissions_kg_co2e=emissions,
                status=record_status,
            )

            AuditLog.objects.create(
                entity_type="NormalizedEmission",
                entity_id=emission.id,
                action="INGESTED",
                performed_by= "system",
            )

            ReviewQueue.objects.create(
                record=emission,
                status="PENDING"
            )

            rows_created += 1

        return Response({
            "message": "Uploaded successfully",
            "rows_uploaded": rows_created,
            "source_type": source_type,
            "tenant": tenant.name if tenant else None,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def pending_reviews(request):
    records = NormalizedEmission.objects.all().order_by('-id')

    data = []
    for r in records:
        data.append({
            "id": r.pk,
            "scope": r.scope,
            "category": r.category,
            "normalized_value": r.normalized_value,
            "emissions_kg_co2e": r.emissions_kg_co2e,
            "status": r.status
        })

    return Response(data)

@api_view(['GET'])
def all_records(request):
    qs = NormalizedEmission.objects.all().order_by(
        '-created_at'
    ).select_related('raw_record', 'tenant')

    data = [{
        "id": r.pk,
        "scope": r.scope,
        "category": r.category,
        "value": r.normalized_value,
        "unit": r.unit,
        "emissions_kg_co2e": r.emissions_kg_co2e,
        "emission_factor": r.emission_factor,
        "status": r.status,
        "tenant": r.tenant.name if r.tenant else None,
        "source": r.raw_record.source_type,
        "uploaded_at": r.raw_record.uploaded_at,
        "edited_at": r.edited_at,
        "edited_by": r.edited_by,
    } for r in qs]

    return Response(data)


@api_view(['POST'])
def approve_record(request, pk):
    record = get_object_or_404(NormalizedEmission, pk=pk)
    actor = request.user.username if request.user.is_authenticated else 'analyst'
    old_status = record.status
    from audit.models import AuditLog
    record.status = 'APPROVED'
    record.edited_at = timezone.now()
    record.edited_by = actor
    record.save()

    AuditLog.objects.create(
        entity_type='NormalizedEmission',
        entity_id=pk,
        action='APPROVED',
        old_data={'status': old_status},
        new_data={'status': 'APPROVED'},
        performed_by=request.user.username if request.user.is_authenticated else "admin",
    )

    return Response({"message": f"Record {pk} approved"})


@api_view(['POST'])
def reject_record(request, pk):
    record = get_object_or_404(NormalizedEmission, pk=pk)
    actor = request.user.username if request.user.is_authenticated else 'analyst'
    old_status = record.status

    record.status = 'REJECTED'
    record.edited_at = timezone.now()
    record.edited_by = actor
    record.save()

    AuditLog.objects.create(
        entity_type='NormalizedEmission',
        entity_id=pk,
        action='REJECTED',
        old_data={'status': old_status},
        new_data={'status': 'REJECTED'},
        performed_by=request.user.username if request.user.is_authenticated else "admin",
    )

    return Response({"message": f"Record {pk} rejected"})

@api_view(['GET'])
def audit_logs(request):
    logs = AuditLog.objects.all().order_by('-timestamp')
    return Response([
        {
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "action": l.action,
            "performed_by": l.performed_by,
            "timestamp": l.timestamp
        } for l in logs
    ])
    
@api_view(["GET"])
def normalized_emissions(request):

    records = NormalizedEmission.objects.all().order_by("-id")

    data = []

    for r in records:
        data.append({
            "id": r.id,
            "scope": r.scope,
            "category": r.category,
            "normalized_value": r.normalized_value,
            "unit": r.unit,
            "emissions": r.emissions_kg_co2e,
            "status": r.status,
        })

    return Response(data)