import { useQuery, useMutation} from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ME } from "../../utils/queries";
import { CREATE_GAME } from "../../utils/mutations";
import { useState } from "react";

const GamesPage = () => {
  const { loading, error, data } = useQuery(ME);
  const [createGame, {loading: gameLoading, error: gameError, data: gameData}] = useMutation(CREATE_GAME)
  const userData = data?.me;
  const [newGameTitle, setNewGameTitle] = useState(null);

  const navigate = useNavigate();

  const handleBingoClick = (e) => {
    const { id } = e.target.dataset;
    console.log(e.target)
    if (!id) return;
    navigate(`/card/${id}`);
  };


  const handleNewGameTitle = (e) =>{
     setNewGameTitle(e.target.value)
  }

  const handleNewGameSubmit = async (e) =>{
    e.preventDefault()

    try {
        await createGame({variables: {
            title: newGameTitle
        }, refetchQueries: [ME, 'Me']})
    } catch (error) {
        
    }

  }
  
  const ownedGames = []
  if (userData?.games){
    for (const game of userData?.games){
      if (userData?._id === game?.owner){
        ownedGames.push(game?._id)
      }
    }
  }

  const handleManagementNavigate = (e) =>{
    e.stopPropagation()
    const { id } = e.target.dataset;
    navigate(`/manage/${id}`)
  }


  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <main className="flex flex-col mx-auto">
          <h1 className="text-8xl self-center mt-10">My Games</h1>
          <section className="flex flex-row mx-auto mt-5">
            <button className="btn btn-primary">Create new game</button>
          </section>

          <div className="mx-auto mt-5">
            <form action="" className="form gap-4 flex flex-col" onSubmit={handleNewGameSubmit}>
              <label className="input input-bordered flex items-center gap-2">
                Game Title:
                <input type="text" className="grow" placeholder="Daisy" onChange={handleNewGameTitle}/>
              </label>
                <button className="btn btn-secondary">
                    Submit game
                </button>
            </form>
          </div>

          <div className="flex flex-row justify-center items-center gap-6 mt-10">
            {userData.games.map((game) => {
              return (
                <div
                  className="card card-compact bg-base-100 w-96 shadow-xl min-h-[200px]"
                  key={game._id}

                >
                  {/* <figure>
                    <img
                      src="/assets/bingo-placeholder.png"
                      alt="Bingo Placeholder"
                      data-id={game._id}
                    />
                  </figure> */}
                  <div className="card-body"                   
                    onClick={handleBingoClick}
                    data-id={game._id}>
                    <h2 className="card-title self-center">{game.title}</h2>
                    {ownedGames.includes(game._id) ? <button className="btn btn-secondary" onClick={handleManagementNavigate} data-id={game._id}>Manage</button>: <></>}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </>
  );
};

export default GamesPage;
