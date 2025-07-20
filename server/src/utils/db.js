const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('error connecting to MongoDB:', error.message)
})

module.exports = mongoose