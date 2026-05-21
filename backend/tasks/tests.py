from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task

class TaskAPITestCase(APITestCase):
    def setUp(self):
        """
        Método executado automaticamente antes de CADA teste.
        Serve para popular o banco de dados com dados iniciais.
        """

        self.url = '/api/tasks/'
        self.task_padrao = Task.objects.create(
            title="Tarefa Inicial",
            description="Criada no setUp",
            completed=False
        )

    def test_listar_tarefa(self):
        """Testa se o endpoint GET retorna a lista de tarefas corretamente"""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Tarefa Inicial")

    def test_criar_tarefa_com_sucesso(self):
        """Teste a criação de uma nova tarefa via POST"""
        payload = {
            "title":"Aprender Testes",
            "description":" Estudar APITestCase",
            "completed":False
        }

        response = self.client.post(self.url, payload, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)
        self.assertEqual(Task.objects.last().title, "Aprender Testes")

    def test_nao_criar_tarefa_sem_titulo(self):
        """Testa a validação do serializer bloqueando payloads inválidos"""
        payload = {
            "description": "Faltou o título obrigatório"
        }
        response = self.client.post(self.url, payload, fromat='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_atualizar_tarefa(self):
        """Testa a atualização do status da tarefa via PATCH"""
        url_detalhe = f"{self.url}{self.task_padrao.id}/"
        payload = {"completed": True}

        response = self.client.patch(url_detalhe, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task_padrao.refresh_from_db()
        self.assertTrue(self.task_padrao.completed)