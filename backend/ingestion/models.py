from django.db import models


class RawIngestion(models.Model):

    SOURCE_CHOICES = [
        ('SAP', 'SAP'),
        ('UTILITY', 'UTILITY'),
        ('TRAVEL', 'TRAVEL'),
    ]

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_CHOICES
    )

    raw_data = models.JSONField()

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    processed = models.BooleanField(
        default=False
    )

    def __str__(self):

        return f"{self.source_type} - {self.id}"


class NormalizedEmission(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('APPROVED', 'APPROVED'),
        ('REJECTED', 'REJECTED'),
        ('FLAGGED', 'FLAGGED'),
    ]

    raw_record = models.ForeignKey(
        RawIngestion,
        on_delete=models.CASCADE
    )

    scope = models.CharField(
        max_length=20
    )

    category = models.CharField(
        max_length=100
    )

    normalized_value = models.FloatField()

    unit = models.CharField(
        max_length=50
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.category} - {self.normalized_value}"