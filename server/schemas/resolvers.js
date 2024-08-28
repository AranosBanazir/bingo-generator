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
                const game = await Game.findById(gameId)

                const squares = game.squares
                
                let newCardSquares = []

                const getRandomSquare = () =>{
                    const rndIndex = Math.floor(Math.random() * squares.length)
                    return squares[rndIndex]
                }

                console.log(squares.length)

                while (newCardSquares < 23) {
                    const nextSquare = getRandomSquare()
                    if (!newCardSquares.includes(nextSquare)){
                        newCardSquares.push(nextSquare)
                    }
                }

                console.log(newCardSquares)
                return null
            }
            throw AuthenticationError
        }
    }
}

module.exports = resolvers