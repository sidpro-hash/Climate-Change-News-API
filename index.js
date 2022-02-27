const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();


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
    res.json('Welcome to Climant Change News API');
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
app.listen(PORT,() => console.log(`server rnpmunning on PORT ${PORT}`));