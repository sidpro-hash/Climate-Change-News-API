const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');
const cors = require('cors')

const app = express()
//https://expressjs.com/en/resources/middleware/cors.html
//https://formio.github.io/formio.js/app/examples/select.html
//https://stackoverflow.com/questions/62979567/api-request-error-no-access-control-allow-origin-header-is-present-on-the-re

app.use(cors())  // allow reuqest from everywhere

var corsOptions = {
    origin: 'https://turiya.gsft.protium.net.in/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const newspappers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }
]

const articals = []

newspappers.forEach(newspapper => {
    axios.get(newspapper.address)
        .then(response => {
            const html = response.data;
            //console.log(html);
            const $ = cheerio.load(html);
            
            $('a:contains("climate")',html).each( function() { // arrow function dosen't work
               const title =  $(this).text();
               const url = $(this).attr('href');
               articals.push({
                   title,
                   url: newspapper.base + url,
                   source: newspapper.name
               });
            });
           
        }).catch((err) => console.log(err));
})

app.get('/',(req,res) => {
    res.json('Welcome to Climant Change News API, For more info Visit https://github.com/sidpro-hash/Climate-Change-News-API');
});

app.get('/news',(req,res) => {
    res.json(articals);
});

app.get('/news/:newspapperId',(req,res) => {
    const newspapperId = req.params.newspapperId;
    const newspapperAddress = newspappers.filter(newspapper => newspapper.name == newspapperId)[0].address;
    const newspapperbase = newspappers.filter(newspapper => newspapper.name == newspapperId)[0].base;
    axios.get(newspapperAddress).then(response => {
            const html = response.data;
            //console.log(html);
            const $ = cheerio.load(html);
            const specificArticals = []
            $('a:contains("climate")',html).each( function() { // arrow function dosen't work
               const title =  $(this).text();
               const url = $(this).attr('href');
               specificArticals.push({
                   title,
                   url: newspapperbase + url,
                   source: newspapperId
               });
            });
            res.json(specificArticals);
    }).catch((err) => console.log(err));
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.listen(PORT,() => console.log(`server rnpmunning on PORT ${PORT}`));
