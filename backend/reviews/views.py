from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ReviewQueue


@api_view(["GET"])
def review_queue(request):

    records = ReviewQueue.objects.select_related("record").all()

    data = []

    for r in records:
        data.append({
            "id": r.id,
            "record_id": r.record.id,
            "scope": r.record.scope,
            "category": r.record.category,
            "status": r.status,
            "reviewer": r.reviewer,
            "review_notes": r.review_notes,
            "emissions": r.record.emissions_kg_co2e,
        })

    return Response(data)