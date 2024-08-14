const {Schema, model} = require('mongoose')


const Square = new Schema({
    content:{
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true
    }
})





const cardSchema = new Schema({
    squares: [Square],
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})