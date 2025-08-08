const amqp = require('amqplib');

// URL de conexão com o RabbitMQ.
// Como o RabbitMQ está rodando em um contêiner Docker na mesma "máquina"
// do Codespaces, podemos nos conectar a ele usando 'localhost'.
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';
const nomeDaFila = 'fila_de_relatorios';

async function iniciarConsumidor() {
    console.log('🔄 Iniciando consumidor de relatórios...');
    try {
        // 1. Conecta-se ao servidor RabbitMQ
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        console.log('✅ Conectado ao RabbitMQ com sucesso!');

        // 2. Garante que a fila existe. Se não existir, ela será criada.
        // 'durable: true' significa que a fila sobreviverá a reinicializações do RabbitMQ.
        await channel.assertQueue(nomeDaFila, { durable: true });

        console.log(`[*] Aguardando por pedidos de relatório na fila: "${nomeDaFila}". Para sair, pressione CTRL+C`);

        // 3. Configura o consumidor para a fila (estilo de Notificação de Evento/Listener)
        // 'channel.consume' registra uma função de callback para ser executada
        // sempre que uma nova mensagem chegar na fila.
        channel.consume(nomeDaFila, (msg) => {
            if (msg !== null) {
                // Converte o conteúdo da mensagem (que é um Buffer) para string
                const conteudoMsg = msg.content.toString();
                console.log(`\n📥 [${new Date().toLocaleTimeString()}] Recebido pedido: ${conteudoMsg}`);

                // 4. Simula um trabalho demorado (ex: gerar um relatório complexo)
                console.log(`⚙️  Processando o relatório... (isso levará 5 segundos)`);
                setTimeout(() => {
                    console.log(`✅ [${new Date().toLocaleTimeString()}] Relatório para "${conteudoMsg}" foi gerado com sucesso!`);
                    
                    // 5. Envia o Acknowledgement (ack) para o RabbitMQ.
                    // Isso informa ao Rabbit que a mensagem foi processada com sucesso
                    // e pode ser removida permanentemente da fila.
                    channel.ack(msg);
                }, 5000); // 5 segundos de simulação
            }
        }, {
            // 'noAck: false' é crucial. Garante que a mensagem só será removida da fila
            // depois que chamarmos 'channel.ack()'. Se o nosso consumidor falhasse,
            // a mensagem voltaria para a fila para ser processada por outro.
            noAck: false 
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar o consumidor:', error.message);
        // Tenta reconectar após um tempo
        setTimeout(iniciarConsumidor, 5000);
    }
}

iniciarConsumidor();