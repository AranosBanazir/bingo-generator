import {gql} from '@apollo/client'

export const ME = gql`
    query Me {
        me {
            _id
            username
            games {
                _id
                title
                owner
            }
            gameInvites {
                title
                ready
            }
            friends {
                username
                _id
            }
            cards {
                completed
                _id
                game
                squares {
                    content
                    position
                    completed
                    _id
                }
            }
            friendInvites {
                username
                _id
            }
        }
    }
`


export const GET_GAME = gql`
    query GetGame($gameId: ID!) {
        getGame(gameId: $gameId) {
            title
            users {
                _id
                username
            }
            cards {
                _id  
            }
            squares{
                _id
                content
            }
            ready
            owner
        }
    }

`