const express = require('express');
const app = express();
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'ejs');

const expressEjsLayouts = require('express-ejs-layouts');
app.use(expressEjsLayouts);

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

const MainRoute = require('./routes/mainRoute');
const QuestaoRoute = require('./routes/questaoRoute');
const QuizRoute = require('./routes/quizRoute');


app.use('/', MainRoute);
app.use('/questoes', QuestaoRoute);
app.use('/quiz', QuizRoute);


app.listen(port, () => {
    console.log(`Rodando servidor em http://localhost:${port}.`)
})