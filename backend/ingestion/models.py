from django.db import models
from tenants.models import Tenant


class RawIngestion(models.Model):

    SOURCE_CHOICES = [
        ('SAP', 'SAP'),
        ('UTILITY', 'UTILITY'),
        ('TRAVEL', 'TRAVEL'),
    ]

    source_type = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    raw_data = models.JSONField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    uploaded_by = models.CharField(max_length=255, default='system')

    def __str__(self):
        return f"{self.source_type} - {self.id}"


class NormalizedEmission(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('APPROVED', 'APPROVED'),
        ('REJECTED', 'REJECTED'),
        ('FLAGGED', 'FLAGGED'),
    ]

    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, null=True, blank=True
    )
    raw_record = models.ForeignKey(RawIngestion, on_delete=models.CASCADE)
    scope = models.CharField(max_length=20)
    category = models.CharField(max_length=100)
    normalized_value = models.FloatField()
    unit = models.CharField(max_length=50)
    emission_factor = models.FloatField(default=0.0)
    emissions_kg_co2e = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True, blank=True)
    edited_by = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.category} - {self.normalized_value}"