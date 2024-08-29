import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate()
  let loading;
  if (!userData?._id) {
    loading = true;
  } else {
    loading = false;
  }


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
