const express = require('express');
const router = express.Router();

const QuizRoute = require('../controllers/quizController');

router.get('/', QuizRoute.quizInicio);
router.get('/jogar', QuizRoute.quizJogar);
router.post('/resultado', QuizRoute.quizResposta);
router.get('/encerrar', QuizRoute.quizEncerrar);

module.exports = router;