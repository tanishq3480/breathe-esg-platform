from django.urls import path

from .views import (
    upload_csv,
    pending_reviews,
    approve_record,
    reject_record,
    audit_logs,
    normalized_emissions,
    all_records
)

urlpatterns = [
    path('upload/', upload_csv),

    path('reviews/queue/', pending_reviews),

    path(
        'review/approve/<int:pk>/',
        approve_record
    ),

    path(
        'review/reject/<int:pk>/',
        reject_record
    ),

    path(
        'audit/logs/',
        audit_logs
    ),

    path(
        'normalized/',
        normalized_emissions
    ),

    path(
        'records/',
        all_records
    ),
]