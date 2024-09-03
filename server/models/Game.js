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
    squares: [{type: Schema.Types.ObjectId, ref: 'Square'}],
    ready:{
        type: Boolean,
        default: false
    }
})

gameSchema.methods.toggleReady = function () {
    if (this.ready === false){
        this.ready = true
    }else{
        this.ready = false
    }
    
    this.save()
    return this.ready
  };

const Game = model('Game', gameSchema)

module.exports = Game