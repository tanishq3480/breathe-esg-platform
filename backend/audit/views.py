from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import AuditLog


@api_view(["GET"])
def audit_logs(request):
    logs = AuditLog.objects.all().order_by("-timestamp")

    data = [
        {
            "id": log.id,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "action": log.action,
            "performed_by": log.performed_by,
            "timestamp": log.timestamp,
        }
        for log in logs
    ]

    return Response(data)