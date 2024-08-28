const {Game, Square, Card, User} = require('../models')
const {signToken, AuthenticationError} = require('../utils/auth')
const { GraphQLError } = require('graphql');

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
                throw new GraphQLError('Incorrect username.')
            }
            
            const correctPW = await user.isCorrectPassword(password)

            if (!correctPW){
                throw new GraphQLError('Incorrect password.')
            }

            const token = signToken(user)

            return {token, user}
        },
        createCard: async (parent, {gameId}, context) =>{
            if (context.user){
                const user = await User.findById(context.user._id).populate('cards')
                const game = await Game.findById(gameId).populate('squares')

                
                for (const card of user.cards){
                    if (card.game == gameId){
                        return new GraphQLError('You have already created a card for this game.')
                    }
                }

                if (!game){
                    return new GraphQLError(`No Game Found With ID: ${gameId || 0}`)
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
                    owner: context.user._id,
                    game: gameId
                })

                //Adding the card to the user and the game
                const updateUser = await User.findByIdAndUpdate(context.user._id, {
                    $addToSet: {cards: newCard}
                })
                const updateGame = await Game.findByIdAndUpdate(gameId, {
                    $addToSet: {cards: newCard}
                })


                return newCard
            }
            throw new GraphQLError('You must be logged in to create a card.')
        }
    }
}

module.exports = resolvers