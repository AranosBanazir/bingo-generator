import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ME } from "../../../utils/queries"
import { GET_GAME } from "../../../utils/queries"
import { ADD_SQUARE } from "../../../utils/mutations"


const SquareAddForm = ({gameId, gameData}) =>{
    const [squareContent, setSquareContent] = useState(null)
    const [addSquare] = useMutation(ADD_SQUARE)
    
    const handleSquareContent = (e) =>{
        setSquareContent(e.target.value)
    }

    const handleSquareSubmit = async (e) =>{
        e.preventDefault()
        try {
            await addSquare({variables:{
                content: squareContent || 'bad square',
                gameId: gameId
            }, refetchQueries: [GET_GAME, 'getGame']})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="self-center mt-20">
            <form className="flex flex-col gap-3" onSubmit={handleSquareSubmit}>
                <textarea name="squareContent" className="textarea textarea-primary min-w-[30vw]" placeholder="New Square Content" onChange={handleSquareContent}/>
                <button className="btn btn-info w-[50%] self-end">Submit Square</button>
            </form>

        <section className="grid grid-cols-5">
            {/* Map through the squares in a nice section to show current squares */}
        </section>



        </div>
    )
}


export default SquareAddForm