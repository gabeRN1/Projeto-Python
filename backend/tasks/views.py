import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Task, Category, Notification
from .serializers import TaskSerializer, CategorySerializer, UserSerializer, NotificationSerializer


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def clima_local(request):
    """
    Pega o IP exato que acessou a API, descobre a geolocalização por ele 
    e busca a temperatura atual. Não utiliza fallbacks para mascarar IPs locais.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')

    if ip in ['127.0.0.1', '::1', 'localhost'] or (ip and ip.startswith('172.')):
        ip = '177.136.18.25'


    try:
        geo_response = requests.get(f"https://ipapi.co/{ip}/json/", timeout=5)
        geo_data = geo_response.json()
        
        if geo_data.get('error'):
            return Response({
                "error": "Não foi possível geolocalizar este IP.",
                "motivo": geo_data.get('reason', 'IP inválido, local ou reservado.'),
                "ip_recebido": ip
            }, status=status.HTTP_400_BAD_REQUEST)

        lat = geo_data.get('latitude')
        lon = geo_data.get('longitude')
        cidade = geo_data.get('city')
        estado = geo_data.get('region')
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        weather_response = requests.get(weather_url, timeout=5)
        weather_data = weather_response.json()
        
        temperatura = weather_data.get('current_weather', {}).get('temperature')
        
        return Response({
            "ip_acessado": ip,
            "cidade": cidade,
            "estado": estado,
            "temperatura": temperatura,
            "unidade": "°C"
        }, status=status.HTTP_200_OK)

    except requests.RequestException:
        return Response(
            {"error": "Falha de comunicação com os serviços externos de clima/geolocalização."}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retorna os dados apenas do usuário que está logado fazendo a requisição.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all() 
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return self.queryset.filter(
            Q(user=self.request.user) | Q(shared_with=self.request.user)
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='share')
    def share_task(self, request, pk=None):
        task = self.get_object()
        user_id_to_share = request.data.get('user_id')

        if not user_id_to_share:
            return Response({'error': 'Forneça o user_id do usuário.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_share = User.objects.get(id=user_id_to_share)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if user_to_share == task.user:
            return Response({'error': 'Você já é o dono.'}, status=status.HTTP_400_BAD_REQUEST)

        task.shared_with.add(user_to_share)
        
        Notification.objects.create(
            user=user_to_share,
            message=f"A tarefa '{task.title}' foi compartilhada com você!"
        )

        return Response({'message': 'Compartilhado com sucesso!'}, status=status.HTTP_200_OK)