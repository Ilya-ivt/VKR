from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),  # Подключаем маршруты из main
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),  # Выход
]
