const {Game, Square, Card, User} = require('../models')
const {signToken, AuthenticationError} = require('../utils/auth')
const { GraphQLError, graphql } = require('graphql');

const resolvers = {
    Query: {
        me: async (parent, args, context) =>{
            if (context.user){
                const user = await User.findById(context.user._id)
                                       .populate('friends')
                                       .populate('games')
                                       .populate('cards')
                                       .populate('gameInvites')
                                       .populate('friendInvites')
                   
                return user
            }
            
            throw AuthenticationError
        },
        getGames: async () =>{
            const games = await Game.find()
            return games
        },
        getGame: async (parent, {gameId}, context) =>{
            if (context.user){
                const game = await Game.findById(gameId).populate('squares').populate('users')
                return game
            }

            throw AuthenticationError
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

                if (!game.ready){
                    return new GraphQLError('This game is not ready yet!')
                }
                
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
        },
        addSquare: async (parent, {gameId, content}, context)=>{
            if (context.user){

                const game = await Game.findById(gameId)

                if (game.ready === true){
                    return new GraphQLError('Game has already started!')
                }
       
                const newSquare = await Square.create({
                    content,
                    owner: context.user._id

                })

                const updatedGame = await Game.findByIdAndUpdate(gameId, {
                    $addToSet: {squares: newSquare._id}
                },{
                    new: true
                }).populate('squares')

                return updatedGame
            }
            throw AuthenticationError
        },
        confirmSquare: async (parents, { cardId , squareId}, context)=>{
            //this is a toggle that will set a square to false if already true
            if (context.user){
                const card = await Card.findById(cardId).populate('squares')

                const {squares} = card
                let chosenSquare;
                for (const square of squares){
                    if (square._id == squareId){
                        if (!square.completed){
                            square.completed = true
                            chosenSquare = square
                        }else{
                            square.completed = false
                            chosenSquare = square
                        }
                    }
                }

                const updatedCard = await Card.findByIdAndUpdate(cardId, {squares})

                return chosenSquare
            }
            throw AuthenticationError
        },
        addFriend: async (parent, {username}, context) =>{
            if (context.user){
                const currentUser = await User.findById(context.user._id)
                const potentialFriend = await User.findOne({username})

                //erroring on no username found
                if (!potentialFriend){
                    throw new GraphQLError(`No user found with username: ${username}`)
                }

                //check if the potentialFriend's id is already in the users friend invites before sending
                if (currentUser.friendInvites.includes(potentialFriend._id)){
                    const updateCurrentUser = await User.findByIdAndUpdate(context.user._id, {
                        $addToSet: {friends: potentialFriend._id},
                        $pull: {friendInvites: potentialFriend._id}
                    })

                    const updatedPotentialFriendStatus = await User.findByIdAndUpdate(potentialFriend._id, {
                        $addToSet: {friends: currentUser._id},
                        $pull: {friendInvites: currentUser._id}
                    })

                    return updatedPotentialFriendStatus
                }
                

                //send the friend invite
                const updatedPotentialFriend = await User.findOneAndUpdate({username}, {
                    $addToSet: {friendInvites: currentUser._id},
                })
                
                return updatedPotentialFriend
            }
            throw AuthenticationError
        },
        rejectFriendInvite: async (parent, {username}, context) =>{
            if (context.user){
                const rejectedFriend = await User.findOne({username})

                if (!rejectedFriend){
                    throw new GraphQLError(`User: ${username}, is either incorrect or no longer exists.`)
                }
                const currentUser = await User.findByIdAndUpdate(context.user._id, {
                    $pull: {friendInvites: rejectedFriend._id}
                })

                return rejectedFriend
            }
            throw AuthenticationError
        },
        removeFriend: async (parent, {username}, context) =>{
            if (context.user){
                const removedFriend = await User.findOne({username})

                if (!removedFriend){
                    throw new GraphQLError(`User: ${username}, is either incorrect or no longer exists.`)
                }

                const currentUser = await User.findByIdAndUpdate(context.user._id, {
                    $pull: {friends: removedFriend._id}
                })

                return removedFriend
            }
            throw AuthenticationError
        },
        createGame: async (parent, {title}, context) =>{
            if (context.user){

               const currentUser = await User.findById(context.user._id)

               const newGame = await Game.create({
                    title,
                    owner: context.user._id,
                    users: [currentUser._id]
                 })

              await User.findByIdAndUpdate(context.user._id, {
                $addToSet: {games: newGame._id}
                })

               return newGame
            }
            throw AuthenticationError
        },
        gameInvite: async (parents, {gameId, username}, context) =>{
            if (context.user){
                const game = await Game.findById(gameId)

              
                //Validating the game owner is inviting
                if (game.owner == context.user._id){
                    //send the invite
                    const invitedUser = await User.findOneAndUpdate({username},{
                        $addToSet: {gameInvites: gameId}
                    })

                    return game
                }else{
                    throw new GraphQLError(`Sorry! You are not the owner of: ${game.title}`)
                }
            }

            throw AuthenticationError
        },
        acceptGameInvite: async (parent, {gameId}, context) =>{
            if (context.user){
                const currentUser = await User.findByIdAndUpdate(context.user._id, {
                    $pull: {gameInvites: gameId},
                    $addToSet: {games: gameId}
                })

                const game = await Game.findByIdAndUpdate(gameId, {
                    $addToSet: {users: context.user._id}
                })
                
                return game
            }   
            throw AuthenticationError
        },
        rejectGameInvite: async (parent, {gameId}, context) =>{
            if (context.user){
                const currentUser = await User.findByIdAndUpdate(context.user._id,{
                    $pull: {gameInvites: gameId}
                })

                const game = await Game.findById(gameId)

                return game
            }
            throw AuthenticationError
        },
        leaveGame: async(parent, {gameId}, context) =>{
            if (context.user){
                const currentUser = await User.findByIdAndUpdate(context.user._id, {
                    $pull: {games: gameId}
                })
                const game = await Game.findByIdAndUpdate(gameId, {
                    $pull: {users: currentUser._id}
                })
            
                return game
            }
            throw AuthenticationError
        },
        toggleGameReady: async (parent, {gameId}, context)=>{
            if (context.user){
                const game = await Game.findById(gameId)
                game.toggleReady()

                return game
            }
            throw AuthenticationError
        }
    }
}

module.exports = resolvers