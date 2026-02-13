from django.contrib import admin

from .models import Category, Comment, Like, Post, Tag

for model in (Category, Tag, Post, Comment, Like):
    admin.site.register(model)
