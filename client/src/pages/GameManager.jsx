import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation} from "@apollo/client";
import { GET_GAME, ME } from "../../utils/queries";


const GameManager = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const {loading: meLoading, error: meError, data: meData} = useQuery(ME)
  const userData = meData?.me
  let { data: gameData, loading: gameLoading } = useQuery(GET_GAME, { variables: { gameId }});

    //return if loading
    if (meLoading || gameLoading) return <>Loading...</>

  return (
    <>
    
    </>
  )
}


export default GameManager