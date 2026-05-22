from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'message': 'Usuário criado com sucesso!'}, status=201)
    except Exception as e:
        return Response({'error': 'Erro ao criar usuário'}, status=400)



@api_view(['GET'])
def get_categories(request):
    # Mock de dados para o frontend não quebrar. 
 
    mock_categories = [
        {"id": 1, "name": "Trabalho"},
        {"id": 2, "name": "Estudos"},
        {"id": 3, "name": "Pessoal"}
    ]
    return Response(mock_categories, status=200)


@api_view(['GET'])
def get_tasks(request):
        # Mock de dados para o frontend não quebrar. 
    mock_tasks = [
        {"id": 1, "title": "Finalizar o teste técnico", "completed": False, "category": 1},
        {"id": 2, "title": "Configurar o CORS no Django", "completed": True, "category": 1},
        {"id": 3, "title": "Estudar arquitetura de APIs", "completed": False, "category": 2}
    ]
    return Response(mock_tasks, status=200)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tasks.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register'),
    path('api/categories/', get_categories, name='categories'),
    path('api/tasks/', get_tasks, name='tasks'),
]