from django.db import models
from ingestion.models import NormalizedEmission


class ReviewQueue(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    record = models.ForeignKey(
        NormalizedEmission,
        on_delete=models.CASCADE
    )
    reviewer = models.CharField(max_length=255, null=True, blank=True)
    review_notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=50, choices=STATUS_CHOICES, default="PENDING"
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.status} - Record {self.record_id}"