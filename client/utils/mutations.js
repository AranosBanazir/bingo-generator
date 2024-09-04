import {gql} from '@apollo/client'


export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`


export const ADD_FRIEND = gql`
    mutation AddFriend($username: String!) {
        addFriend(username: $username) {
            username
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
                _id
            }
        }
    }
`


export const SUBMIT_CARD = gql`
    mutation SubmitCard($cardId: ID!) {
        submitCard(cardId: $cardId) {
            completed
        }
    }
`


export const DELETE_CARD = gql`
    mutation DeleteCard($gameId: ID!, $cardId: ID!) {
        deleteCard(gameId: $gameId, cardId: $cardId) {
            _id  
        }
    }
`

export const DELETE_SQUARE = gql`
    mutation DeleteSquare($squareId: ID!) {
        deleteSquare(squareId: $squareId) {
            _id  
        }
    }
`


export const CONFIRM_SQUARE = gql`
    mutation ConfirmSquare($squareId: ID!, $cardId: ID!) {
        confirmSquare(squareId: $squareId, cardId: $cardId) {
            completed
            _id
        }
    }
`


export const CREATE_GAME = gql`
    mutation CreateGame($title: String!) {
        createGame(title: $title) {
            _id
            title
        }
    }
`

export const ADD_SQUARE = gql`
    mutation AddSquare($content: String!, $gameId: ID!) {
        addSquare(content: $content, gameId: $gameId) {
            _id
            squares {
            _id
            content
            }
        }
    }
`

export const TOGGLE_GAME_READY = gql`
    mutation ToggleGameReady($gameId: ID!) {
        toggleGameReady(gameId: $gameId) {
            ready
        }
    }
`