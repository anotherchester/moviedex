require('dotenv').config()

const app = require('./app');

console.log(process.env.API_TOKEN)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})