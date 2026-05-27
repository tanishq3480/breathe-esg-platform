from django.db import models

from tenants.models import Tenant
from ingestion.models import RawIngestion


class NormalizedActivity(models.Model):

    SCOPE_CHOICES = [
        ("SCOPE_1", "Scope 1"),
        ("SCOPE_2", "Scope 2"),
        ("SCOPE_3", "Scope 3"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE
    )

    raw_record = models.ForeignKey(
        RawIngestion,
        on_delete=models.CASCADE
    )

    category = models.CharField(
        max_length=100
    )

    scope = models.CharField(
        max_length=50,
        choices=SCOPE_CHOICES
    )

    activity_value = models.FloatField()

    normalized_unit = models.CharField(
        max_length=50
    )

    emission_factor = models.FloatField()

    emissions_kg_co2e = models.FloatField()

    suspicious = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )