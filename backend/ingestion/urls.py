from django.urls import path

from .views import (
    upload_csv,
    pending_reviews,
    approve_record,
    reject_record
)

urlpatterns = [

    path('upload/', upload_csv),

    path(
        'review/pending/',
        pending_reviews
    ),

    path(
        'review/approve/<int:pk>/',
        approve_record
    ),

    path(
        'review/reject/<int:pk>/',
        reject_record
    ),
]