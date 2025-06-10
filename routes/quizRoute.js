const express = require('express');
const router = express.Router();

const QuizRoute = require('../controllers/quizController');

router.get('/', QuizRoute.quizInicio);
// router.get('/jogar', QuizRoute.quizJogar);

module.exports = router;