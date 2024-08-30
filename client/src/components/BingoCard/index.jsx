import { useMutation } from "@apollo/client"
import { CONFIRM_SQUARE } from "../../../utils/mutations"
import { ME } from "../../../utils/queries"

const BingoCard = ({card, hideMarks}) =>{
    const [confirmSquare] = useMutation(CONFIRM_SQUARE)


    // if (!card.squares) return <>Loading...</>

    const handleConfirmSquare = async (e) =>{
        e.preventDefault()
        const {squareid: squareId} = e.target.dataset
        const targetSquare = document.getElementById(squareId)
        targetSquare.parentNode.classList.toggle('square')
        targetSquare.parentNode.classList.toggle('square-completed')

        try{
            confirmSquare({
                variables:{
                    squareId,
                    cardId: card._id
                }, refetchQueries: [ME, 'Me']
            }).then(({data})=>{

            })
        }catch(err){
            console.err(err)
        }
    }

    return (
        <>
        <div className="grid grid-rows-5 grid-cols-5 mt-10 max-h-[770px] max-w-[750px] mx-auto bingo-card" key={card._id}>
            {card?.squares?.map(square=>{
               return square.position === 'c2' ? (
                <>
                {square.completed && !hideMarks ? 
                    <div key={square._id} className="square-completed min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] text-center justify-center" data-pos={square.position}>
                        <p className="square-content" onClick={handleConfirmSquare} data-squareid={square._id} id={square._id}>
                            {square.content}
                        </p>
                    </div> 
                    :                 
                    <div key={square._id} className="square min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] text-center justify-center" data-pos={square.position}>
                        <p className="square-content" onClick={handleConfirmSquare} data-squareid={square._id} id={square._id}>
                            {square.content}
                        </p>
                    </div>
                    }

                    <div key={'free'} className="freespace min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] text-center justify-center">
                        <p className="min-h-full text-center justify-center overflow-auto" >
                        </p>
                    </div>
                    </>
                ) : (
                    <>
                    {square.completed && !hideMarks ?  ( 
                    <>
                        <div key={square._id} className="square-completed min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px]">
                            <p className="square-content" onClick={handleConfirmSquare} data-squareid={square._id} id={square._id}>
                                {square.content}
                            </p>
                        </div>
                    </>
                    ) : (
                        <>
                        <div key={square._id} className="square min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px]">
                            <p className="square-content" onClick={handleConfirmSquare} data-squareid={square._id} id={square._id}>
                                {square.content}
                            </p>
                        </div>
                        </>
                    )}
                    </>
                    

                    
                )
            })}
        </div>
        </>
    )
}


export default BingoCard