const GATEWAY_BASE_URL = 'https://verbose-meme-gr7w774vqjpfg55-3000.app.github.dev/';

document.addEventListener('DOMContentLoaded', () => {
    const buscarBtn = document.getElementById('buscarBtn');
    const idClienteInput = document.getElementById('idCliente');
    const resultadoDiv = document.getElementById('resultado');

    buscarBtn.addEventListener('click', async () => {
        const idCliente = idClienteInput.value.trim();
        if (!idCliente) {
            resultadoDiv.textContent = 'Por favor, digite um ID de cliente.';
            resultadoDiv.className = 'error';
            return;
        }

        resultadoDiv.textContent = 'Buscando dados...';
        resultadoDiv.className = 'loading';

        try {
            const apiUrl = `${GATEWAY_BASE_URL}/clientes/${idCliente}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Erro ${response.status}`);
            }
            
            resultadoDiv.textContent = JSON.stringify(data, null, 2);
            resultadoDiv.className = '';

        } catch (error) {
            resultadoDiv.textContent = `Erro ao consultar a API: ${error.message}`;
            resultadoDiv.className = 'error';
            console.error('Falha na requisição:', error);
        }
    });
});