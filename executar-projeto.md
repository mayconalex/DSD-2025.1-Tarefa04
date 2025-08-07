**1. Iniciar Serviço SOAP (Java):**
*   **Terminal 1:**
    ```bash
    cd servico-score-soap
    cd score-soap-service
    mvn compile exec:java -Dexec.mainClass="br.com.banco.Publisher"
    ```

**2. Iniciar Serviço REST (Node.js):**
*   **Terminal 2:**
    ```bash
    cd servico-perfis-rest
    node server.js
    ```

**3. Iniciar API Gateway (Node.js):**
*   **Terminal 3:**
    ```bash
    cd gateway
    node server.js
    ```

**4. Iniciar Cliente Web (Node.js):**
*   **Terminal 4:**
    ```bash
    cd cliente-web
    serve -l 5000
    ```