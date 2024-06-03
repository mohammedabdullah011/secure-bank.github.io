

from django.contrib import admin #type:ignore
from django.urls import path #type:ignore
from app import views 
from django.conf import settings #type:ignore
from django.conf.urls.static import static #type:ignore
from django.contrib import admin #type:ignore
from django.urls import path #type:ignore

urlpatterns = [
    path('admin/', admin.site.urls),
    path('locked-out/', views.lockout_view, name='lockout'),
    path('api/register/', views.register_user, name='register_user'), 
    path('api/login/', views.login, name='login'), 
    path('api/logout/', views.logout, name='logout'), 
    path('api/add_card/', views.add_card, name='add_card'), 
    path('api/get_user_data/', views.get_user_data, name='get_user_data'),
    path('api/withdraw/', views.withdraw, name='withdraw'),
    path('api/pay/', views.pay, name='pay'),
    path('api/create_bill/', views.create_bill, name='create_bill'),
    path('api/edit_profile/', views.edit_profile, name='edit_profile'),
    path('api/get_image/', views.get_image, name='get_image'),
    path('api/update_card/', views.update_card, name='update_card'),
    path('api/change_password/', views.change_password, name='change_password'),
    path('api/update_phone/', views.update_phone, name='update_phone'),
    path('api/remove_account/', views.remove_account, name='remove_account'),
    path('api/get_transactions/', views.get_transactions, name='get_transactions'),
    path('api/get_bills/', views.get_bills, name='get_bills'),
    path('api/get_profit/', views.get_profit, name='get_profit'),
    path('api/get_profit_for_month/', views.get_profit_for_month, name='get_profit_for_month'),
    path('api/submit_contact_form/', views.submit_contact_form, name='submit_contact_form'),
    path('api/get_notifications/', views.get_notifications, name='get_notifications'),
]



# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)