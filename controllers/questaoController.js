const Questao = require('../models/questaoModel');

exports.listarQuestoes = async (req, res) => {
    try {
        const questoes = await Questao.listaQuestoes();
        res.render('pages/listaQuestoes',
            {
                questoes,
                title: 'Lista de Questões',
                showHeader: true,
                page: 'questoes'
            }
        );
    } catch (error) {
        console.log(error)
        res.render('pages/error',
            {
                title: 'Lista de Questões',
                showHeader: true,
                page: '',
                erros: [error.message]
            }
        );
    }
};

exports.novaQuestaoForm = (req, res) => {
    res.render('pages/novaQuestaoForm',
        {
            title: 'Criar Questão',
            showHeader: true,
            page: 'criar'
        }
    );
};

exports.criarQuestao = async function (req, res) {
    const questao = new Questao(req.body);
    questao.validate();

    if (questao.errors.length > 0) {
        res.render('pages/error',
            {
                title: 'Criar Questão',
                showHeader: false,
                page: '',
                erros: questao.errors
            }
        );
    }

    try {
        const id = await questao.create();
        console.log('Questão criada com sucesso.')
        res.redirect('/questoes')
    } catch (error) {
        return res.render('pages/error',
            {
                title: 'Erros',
                showHeader: false,
                page: '',
                erros: [error.error] || 'Erro desconhecido'
            }
        );
    }
};

exports.editarQuestaoForm = function (req, res) {
    res.render('pages/editarQuestaoForm',
        {
            title: 'Editar Questão',
            showHeader: true,
            page: 'editar'
        }
    );
};

exports.editarQuestao = async function (req, res) {
    const id = parseInt(req.body.id, 10);

    const questao = new Questao(req.body);
    questao.validate();

    if (!id || isNaN(id)) {
        questao.errors.push('ID da questão é obrigatório e deve ser um número.');
    }

    if (questao.errors.length > 0) {
        return res.render('pages/error', 
            {
                title: 'Editar Questão',
                showHeader: false,
                page: '',
                erros: questao.errors
            }
        );
    }

    try {
        await questao.update(id);
        res.redirect('/questoes');
    } catch (error) {
        res.render('pages/error', 
            {
                title: 'Erro ao editar',
                showHeader: false,
                page: '',
                erros: [error.message]
            }
        );
    }
};

exports.deletarQuestaoForm = function (req, res) {
    res.render('pages/deletarQuestaoForm', 
        {
            title: 'Deletar Questão',
            showHeader: true,
            page: 'deletar'
        }
    );
};

exports.deletarQuestao = async function (req, res) {
    const id = req.body.id;

    try {
        await Questao.deletar(id);
        res.redirect('/questoes');
    } catch (error) {
        return res.render('pages/error', 
            {
                title: 'Erro ao editar',
                showHeader: false,
                page: '',
                erros: [error.message]
            }
        );
    }
};