import {gql} from '@apollo/client'

export const ME = gql`
    query Me {
        me {
            _id
            username
            games {
                _id
                title
            }
            gameInvites {
                title
            }
            friends {
                username
                _id
            }
            cards {
                completed
                _id
                squares {
                    content
                    position
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
            }
            cards {
                _id  
            }     
        }
    }

`