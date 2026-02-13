from django.urls import path

from .views import (
    PostListCreateAPIView,
    PostRetrieveUpdateDeleteAPIView,
)

urlpatterns = [
    path("", PostListCreateAPIView.as_view(), name="post-list-create"),
    path("<slug:slug>/", PostRetrieveUpdateDeleteAPIView.as_view(), name="post-detail"),
]
