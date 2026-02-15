"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


def api_root(request):
    """Root API endpoint providing basic info and available endpoints"""
    return JsonResponse(
        {
            "message": "Blog Platform API",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "admin": "/admin/",
                "api_docs": "/api/docs/",
                "auth": "/api/auth/",
                "posts": "/api/posts/",
                "categories": "/api/categories/",
                "tags": "/api/tags/",
            },
        }
    )


urlpatterns = [
    path("", api_root, name="api_root"),
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/posts/", include("apps.posts.urls")),
    path("api/categories/", include("apps.posts.category_urls")),
    path("api/tags/", include("apps.posts.tag_urls")),
]
