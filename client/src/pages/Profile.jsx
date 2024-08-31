import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ME } from "../../utils/queries";

const ProfilePage = () => {
    const {loading, error, data} = useQuery(ME)
    const userData = data?.me
    const navigate = useNavigate()

    const handleNavigate = (path) =>{
        navigate(`${path}`)
    }


  return (
    <main className="flex flex-row mx-auto">
      {loading ? (
        <>
          <h1>replace with spinner...</h1>
        </>
      ) : (
        <>
        <button className="btn btn-primary" onClick={()=>handleNavigate('/games')}>
            My Games
        </button>
        </>
      )}
    </main>
  );
};

export default ProfilePage;
