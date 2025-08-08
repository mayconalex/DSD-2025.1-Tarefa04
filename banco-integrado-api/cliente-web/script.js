const GATEWAY_BASE_URL = 'https://verbose-meme-gr7w774vqjpfg55-3000.app.github.dev';

document.addEventListener('DOMContentLoaded', () => {
    const buscarBtn = document.getElementById('buscarBtn');
    const relatorioBtn = document.getElementById('relatorioBtn');
    const idClienteInput = document.getElementById('idCliente');
    
    const resultadoContainer = document.getElementById('resultado-container');
    const dadosClienteDiv = document.getElementById('dados-cliente');
    const acoesClienteDiv = document.getElementById('acoes-cliente');
    const notificacoesDiv = document.getElementById('notificacoes');

    function renderizarResultado(data) {
        dadosClienteDiv.innerHTML = '';
        acoesClienteDiv.innerHTML = '';
        notificacoesDiv.innerHTML = '';
        resultadoContainer.style.display = 'block';
        const dadosHtml = `
            <ul>
                <li><strong>ID:</strong> ${data.id}</li>
                <li><strong>Nome:</strong> ${data.nome}</li>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Idade:</strong> ${data.idade}</li>
                <li><strong>Score de Crédito:</strong> ${data.scoreCredito}</li>
            </ul>
        `;
        dadosClienteDiv.innerHTML = dadosHtml;

        if (data._links) {
            for (const rel in data._links) {
                const link = data._links[rel];
                const btn = document.createElement('button');
                btn.textContent = rel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                btn.onclick = () => {
                    alert(`Ação disparada: ${rel}\nNavegaria para: ${link.href}`);
                };
                acoesClienteDiv.appendChild(btn);
            }
        }
    }

    function mostrarNotificacao(mensagem, tipo = 'info') {
        notificacoesDiv.innerHTML = `<p class="${tipo}">${mensagem}</p>`;
        setTimeout(() => {
            notificacoesDiv.innerHTML = '';
        }, 5000);
    }
    
    buscarBtn.addEventListener('click', async () => {
        const idCliente = idClienteInput.value.trim();
        if (!idCliente) {
            mostrarNotificacao('Por favor, digite um ID de cliente.', 'error');
            return;
        }
        
        resultadoContainer.style.display = 'none';
        mostrarNotificacao('Buscando dados...');

        try {
            const response = await fetch(`${GATEWAY_BASE_URL}/clientes/${idCliente}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Erro ${response.status}`);
            
            renderizarResultado(data);

        } catch (error) {
            resultadoContainer.style.display = 'none';
            mostrarNotificacao(`Erro ao consultar a API: ${error.message}`, 'error');
            console.error('Falha na requisição síncrona:', error);
        }
    });

    relatorioBtn.addEventListener('click', async () => {
        const idCliente = idClienteInput.value.trim();
        if (!idCliente) {
            mostrarNotificacao('Por favor, digite um ID de cliente.', 'error');
            return;
        }
        
        mostrarNotificacao('Enviando pedido de relatório para a fila...');
        
        try {
            const response = await fetch(`${GATEWAY_BASE_URL}/clientes/${idCliente}/relatorios`, { method: 'POST' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Erro ${response.status}`);
            
            mostrarNotificacao(`Gateway respondeu (Status ${response.status}): ${data.status}`, 'info');

        } catch (error) {
            mostrarNotificacao(`Erro ao solicitar o relatório: ${error.message}`, 'error');
            console.error('Falha na requisição assíncrona:', error);
        }
    });
});