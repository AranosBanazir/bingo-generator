const {Schema, model} = require('mongoose')



const gameSchema = new Schema({
    title:{
        type: String,
        unique: true,
        required: true,
    },
    cards: {
        type: Schema.Types.ObjectId, 
        ref: 'Card'
    },
    
})