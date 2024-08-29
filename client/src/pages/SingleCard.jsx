import { useParams, useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"
import { useContext, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_GAME } from "../../utils/queries"

const SingleCardPage = () =>{
    const navigate = useNavigate()
    const {gameId} = useParams()
    const { userData } = useContext(UserContext);
    let {data: gameData} = useQuery(GET_GAME, {variables:{gameId}})
    let hasACard = false
    const userCards = userData?.cards ? userData?.cards : []

    gameData = gameData?.getGame ? gameData.getGame : {}
    
    for (const card of userCards){
        if (gameData.includes(card._id)){
            hasACard = true
        }
    }
    


    return (
        <main className="container">
            {!hasACard ? <>no card</> : <>has a card</>}

        </main>
    )
}


export default SingleCardPage