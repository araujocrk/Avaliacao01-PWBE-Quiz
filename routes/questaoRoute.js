const express = require('express');
const router = express.Router();

const questaoController = require('../controllers/questaoController');

// Rotas Questão

// Lista de questões
router.get('/', questaoController.listarQuestoes);
// Criar questão (formulário)
router.get('/novaQuestao', questaoController.novaQuestaoForm);
// Criar questão (validação + criação db)
router.post('/novaQuestao', questaoController.criarQuestao);
// Editar questão (formulário)
router.get('/editar', questaoController.editarQuestaoForm);
// Editar questão (validação + edição db)
router.post('/editar', questaoController.editarQuestao);
// Deletar questão (formulário)
router.get('/deletar', questaoController.deletarQuestaoForm);
// Deletar questão (deletar db)
router.post('/deletar', questaoController.deletarQuestao);

module.exports = router