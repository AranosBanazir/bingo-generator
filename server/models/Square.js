const {Schema, model} = require('mongoose')


const squareSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})


const Square = model('Square', squareSchema)

module.exports = Square