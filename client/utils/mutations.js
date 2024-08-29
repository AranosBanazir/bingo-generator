import {gql} from '@apollo/client'


export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`

export const CREATE_CARD = gql`
    mutation CreateCard($gameId: ID!) {
        createCard(gameId: $gameId) {
            _id
            completed
            squares {
                position
                content
            }
        }
    }
`

export const CONFIRM_SQUARE = gql`
    mutation ConfirmSquare($squareId: ID!, $cardId: ID!) {
        confirmSquare(squareId: $squareId, cardId: $cardId) {
            completed
        }
    }
`