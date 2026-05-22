import pytest
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Task, Category

pytestmark = pytest.mark.django_db

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user1():
    return User.objects.create_user(username="testuser1", password="password123")

@pytest.fixture
def user2():
    return User.objects.create_user(username="testuser2", password="password123")

def test_user_registration(client):
    """Testa se a API de registro de usuário funciona corretamente"""
    url = reverse('register')
    data = {
        "username": "newuser",
        "email": "newuser@test.com",
        "password": "securepassword"
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 201
    assert User.objects.filter(username="newuser").exists()

def test_create_category(client, user1):
    """Testa se um usuário logado consegue criar uma categoria"""
    client.force_authenticate(user=user1)
    url = reverse('category-list')
    response = client.post(url, {'name': 'Trabalho'}, format='json')
    
    assert response.status_code == 201
    assert Category.objects.filter(name='Trabalho', user=user1).exists()

def test_create_task(client, user1):
    """Testa se a tarefa é criada corretamente para o usuário logado"""
    client.force_authenticate(user=user1)
    url = reverse('task-list')
    data = {"title": "Estudar Pytest", "completed": False}
    
    response = client.post(url, data, format='json')
    assert response.status_code == 201
    assert Task.objects.filter(title="Estudar Pytest", user=user1).exists()

def test_task_isolation(client, user1, user2):
    """Testa se o User2 NÃO consegue ver a tarefa do User1 (Isolamento)"""
    Task.objects.create(title="Segredo do User1", user=user1)
    
    client.force_authenticate(user=user2)
    url = reverse('task-list')
    response = client.get(url)
    
    assert response.status_code == 200
    assert len(response.data) == 0

def test_share_task(client, user1, user2):
    """Testa a lógica de compartilhamento de tarefas"""
    task = Task.objects.create(title="Tarefa Compartilhada", user=user1)
    
    client.force_authenticate(user=user1)

    base_url = reverse('task-detail', args=[task.id])
    url = f"{base_url}share/"
    
    response = client.post(url, {'username': 'testuser2'}, format='json')
    assert response.status_code == 200
    
    task.refresh_from_db()
    assert user2 in task.shared_with.all()
    
    client.force_authenticate(user=user2)
    response_get = client.get(reverse('task-list'))
    assert len(response_get.data) == 1
    assert response_get.data[0]['title'] == "Tarefa Compartilhada"