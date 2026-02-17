from django.urls import path

from .views import (
    CommentDeleteAPIView,
    LikePostAPIView,
    MyPostsListAPIView,
    PostCommentsAPIView,
    PostListCreateAPIView,
    PostRetrieveUpdateDeleteAPIView,
    UnlikePostAPIView,
)

urlpatterns = [
    path("", PostListCreateAPIView.as_view(), name="post-list-create"),
    path("my-posts/", MyPostsListAPIView.as_view(), name="my-posts"),
    path("<slug:slug>/", PostRetrieveUpdateDeleteAPIView.as_view(), name="post-detail"),
    path("<slug:slug>/comments/", PostCommentsAPIView.as_view(), name="post-comments"),
    path("comments/<int:id>/", CommentDeleteAPIView.as_view(), name="comment-delete"),
    path("<slug:slug>/like/", LikePostAPIView.as_view(), name="post-like"),
    path("<slug:slug>/unlike/", UnlikePostAPIView.as_view(), name="post-unlike"),
]
