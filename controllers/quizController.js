// const RespostaQuiz = require('../models/respostasModel');
const Questao = require('../models/questaoModel');

exports.quizInicio = async function (req, res) {
    res.render('pages/inicioQuiz', 
        {   
            title: 'Quiz - Início',
            showHeader: true,
            page: 'quiz'
        }
    );
};


exports.quizJogar = async (req, res) => {
    try {
        const questoes = await Questao.listaQuestoes();
        const questaoAleatoria = questoes[Math.floor(Math.random() * questoes.length)];
        res.render('pages/quiz', {
            questao: questaoAleatoria,
            title: 'Quiz - Jogar',
            showHeader: true,
            page: 'quiz'
        });
    } catch (error) {
        res.render('pages/error', {
            title: 'Erro',
            showHeader: false,
            page: '',
            erros: [error.message]
        });
    }
};

exports.quizResposta = async (req, res) => {
    try {
        const idQuestao = parseInt(req.body.id);
        const respostaUsuario = req.body.resposta;

        const questoes = await Questao.listaQuestoes();
        const questao = questoes.find(q => q.id === idQuestao);

        const correta = questao.correta;
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
            questao,
            respostaUsuario: respostaUsuario.toUpperCase(),
            stats: req.session.stats,
            title: 'Resultado da Resposta',
            showHeader: true,
            page: 'quiz'
        });
    } catch (error) {
        console.log(error)
        res.render('pages/error', {
            title: 'Erro',
            showHeader: false,
            page: '',
            erros: [error.message]
        });
    }
};