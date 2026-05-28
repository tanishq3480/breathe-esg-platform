from django.urls import path
from .views import review_queue

urlpatterns = [
    path("queue/", review_queue),
]