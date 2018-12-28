const express = require('express');
const hbs = require('hbs');

let app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', ()=> {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=> {
    return text.toUpperCase();
});


app.get('/', (request, response)=> {
    let obj = {
        name: 'Vadym',
        age: 36,
        hobbies: ['programming', 'drums', 'fantasy']
    };
    response.render('home', {
        pageTitle: 'Home page',
        wellcomingLetter: 'Welcome to the home page'
    });
});

app.get('/about', (request, response)=> {
    response.render('about.hbs', {
        pageTitle: 'About page',
    });
});

app.get('/projects', (request, response)=> {
    response.render('projects', {
        pageTitle: 'Projects portfolio'
    });
});


app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started');
});