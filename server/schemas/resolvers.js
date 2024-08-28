const {Game, Square, Card, User} = require('../models')
const {signToken, AuthenticationError} = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) =>{
            if (context.user){
                const user = await User.findById(context.user._id)
                return user
            }
            
            throw AuthenticationError
        },
        getGames: async () =>{
            const games = await Game.find()
            return games
        }
    },
    Mutation:{
        login: async (parent, {username, password}) =>{
            const user = await User.findOne({username})
            if (!user){
                throw AuthenticationError
            }
            
            const correctPW = await user.isCorrectPassword(password)

            if (!correctPW){
                throw AuthenticationError
            }

            const token = signToken(user)

            return {token, user}
        },
        createCard: async (parent, {gameId}, context) =>{
            if (context.user){
                const user = await User.findById(context.user._id)
                const game = await Game.findById(gameId).populate('squares')

                if (!game){
                    return null
                }

                let positions = [
                    "a1", "a2", "a3", "a4", "a5",
                    "b1", "b2", "b3", "b4", "b5",
                    "c1", "c2", "c4", "c5", //c3 is our free space so its missing from the array
                    "d1", "d2", "d3", "d4", "d5",
                    "e1", "e2", "e3", "e4", "e5",
                   
                ]
                const squares = game.squares
                
                let newCardSquares = [] //holds squares and positions
                let usedSquares = []    //tracks used squares to remove dupes

                //gets a random squares content
                //cards don't need to track Owner or ID from the square, just the content
                const getRandomSquare = () =>{
                    const rndIndex = Math.floor(Math.random() * squares.length)
                    return squares[rndIndex].content
                }

               
                //loops through all the games squares until it builds a full card of 24 spaces

                while (newCardSquares.length < 24) {
                    const nextSquare = getRandomSquare()
                    if (!usedSquares.includes(nextSquare)){
                        newCardSquares.push({content: nextSquare, position:positions[0]})
                        usedSquares.push(nextSquare)
                        positions.shift()
                    }
                }

                const newCard = await Card.create({
                    squares: newCardSquares,
                    owner: context.user._id
                })

                console.log("new Squares: " , newCardSquares)
                return newCard
            }
            throw AuthenticationError
        }
    }
}

module.exports = resolvers