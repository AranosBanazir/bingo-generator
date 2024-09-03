const typeDefs =`
    
    type User{
        _id: ID!
        username: String!
        email: String!
        password: String!
        friends: [User]
        games: [Game]
        cards: [Card]
        friendInvites: [User]
        gameInvites: [Game]
    }

    type Game{
        _id: ID!
        title: String
        cards: [Card]
        users: [User]
        squares: [Square]
        ready: Boolean
        owner: ID!
    }



    type Card{
        _id: ID!
        squares: [PositionalSquare]
        completed: Boolean
        owner: ID!
        game: ID
    }

    type Square{
        _id: ID!
        content: String!
    }
    
    type PositionalSquare{
        _id: ID!
        content: String!
        position: String!
        completed: Boolean
    }
    
    type Auth {
    token: ID!
    user: User
  }

    type Query{
        me: User
        getGameSquares(gameId: ID!): [Square]
        getUserSquares(userId: ID!): [Square]
        getGames: [Game]
        getGame(gameId: ID!): Game
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        delUser(password: String!): User

        addFriend(username: String!): User
        removeFriend(username: String!): User
        rejectFriendInvite(username: String!): User

        createGame(title: String!): Game
        gameInvite(gameId: ID!, username: String!): Game
        acceptGameInvite(gameId: ID!): Game
        rejectGameInvite(gameId: ID!): Game
        leaveGame(gameId: ID!): Game
        toggleGameReady(gameId: ID!): Game

        createCard(gameId: ID!): Card
        deleteCard(gameId: ID!, cardId: ID!): Card

        addSquare(content: String!, gameId: ID!): Game
        confirmSquare(squareId: ID!, cardId: ID!): PositionalSquare
        deleteSquare(squareId: ID!): Square
    }
`


module.exports = typeDefs