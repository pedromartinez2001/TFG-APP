require('dotenv').config();
const app = require('./app.js')
const connectDB = require('./db.js')

connectDB()
app.listen(3000)
console.log('Server on port', 3000);