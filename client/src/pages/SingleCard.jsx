import { useParams, useNavigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import { useQuery, useMutation} from "@apollo/client";
import { GET_GAME, ME } from "../../utils/queries";
import { CREATE_CARD } from "../../utils/mutations";
import BingoCard from "../components/BingoCard";


const SingleCardPage = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState({})
  const { gameId } = useParams();
  const {loading, error, data} = useQuery(ME)
  const userData = data?.me
  let { data: gameData } = useQuery(GET_GAME, { variables: { gameId } });
  const [createCard, {error: cardError, loading: cardLoading, data: cardData}] = useMutation(CREATE_CARD, {
    variables: {gameId}, refetchQueries: [ME, 'me']
  })
  let hasACard = false;
  const userCards = userData?.cards ? userData?.cards : [];

  gameData = gameData?.getGame ? gameData.getGame : [];

  let rightCard




  for (const card of userCards) {
    if (card.game == gameId){
        hasACard = true
        rightCard = card
        break 
    }
  }

  useEffect(()=>{
    setActiveCard(rightCard)
  }, [])

  const generateCard = async () =>{
    let {data} = await createCard()
    data = data?.createCard
    setActiveCard(data)
    
  }





  return (
    <main className="container flex flex-col mx-auto">
        <h1 className="text-6xl font-bold self-center mt-10">{`Game: ${gameData.title}`} </h1>
        {!hasACard ? (
            <div className="flex flex-row justify-center items-center min-h-[70vh]">
                <h2 className="text-4xl">You don't have a card for this game!</h2>
                <button onClick={generateCard} className="btn btn-primary mt-10">Generate Card!</button>
            </div>
        
        ) : (
            <>
            <BingoCard card={activeCard}/>
                <div className="flex flex-row justify-evenly mt-10 mb-20">
                    <button className="btn btn-error max-w-[700px] ">
                        Delete Card
                    </button>
                    <button className="btn btn-success max-w-[700px]">
                        Submit Card
                    </button>
                    
   
 
                </div>
            </>
            
        )
      }
    </main>
  );
};

export default SingleCardPage;
