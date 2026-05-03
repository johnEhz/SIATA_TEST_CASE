from django.urls import path
from .views import UserRegistrationView, CustomTokenObtainPairView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='user_login'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]

