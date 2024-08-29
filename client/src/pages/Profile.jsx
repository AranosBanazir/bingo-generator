import { useQuery } from "@apollo/client";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { ME } from "../../utils/queries";

const ProfilePage = () => {
    const {loading, error, data} = useQuery(ME)
    const userData = data?.me
    const navigate = useNavigate()


    const handleBingoClick = (e) =>{
        const {id} = e.target.dataset
        if (!id) return
        navigate(`/card/${id}`)

    }

  return (
    <main className="flex flex-row mx-auto">
      {loading ? (
        <>
          <h1>replace with spinner...</h1>
        </>
      ) : (
        <div className="flex flex-row justify-center items-center gap-6">
          {userData.games.map((game) => {
            return (
              <div className="card card-compact bg-base-100 w-96 shadow-xl" key={game._id} onClick={handleBingoClick}>
                <figure>
                  <img
                    src="/assets/bingo-placeholder.png"
                    alt="Bingo Placeholder"
                    data-id={game._id}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{game.title}</h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
