const db = require('../config/connection');
const { Square, Game, User, Card} = require('../models');
const userSeeds = require('./userSeeds.json')
const gameSeeds = require('./gameSeeds.json')
const cardSeeds = require('./cardSeeds.json')



db.once('open', async () => {
  try {
    //Clearing the DB
    await Square.deleteMany()
    await Card.deleteMany()
    await Game.deleteMany()
    await User.deleteMany()

    //Populating the DB
    await Square.create(squareSeeds)
    await Game.create(gameSeeds)
    await User.create(userSeeds)
    await Card.create(cardSeeds)

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
