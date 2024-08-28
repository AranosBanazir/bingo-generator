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
    }

    type Card{
        _id: ID!
        squares: [Square]
        completed: Boolean
        owner: ID!
    }

    type Square{
        _id: ID!
        content: String!
        position: String!
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
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        delUser(password: String!): User

        addFriend(username: String!): User
        removeFriend(username: String!): User
        rejectFriendInvite(username: String!): User

        gameInvite(gameId: ID!, username: String!): Game
        acceptGameInvite(gameId: ID!): Game
        rejectGameInvite(gameId: ID!): Game

        createCard(gameId: ID!): Card

        addSquare(content: String!, gameId: ID!): Square
        deleteSquare(_id: ID!): Square
    }
`


module.exports = typeDefs