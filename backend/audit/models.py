from django.db import models

class AuditLog(models.Model):

    entity_type = models.CharField(
        max_length=100
    )

    entity_id = models.IntegerField()

    action = models.CharField(
        max_length=100
    )

    old_data = models.JSONField(
        null=True,
        blank=True
    )

    new_data = models.JSONField(
        null=True,
        blank=True
    )

    performed_by = models.CharField(
        max_length=255
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.action