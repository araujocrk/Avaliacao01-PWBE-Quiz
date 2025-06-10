// const RespostaQuiz = require('../models/quizModel');
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

// exports.quizJogar = async function (req, res) {
//     const questoes = await  Questao.listaQuestoes();
//     res.render('pages/quiz', 
//         {   
//             questoes,
//             title: 'Quiz - Jogar',
//             showHeader: true,
//             page: 'quiz'
//         }
//     );
// };
