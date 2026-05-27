from django.shortcuts import get_object_or_404

from rest_framework.decorators import (
    api_view,
    parser_classes
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import pandas as pd

from .models import (
    RawIngestion,
    NormalizedEmission
)


@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter(
            'file',
            openapi.IN_FORM,
            description="Upload CSV File",
            type=openapi.TYPE_FILE,
            required=True
        ),
        openapi.Parameter(
            'source_type',
            openapi.IN_FORM,
            description="SAP / UTILITY / TRAVEL",
            type=openapi.TYPE_STRING,
            required=True
        ),
    ]
)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])

def upload_csv(request):

    file = request.FILES.get('file')

    source_type = request.data.get(
        'source_type',
        'SAP'
    )

    if not file:

        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        file.seek(0)

        df = pd.read_csv(file)

        rows_created = 0

        for _, row in df.iterrows():

            raw = RawIngestion.objects.create(
                source_type=source_type,
                raw_data=row.to_dict()
            )

            value = float(
                row.get("Fuel Amount", 0)
            )

            if source_type == "SAP":

                scope = "Scope 1"
                category = "Fuel Combustion"
                unit = "liters"

            elif source_type == "UTILITY":

                scope = "Scope 2"
                category = "Purchased Electricity"
                unit = "kWh"

            else:

                scope = "Scope 3"
                category = "Business Travel"
                unit = "km"

            status_value = "PENDING"

            if value > 10000:

                status_value = "FLAGGED"

            NormalizedEmission.objects.create(
                raw_record=raw,
                scope=scope,
                category=category,
                normalized_value=value,
                unit=unit,
                status=status_value
            )

            rows_created += 1

        return Response({
            "message": "CSV uploaded successfully",
            "rows_uploaded": rows_created
        })

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])

def pending_reviews(request):

    pending = NormalizedEmission.objects.filter(
        status__in=['PENDING', 'FLAGGED']
    )

    data = []

    for item in pending:

        data.append({
            "id": item.id,
            "scope": item.scope,
            "category": item.category,
            "value": item.normalized_value,
            "unit": item.unit,
            "status": item.status,
        })

    return Response(data)


@api_view(['POST'])

def approve_record(request, pk):

    record = get_object_or_404(
        NormalizedEmission,
        pk=pk
    )

    record.status = 'APPROVED'

    record.save()

    return Response({
        "message": f"Record {pk} approved"
    })


@api_view(['POST'])

def reject_record(request, pk):

    record = get_object_or_404(
        NormalizedEmission,
        pk=pk
    )

    record.status = 'REJECTED'

    record.save()

    return Response({
        "message": f"Record {pk} rejected"
    })