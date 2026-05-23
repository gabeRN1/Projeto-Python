# To-Do List App - Teste Prático

Este repositório contém a solução para o desafio técnico de Desenvolvedor Python (Back-end). Trata-se de uma aplicação web de gerenciamento de tarefas (To-Do List) com recursos avançados de compartilhamento, categorização e integração externa (Clima).

## Arquitetura e Tecnologias

A aplicação foi estruturada no formato de **Monorepo**, separando claramente as responsabilidades entre Front-end e Back-end, orquestrados via Docker para garantir um ambiente de desenvolvimento isolado e reprodutível.

* **Back-end:** Python 3.11, Django, Django REST Framework (DRF)
* **Front-end:** React, Vite
* **Banco de Dados:** SQLite3
* **Testes:** Pytest (Back-end) e Selenium (Front-end)
* **Infraestrutura:** Docker e Docker Compose
* **CI/CD:** GitHub Actions

## Decisões de Design e Boas Práticas

Durante o desenvolvimento, os seguintes princípios foram adotados:
* **KISS & DRY:** Utilização de recursos nativos do Django REST Framework (como `PageNumberPagination` e `DjangoFilterBackend`) para evitar a reinvenção da roda na paginação e filtragem.
* **SOLID:** Modelagem de dados com responsabilidades únicas (separação clara entre regras de negócio na API e consumo no Front-end).
* **Isolamento de Ambiente:** Uso de containers Docker para garantir que a aplicação rode perfeitamente em qualquer máquina, sem conflitos de dependências.

## Funcionalidades Implementadas

* **Autenticação:** Criação de conta e login de usuários.
* **CRUD de Tarefas:** Criar, ler, atualizar (incluindo marcar como concluída) e excluir tarefas.
* **Categorias:** Criação e gerenciamento de categorias para organização das tarefas.
* **Compartilhamento:** Possibilidade de compartilhar tarefas específicas com outros usuários cadastrados.
* **Filtros e Paginação:** Listagem de tarefas com paginação nativa e filtros avançados.
* **Integração Externa:** Consumo de API externa para exibição de dados de clima/geolocalização.

## Como executar o projeto localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.
* Git para clonar o repositório.

### Passo a passo

1. Clone este repositório:
   ```bash
   git clone [https://github.com/gabeRN1/Projeto-Python.git](https://github.com/gabeRN1/Projeto-Python.git)
   cd Projeto-Python
   ```
2. Suba os containers da aplicação:
    ```Bash
    docker compose up -d --build
    ```
3. (Opcional) Caso as migrações do banco não rodem automaticamente ao subir o container, execute:
   ``` Bash
    docker compose exec backend python manage.py migrate
    ```
4.   Acesse a aplicação no seu navegador:

        Front-end (React): http://localhost:5173

        Back-end (API Django): http://localhost:8000/api/

## Executando os Testes Automatizados

A aplicação conta com uma esteira de CI/CD automatizada no GitHub Actions, garantindo a integridade do código a cada push. Você também pode rodar os testes localmente com os comandos abaixo:

**Testes de Unidade e Integração (Back-end):**
```bash
docker compose exec backend pytest tasks/tests_api.py
```

**Testes E2E com Selenium (Front-end):**

```bash
docker compose exec backend python debug_register.py
```
