import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ME } from "../../../utils/queries"
import { GET_GAME } from "../../../utils/queries"
import { ADD_SQUARE, DELETE_SQUARE } from "../../../utils/mutations"


const SquareAddForm = ({gameId, gameData, gameOwner}) =>{
    const [squareContent, setSquareContent] = useState(null)
    const [clickedSquare, setClickedSquare] = useState(null)
    const [addSquare] = useMutation(ADD_SQUARE)
    const [deleteSquare] = useMutation(DELETE_SQUARE, {
        refetchQueries: [GET_GAME, 'GetGame']
    })
    
    const handleSquareContent = (e) =>{
        setSquareContent(e.target.value)
    }

    const handleSquareSubmit = async (e) =>{
        e.preventDefault()
        const squareText = document.getElementById('squareinput')
        squareText.value = ''
        if (squareContent === '' || !squareContent) return
        try {
            await addSquare({variables:{
                content: squareContent || 'bad square',
                gameId: gameId
            }, refetchQueries: [GET_GAME, 'GetGame']})
            
        } catch (error) {
            console.error(error)
        }
    }
    // console.log(gameData)

    const handleDeleteSquare = async (e) =>{
        try {
            await deleteSquare({
                variables:{
                    squareId: clickedSquare?._id
                }
            })
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div className="self-center mt-20">
            <form className="flex flex-col gap-3" onSubmit={handleSquareSubmit}>
                <textarea name="squareContent" id="squareinput" className="textarea textarea-primary md:w-[30vw] self-center" placeholder="New Square Content" onChange={handleSquareContent}/>
                <button className="btn btn-info w-[20%] self-center">Submit Square</button>
            </form>

            <h2 className="text-3xl mt-5">Current Squares {`(${gameData?.squares?.length || ''})` } :</h2>
        <section className="grid md:grid-cols-5 grid-cols-3 gap-4 mt-5">
            {gameData?.squares?.map(square=>{
              return (
                <>
                {gameOwner ? <div key={square._id} className="square md:min-w-[150px] md:min-h-[150px] md:max-w-[150px] md:max-h-[150px] min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]" 
                    onClick={(e)=>{ 
                        e.preventDefault(); 
                        document.getElementById('deleteModal').showModal()
                        setClickedSquare({
                            _id: e.target.id,
                            content: e.target.textContent
                        })
                        }
                    }>
                    <p className="square-content" data-squareid={square._id} id={square._id}>
                        {square.content}
                    </p>
                </div> 
                :
                <div key={square._id} className="square md:min-w-[150px] md:min-h-[150px] md:max-w-[150px] md:max-h-[150px] min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]" >
                    <p className="square-content" data-squareid={square._id} id={square._id}>
                        {square.content}
                    </p>
                </div>
                }
                </>
              )
            })}
        </section>
                    <dialog id="deleteModal" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <h3 className="font-bold text-lg">Are you sure you want to delete this square?</h3>
                        <p className="py-4">Square Text: "{clickedSquare?.content}"</p>
                        <button className="btn btn-warning" onClick={handleDeleteSquare}>I am sure!</button>
                        </form>
                      </div>
                    </dialog>
        </div>
    )
}


export default SquareAddForm