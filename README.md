# To-Do List App - Teste Prático

Este repositório contém a solução para o desafio técnico de Desenvolvedor Python (Back-end). Trata-se de uma aplicação web de gerenciamento de tarefas (To-Do List) com recursos avançados de compartilhamento, categorização e integração externa.

## Arquitetura e Tecnologias

A aplicação foi estruturada no formato de **Monorepo**, separando claramente as responsabilidades entre Front-end e Back-end, orquestrados via Docker para garantir um ambiente de desenvolvimento isolado e reprodutível.

* **Back-end:** Python 3.11, Django, Django REST Framework (DRF)
* **Front-end:** React, Vite
* **Banco de Dados:** PostgreSQL 15
* **Testes:** Pytest (Back-end) e Selenium (Front-end)
* **Infraestrutura:** Docker e Docker Compose
* **CI/CD:** GitHub Actions

## Decisões de Design e Boas Práticas

Durante o desenvolvimento, os seguintes princípios foram adotados:
* **KISS & DRY:** Utilização de recursos nativos do Django REST Framework (como `PageNumberPagination` e `DjangoFilterBackend`) para evitar a reinvenção da roda na paginação e filtragem.
* **SOLID:** Modelagem de dados com responsabilidades únicas (ex: separação entre a `Task` e a tabela de pivô `SharedTask` para compartilhamento de tarefas).
* **Isolamento de Ambiente:** Uso de variáveis de ambiente (`.env` / Docker) para proteger credenciais de banco de dados e APIs externas.

## Como executar o projeto localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.
* Git para clonar o repositório.

### Passo a passo

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/todo-list-advice.git](https://github.com/seu-usuario/todo-list-advice.git)
    cd todo-list-advice
    ```

2.  Suba os containers da aplicação:
    ```bash
    docker-compose up --build
    ```

3.  Acesse a aplicação no seu navegador:
    * **Front-end (React):** http://localhost:5173
    * **Back-end (API Django):** http://localhost:8000/api/
