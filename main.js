import express from 'express';

import https from 'node:https';

import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));



app.get("/", (req, res)=>{
  res.sendFile(`${__dirname}/index.html`)
})

app.post('/',(req,res)=>{
  const query = req.body.city;
  const units = 'metric';
  const appid = '6036f12754f3237a375b0c8ecc654d7e';
  const icon = '10d';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${appid}`;
  
  https.get(url, (response)=>{
    if(response.statusCode !== 200) {
      res.redirect('/error')
    }
    else{
    response.on('data', (data)=>{
      let weatherData = JSON.parse(data);
      let imageUrl =  `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      res.write("<h1>The temperature of " + query + " is " + weatherData.main.temp + "</h1>");
      res.write(`<img src="${imageUrl}">`);
      res.send();
    })
  }
  })

  app.get('/error', (req,res)=>{
    res.sendFile(`${__dirname}/failed.html`);
  })

})
app.post('/error',(req,res)=>{
  res.redirect('/');
})

app.listen(3000, ()=>{
  console.log("Server is up");
}) 