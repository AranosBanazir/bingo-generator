const typeDefs =`
    
    type User{
        _id: ID!
        name: String!
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
    
    type Auth{
        _id
        token
    }

    type Query{
        me: User
        getGameSquares(gameId: ID!): [Square]
        getUserSquares(userId: ID!): [Square]
    }

    type Mutations{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        delUser(password: String!): User

        addSquare(content: String!): Square
        deleteSquare(_id: ID!): Square
    }
`


module.exports = typeDefs