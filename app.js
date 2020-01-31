const express = require('express')
const morgan = require('morgan')
const MOVIE_DB = require('./small-database');

const app = express()
app.use(morgan('dev'))
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

function validateReq(req, res, next) {
  const stringRegex = new RegExp("^[a-zA-Z]+$");
  const numberRegex = new RegExp("^[0-9]+$");
  const { genre, country, avg_vote} = req.query
  if(genre) {
    if(!stringRegex.test(genre)) {
      return res.status(400).send('Genre must be a string');
    }
  }
  if(country) {
    if(!stringRegex.test(country)) {
      return res.status(400).send('Country must be a string');
    }
  }
  if(avg_vote) {
    if(!numberRegex.test(avg_vote)) {
      return res.status(400).send('Avg_vote must be a number');
    }
  }
  next()
}

function filterResults(query, dataset) {
  let data = dataset
  if(query.genre) {
    data = data.filter(movie => 
      movie.genre.toLowerCase().includes(query.genre.toLowerCase())
    )
  }
  if(query.country) {
    data = data.filter(movie => 
      movie.country.toLowerCase().includes(query.country.toLowerCase()))
  }
  if(query.avg_vote) {
    data = data.filter(movie => 
      Number(movie.avg_vote) >= Number(query.avg_vote)
    )
  }
  return data
}

app.get('/movies', validateReq, (req, res) => {
  const response = MOVIE_DB;
  res.json( filterResults(req.query, response))
})

module.exports = app;