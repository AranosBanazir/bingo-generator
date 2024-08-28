const {Schema, model} = require('mongoose')



const gameSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    squares: [{type: Schema.Types.ObjectId, ref: 'Square'}]
})


const Game = model('Game', gameSchema)

module.exports = Game