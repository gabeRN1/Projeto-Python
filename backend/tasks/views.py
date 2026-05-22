from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Task, Category
from .serializers import TaskSerializer, CategorySerializer

@api_view(['POST'])
@permission_classes([AllowAny])
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


class CategoryViewSet(viewsets.ModelViewSet):
    # O Router precisa dessa variável para mapear 'category-list' internamente
    queryset = Category.objects.all() 
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        # Substitui a busca padrão aplicando o filtro do usuário logado
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    # O Router precisa dessa variável para mapear 'task-list' internamente
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Substitui a busca padrão aplicando o filtro de tarefas próprias/compartilhadas
        return self.queryset.filter(
            Q(user=self.request.user) | Q(shared_with=self.request.user)
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='share')
    def share_task(self, request, pk=None):
        task = self.get_object()
        username_to_share = request.data.get('username')

        if not username_to_share:
            return Response({'error': 'Forneça o username.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_share = User.objects.get(username=username_to_share)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if user_to_share == task.user:
            return Response({'error': 'Você já é o dono.'}, status=status.HTTP_400_BAD_REQUEST)

        task.shared_with.add(user_to_share)
        return Response({'message': 'Compartilhado com sucesso!'}, status=status.HTTP_200_OK)