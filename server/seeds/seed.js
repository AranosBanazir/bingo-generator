const db = require('../config/connection');
const { Square, Game, User, Card} = require('../models');
const userSeeds = require('./userSeeds.json')
const gameSeeds = require('./gameSeeds.json')
// const cardSeeds = require('./cardSeeds.json')
const squareSeeds = require('./squareSeeds.json')


db.once('open', async () => {
  try {
    //Clearing the DB
    await Square.deleteMany()
    await Card.deleteMany()
    await Game.deleteMany()
    await User.deleteMany()

    //Populating the DB

    //creates users
    const users = await User.create(userSeeds)
    //creates the squares

    //picks a ranodm user index
    const rndUser = () => Math.floor(Math.random() * users.length)

    let squares = []
    //loops through the squares to apply an owner
    for (const square of squareSeeds){
      const newSquare = await Square.create({...square, owner: users[rndUser()]._id})
      squares.push(newSquare)
    }
    
    //creates a game with users and squares
   for (const game of gameSeeds){
    const newGame = await Game.create({
        ...game,
        owner: users[rndUser()]._id,
        users: [users[0]._id, users[1]._id, users[2]._id],
        squares: squares
     })
     const user1 = await User.findByIdAndUpdate(users[0]._id,{
        $addToSet: {games: newGame._id}
     })
     const user2 = await User.findByIdAndUpdate(users[1]._id,{
      $addToSet: {games: newGame._id}
   })
    const user3 = await User.findByIdAndUpdate(users[2]._id,{
      $addToSet: {games: newGame._id}
  })
   }




    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
