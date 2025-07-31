const express = require('express');
const app = express();
const PORT = 3001;

const perfis = [
    { id: "123", nome: "João da Silva", email: "joao.silva@exemplo.com", idade: 34 },
    { id: "456", nome: "Maria Oliveira", email: "maria.o@exemplo.com", idade: 28 },
];

app.get('/perfis/:id', (req, res) => {
    const perfil = perfis.find(p => p.id === req.params.id);
    if (perfil) {
        res.json(perfil);
    } else {
        res.status(404).json({ message: 'Perfil não encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Serviço REST de Perfis rodando em http://localhost:${PORT}`);
});