const express = require('express');
const axios = require('axios');
const soap = require('soap');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

const PERFIS_API_URL = 'http://localhost:3001';

const SCORE_WSDL_URL = 'http://localhost:8080/score-service?wsdl';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Banco Integrado API Gateway',
            version: '1.0.0',
            description: 'API Gateway que integra um serviço REST de perfis e um serviço SOAP de score de crédito.',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retorna o perfil completo de um cliente.
 *     description: Orquestra chamadas a um serviço REST de perfis e a um serviço SOAP de score para obter os dados consolidados do cliente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do cliente a ser consultado.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Resposta bem-sucedida com os dados do cliente e links HATEOAS.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 nome:
 *                   type: string
 *                   example: "João da Silva"
 *                 email:
 *                   type: string
 *                   example: "joao.silva@exemplo.com"
 *                 idade:
 *                   type: integer
 *                   example: 34
 *                 scoreCredito:
 *                   type: integer
 *                   example: 750
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: "/clientes/123"
 *                     extrato:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: "/clientes/123/extrato"
 *       '404':
 *         description: Cliente não encontrado no serviço de perfis.
 *       '500':
 *         description: Erro interno no servidor ou em um dos serviços de backend.
 */
app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const perfilPromise = axios.get(`${PERFIS_API_URL}/perfis/${id}`);

        const scorePromise = new Promise((resolve, reject) => {
            soap.createClient(SCORE_WSDL_URL, (err, client) => {
                if (err) return reject(err);
                client.getScore({ idCliente: id }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });

        const [perfilResponse, scoreResponse] = await Promise.all([
            perfilPromise,
            scorePromise,
        ]);

        const perfilData = perfilResponse.data;
        const scoreResult = scoreResponse.return;

        const respostaFinal = {
            ...perfilData,
            scoreCredito: scoreResult,
            _links: {
                self: {
                    href: `/clientes/${id}`
                },
                extrato: {
                    href: `/clientes/${id}/extrato`
                },
                solicitar_cartao: {
                    href: `/clientes/${id}/cartoes`
                },
            },
        };

        res.status(200).json(respostaFinal);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: `Cliente com ID ${id} não encontrado.` });
        } else {
            console.error("Erro no Gateway:", error.message);
            res.status(500).json({ message: 'Erro interno ao processar a requisição.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway rodando em http://localhost:${PORT}`);
    console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});