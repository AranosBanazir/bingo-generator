const {Schema, model} = require('mongoose')


const squareSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true
    }
})


const Square = model('Square', squareSchema)

module.exports = Square