# Projeto: API Gateway com Integração Síncrona (REST/SOAP) e Assíncrona (MOM)

Este projeto é uma demonstração prática de uma arquitetura de microsserviços moderna, que utiliza um API Gateway para orquestrar a comunicação entre diferentes tipos de serviços de backend. Ele implementa tanto fluxos de comunicação síncronos (requisição-resposta) quanto assíncronos (baseados em eventos com filas de mensagens).

---

**Slides de Apresentação no Gamma:** https://gamma.app/docs/REST-SOAP-e-MOM-zxuxqapgjevfmdz

**Versão em PDF:** [⬇️Baixar PDF](./presentation.pdf)

---

## Arquitetura do Sistema

O sistema é composto pelos seguintes serviços:

1.  **API Gateway (Node.js/Express):** O ponto único de entrada para todas as requisições dos clientes. Ele orquestra chamadas, agrega dados e publica mensagens.
2.  **Serviço de Perfis (Node.js/Express):** Um microsserviço RESTful moderno que fornece dados cadastrais de clientes.
3.  **Serviço de Score (Java/JAX-WS):** Simula um serviço legado SOAP que fornece o score de crédito de um cliente.
4.  **RabbitMQ (Docker):** O Message-Oriented Middleware (MOM) que gerencia a fila de mensagens para operações assíncronas.
5.  **Serviço de Relatórios (Node.js):** Um serviço consumidor (worker) que processa tarefas demoradas de forma assíncrona a partir da fila do RabbitMQ.
6.  **Cliente Web (HTML/JS):** Uma interface de usuário simples para interagir com o API Gateway.

---

## Como Executar o Projeto (Guia de Inicialização)

Para executar o projeto completo, você precisará de **6 terminais** abertos no seu ambiente de desenvolvimento (ex: VS Code com painéis de terminal divididos). Siga os passos na ordem abaixo.

### 1. Iniciar o Intermediário de Mensagens (RabbitMQ)

Este serviço é a base para a comunicação assíncrona e deve ser iniciado primeiro.

*   **Terminal 1:**
    ```bash
    # Inicia o contêiner do RabbitMQ em background. 
    # Se o contêiner já existir, mas estiver parado, use: docker start rabbitmq-banco
    docker run -d --hostname meu-rabbit --name rabbitmq-banco -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
    ```
*   **Verificação:** Acesse a interface web do RabbitMQ na URL da **porta 15672** fornecida pelo seu ambiente. Login: `guest` / `guest`.

### 2. Iniciar o Consumidor de Relatórios

Este serviço ficará ouvindo a fila por novas tarefas.

*   **Terminal 2:**
    ```bash
    cd servico-relatorios-consumer
    node consumer.js
    ```
*   **Verificação:** O terminal deve exibir "Aguardando por pedidos de relatório...".

### 3. Iniciar o Serviço SOAP (Java)

Este é o nosso serviço legado.

*   **Terminal 3:**
    ```bash
    # Navegue para o diretório correto do projeto Maven
    cd servico-score-soap/score-soap-service
    
    # Compile e execute
    mvn compile exec:java -Dexec.mainClass="br.com.banco.Publisher"
    ```
*   **Verificação:** O terminal deve exibir "Serviço SOAP de Score rodando...". Acesse o WSDL na URL da **porta 8080**.

### 4. Iniciar o Serviço REST (Node.js)

Este é o nosso serviço moderno.

*   **Terminal 4:**
    ```bash
    cd servico-perfis-rest
    node server.js
    ```
*   **Verificação:** O terminal deve exibir "Serviço REST de Perfis rodando...".

### 5. Iniciar o API Gateway (Node.js)

Este é o ponto central que conecta tudo.

*   **Terminal 5:**
    ```bash
    cd gateway
    node server.js
    ```
*   **Verificação:** O terminal deve exibir "API Gateway rodando...". A documentação estará na URL da **porta 3000** em `/api-docs`.

### 6. Iniciar o Cliente Web

Esta é a interface do usuário.

*   **Terminal 6:**
    ```bash
    cd cliente-web
    serve -l 5000
    ```
*   **Verificação:** Acesse a URL da **porta 5000** no seu navegador para usar a aplicação.

---

## Como Parar o Projeto

Para parar todos os serviços, execute os seguintes comandos no terminal:

```bash
# Para parar os serviços Node.js (Gateway, REST, Cliente Web, Consumidor)
killall node

# Para parar o serviço Java (SOAP)
killall java

# Para parar o contêiner do RabbitMQ
docker stop rabbitmq-banco
```
