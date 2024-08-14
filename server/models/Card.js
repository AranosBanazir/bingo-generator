const {Schema, model} = require('mongoose')






const cardSchema = new Schema({
    squares: [{type: Schema.Types.ObjectId, ref: 'Square'}],
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