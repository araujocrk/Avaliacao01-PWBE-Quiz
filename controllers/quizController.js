const Questao = require('../models/questaoModel');

exports.quizInicio = function (req, res) {
    res.render('pages/inicioQuiz', {
        title: 'Quiz - Início',
        showHeader: true,
        page: 'quiz'
    });
};


exports.quizJogar = (req, res) => {
    Questao.listarQuestoes()
        .then(result => {
            const questaoAleatoria = result[Math.floor(Math.random() * result.length)];
            res.render('pages/quiz', {
                questao: questaoAleatoria,
                title: 'Quiz - Jogar',
                showHeader: true,
                page: 'quiz'
            });
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Erro ao Listar Questões',
                showHeader: false,
                page: '',
                erros: [error]
            });
        })
};

exports.quizResposta = (req, res) => {
    const idQuestao = parseInt(req.body.id);
    const respostaUsuario = req.body.resposta;

    Questao.questaoID(idQuestao)
        .then(result => {
            const correta = result.data.correta;
            const acertou = respostaUsuario.toUpperCase() === correta;

            // Inicializa sessão se não houver
            if (!req.session.stats) {
                req.session.stats = {
                    totalRespondidas: 0,
                    acertos: 0,
                    erros: 0
                };
            }

            req.session.stats.totalRespondidas++;
            acertou ? req.session.stats.acertos++ : req.session.stats.erros++;

            res.render('pages/quizResposta', {
                questao: result,
                respostaUsuario: respostaUsuario.toUpperCase(),
                stats: req.session.stats,
                title: 'Resultado da Resposta',
                showHeader: true,
                page: 'quiz'
            });
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Erro',
                showHeader: false,
                page: '',
                erros: [error.message]
            });
        });
};

exports.quizEncerrar = function (req, res) {
    req.session.destroy(error => {
        if (error) {
            return res.render('pages/error', {
                title: 'Erro ao encerrar quiz',
                showHeader: false,
                page: '',
                erros: ['Erro ao encerrar sessão do quiz.']
            });
        }

        res.redirect('/');
    });
};