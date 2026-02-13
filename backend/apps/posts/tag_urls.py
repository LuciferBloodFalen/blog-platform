from django.urls import path

from .views import TagListCreateAPIView

urlpatterns = [
    path("", TagListCreateAPIView.as_view()),
]
