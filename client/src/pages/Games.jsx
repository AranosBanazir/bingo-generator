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
        }, refetchQueries: [ME, 'Me']}).then(({data})=>{
            console.log(data)
        })
    } catch (error) {
        
    }

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
                <button className="btn btn-success">
                    Submit game
                </button>
            </form>
          </div>

          <div className="flex flex-row justify-center items-center gap-6 mt-10">
            {userData.games.map((game) => {
              return (
                <div
                  className="card card-compact bg-base-100 w-96 shadow-xl"
                  key={game._id}
                  onClick={handleBingoClick}
                >
                  <figure>
                    <img
                      src="/assets/bingo-placeholder.png"
                      alt="Bingo Placeholder"
                      data-id={game._id}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title self-center">{game.title}</h2>
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
