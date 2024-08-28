import {gql} from '@apollo/client'

export const ME = gql`
    query Me {
        me {
            _id
            username
            games {
                _id
                title
                users {
                    username
                }
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