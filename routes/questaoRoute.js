const express = require('express');
const router = express.Router();

const questaoController = require('../controllers/questaoController');

router.get('/', questaoController.listarQuestoes);
router.get('/novaQuestao', questaoController.novaQuestaoForm);
router.post('/novaQuestao', questaoController.criarQuestao);
router.get('/editar', questaoController.editarQuestaoForm);
router.post('/editar', questaoController.editarQuestao);

module.exports = router