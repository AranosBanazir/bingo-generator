const {Game, Square, Card, User} = require('../models')
const {signToken, AuthenticationError} = require('../utils/auth')
const { GraphQLError } = require('graphql');

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
                let usedSquareIds = []    //tracks used squares to remove dupes
                let allSquares = squares //so we can remove used squares from options...I 100% thought of this the first time and never timed out a request...
                //gets a random squares content
                //cards don't need to track Owner or ID from the square, just the content
                const getRandomSquare = () =>{
                    const rndIndex = Math.floor(Math.random() * allSquares.length)
                    const chosenSquare = allSquares[rndIndex]
                     allSquares.splice(rndIndex, 1)
                     return chosenSquare
                }
                
                
                //loops through all the games squares until it builds a full card of 24 spaces
                
                
                while (newCardSquares.length < 24) {
                    const nextSquare = getRandomSquare()
                    if (!usedSquareIds.includes(nextSquare._id)){
                        newCardSquares.push({content: nextSquare.content, position:positions[0]})
                        usedSquareIds.push(nextSquare._id)
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
        submitCard: async (parent, {cardId}, context) =>{
            if (context.user){
              const validWins = [
                //horizontal wins
                ["a1", "a2", "a3", "a4", "a5"],
                ["b1", "b2", "b3", "b4", "b5"],
                ["c1", "c2", "c4", "c5"],
                ["d1", "d2", "d3", "d4", "d5"],
                ["e1", "e2", "e3", "e4", "e5"],

                //diagonal wins
                ["e1", "d2", "b4", "a5"],
                ["a1", "b2", "d4", "e5"],

                //vertical wins
                ["a1", "b1", "c1", "d1", "e1"],
                ["a2", "b2", "c2", "d2", "e2"],
                ["a3", "b3", "d3", "e3"],
                ["a4", "b4", "c4", "d4", "e4"],
                ["a5", "b5", "c5", "d5", "e5"],
              ]

              const card = await Card.findById(cardId).populate('squares')

              //returns an array of completed squares
              const checkedSquares = card.squares
                                         .filter(square=> square.completed)
                                         .map(square=>square.position)
              
              let winningCard = false                                         
              validWins.forEach(winCondition=>{
                  let winningPositionCount = 0
                for (const position of winCondition){
                        if (checkedSquares.includes(position)){
                            winningPositionCount += 1
                        }
                        if (winningPositionCount === winCondition.length){
                            winningCard = true
                            break 
                        }
                    
                }
              })
              
              card.completed = winningCard
              card.save()

              return card

            }
            throw AuthenticationError
        },
        deleteCard: async (parent, {gameId, cardId}, context) =>{
            if (context.user){
                const card = await Card.findByIdAndDelete(cardId)
                const currentUser = await User.findByIdAndUpdate(context.user._id, {
                    $pull: {cards: cardId}
                })
                const game = await Game.findByIdAndUpdate(gameId, {
                    $pull: {cards: cardId}
                })



                return card
            }
            throw AuthenticationError
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
        deleteSquare: async (parent, {squareId}, context) =>{
            if (context.user){
                return await Square.findByIdAndDelete(squareId)
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
                const currentUser = await User.findById(context.user._id).populate('friends')
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
                

                let friends = false //setting the default before checking if already friends

                for (const friend of currentUser.friends){
                    if (friend.username === username){
                        friends = true
                    }
                }

                //send the friend invite
                if (!friends){
                    const updatedPotentialFriend = await User.findOneAndUpdate({username}, {
                        $addToSet: {friendInvites: currentUser._id},
                    })
                    return updatedPotentialFriend
                }
                
                return new GraphQLError('You are already friends with that user.')
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