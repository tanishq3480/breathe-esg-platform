from django.db import models
from ingestion.models import NormalizedEmission

from django.db import models
from ingestion.models import NormalizedEmission

class ReviewQueue(models.Model):
    record = models.ForeignKey(NormalizedEmission, on_delete=models.CASCADE)

    reviewer = models.CharField(max_length=100, null=True, blank=True)
    review_notes = models.TextField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "PENDING"),
            ("APPROVED", "APPROVED"),
            ("REJECTED", "REJECTED"),
        ],
        default="PENDING"
    )

    reviewed_at = models.DateTimeField(null=True, blank=True)
    
def __str__(self):
        return f"{self.status} - Record {self.record.pk}"