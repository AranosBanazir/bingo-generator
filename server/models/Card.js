const {Schema, model} = require('mongoose')

const positionalSquareSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    completed:{
        type: Boolean,
        default: false
    }
})




const cardSchema = new Schema({
    squares: [positionalSquareSchema],
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


const Card = model('Card', cardSchema)


module.exports = Card