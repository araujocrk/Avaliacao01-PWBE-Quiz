const express = require('express');
const router = express.Router();

const questaoController = require('../controller/questaoController');

router.get('/', questaoController.listarQuestoes);


module.exports = router