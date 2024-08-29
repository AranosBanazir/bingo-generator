import { useMutation } from "@apollo/client"
import { CONFIRM_SQUARE } from "../../../utils/mutations"


const BingoCard = ({card}) =>{
    const [confirmSquare, {loading, error, data}] = useMutation(CONFIRM_SQUARE)


    if (!card.squares) return <>Loading...</>

    const handleConfirmSquare = async (e) =>{
        e.preventDefault()
        const {squareid: squareId} = e.target.dataset
        console.log(e.target.dataset)
        try{
            confirmSquare({
                variables:{
                    squareId,
                    cardId: card._id
                }
            }).then(res=>{
                console.log(res.json())
            })
        }catch(err){
            console.err(err)
        }
    }

    return (
        <>
        <div className="grid grid-rows-5 grid-cols-5 mt-10 max-h-[770px] max-w-[750px] mx-auto ">
            {card?.squares.map(square=>{
                
               return square.position === 'c2' ? (
                <>
                    <div    key={square._id} className="square min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] text-center justify-center" data-pos={square.position}>
                        <p className="square-content" onClick={handleConfirmSquare} data-squareId={square._id}>
                            {square.completed ?  <svg 
                                className="checkmark" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 52 52"> 
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> 
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                </svg>: <></>
                            }
                            {square.content}
                        </p>
                    </div>

                    <div key={'free'} className="freespace min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] text-center justify-center">
                        <p className="min-h-full text-center justify-center overflow-auto" >
                        </p>
                    </div>
                    </>
                ) : (
                    
                    <div key={square._id} className="square min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px]">
                        <p className="square-content text-center justify-center  text-wrap" onClick={handleConfirmSquare} data-squareId={square._id}>
                        {square.completed ?  <svg 
                            className="checkmark" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 52 52"> 
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> 
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>: <></>
                        }
                            {square.content}
                        </p>
                    </div>
                    
                )
            })}
        </div>
        </>
    )
}


export default BingoCard