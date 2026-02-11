from django.contrib import admin
from .models import Category, Tag, Post, Comment, Like

for model in (Category, Tag, Post, Comment, Like):
    admin.site.register(model)
