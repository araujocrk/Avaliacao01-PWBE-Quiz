const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home',
        {
            title: 'Página Inicial',
            showHeader: true,
            page: 'home'
        });
});

module.exports = router