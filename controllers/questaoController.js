const Questao = require('../models/questaoModel');

exports.listarQuestoes = async (req, res) => {
    try {
        const questoes = await Questao.listarQuestoes();
        res.render('questoes/listaQuestoes', 
            { 
                questoes, 
                title: 'Lista de Questões', 
                showHeader: true,
                page: 'questoes',
            });
    } catch (error) {
        console.log(error)
        res.render('pages/error', 
            { 
                title: 'Lista de Questões',
                showHeader: true,
                page: '',
                erros: [error.message]
            });
    }
}

exports.novaQuestaoForm = (req, res) => {
    res.render('pages/novaQuestaoForm', 
        { 
            title: 'Criar Questão', 
            showHeader: true, 
            page: 'criar' 
        });
}

exports.criarQuestao = async function (req, res) {
    const questao = new Questao(req.body);
    questao.validate();
    console.log(req.body) // teste
    if (questao.errors.length > 0) {
        return res.render('pages/error', { 
            title: 'Criar Questão',
            showHeader: false,
            page: '',
            erros: questao.errors
        })
    }

    try {
        const id = await questao.create();
        console.log('Questão criada com sucesso.')
        res.redirect('/questoes')
        console.log(id)
    } catch (error) {
        console.log(error)
        res.render('pages/error', 
            { 
                title: 'Erros',
                showHeader: false,
                page: '',
                erros: [error.error] || 'Erro desconhecido' 
            })
        
    }
}
