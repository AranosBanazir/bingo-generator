import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ME } from "../../utils/queries";

const ProfilePage = () => {
  const { loading, error, data } = useQuery(ME);
  const userData = data?.me;
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`${path}`);
  };

  return (
    <main className="flex flex-row mx-auto">
      {loading ? (
        <>
          <h1>replace with spinner...</h1>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            onClick={() => handleNavigate("/games")}
          >
            My Games
          </button>

          <section className="flex flex-col gap-3">
            <h2>Add a friend</h2>
            <label className="input input-bordered flex items-center gap-2">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input type="text" className="grow" placeholder="Username" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </section>
        </>
      )}
    </main>
  );
};

export default ProfilePage;
