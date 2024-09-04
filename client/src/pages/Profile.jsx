import { useMutation, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { ME } from "../../utils/queries";
import { ADD_FRIEND } from "../../utils/mutations";
import { useState } from "react";

const ProfilePage = () => {
  const { loading, error, data } = useQuery(ME);
  const userData = data?.me;
  const [addFriend] = useMutation(ADD_FRIEND);
  const [friendUsername, setFriendUsername] = useState(null);

  //TODO make the friends list/invites look nice and allow for interaction of accept/deny

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const friendInput = document.getElementById("addFriendInput");
    if (!friendUsername) return;
    friendInput.value = "";
    await addFriend({
      variables: {
        username: friendUsername,
      },
      refetchQueries: [ME, "Me"],
    });
  };

  console.log("game invites", userData?.gameInvites);

  return (
    <main className="grid grid-cols-3 h-[100vh] mx-32">
      {loading ? (
        <>
          <h1>replace with spinner...</h1>
        </>
      ) : (
        <>
        {/* Start of the first grid section */}
          <div className="flex flex-col mt-10 gap-2">
            <h2 className="text-3xl">Update Account Info</h2>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input type="text" className="grow" placeholder="Email" />
            </label>
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
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input type="password" className="grow" />
            </label>
            <button className="btn btn-primary">Update Info</button>
          </div>

          <div>{/* This is to space out the grid */}</div>

          {/* Start of third grid space */}
          <div className="mt-10">
            <form className="flex flex-col gap-3" onSubmit={handleAddFriend}>
              <h2 className="text-3xl">Add a friend</h2>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  id="addFriendInput"
                  type="text"
                  className="grow"
                  placeholder="Username"
                  onChange={(e) => setFriendUsername(e.target.value)}
                />
                <button>
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
                </button>
              </label>
            </form>

            <div className="flex flex-row justify-between mt-10">
              <section id="friends-section">
                <h2 className="self-center text-2xl">Friends List:</h2>
                <ul className="ml-10">
                  {userData?.friends.map((friend) => {
                    return (
                      <li
                        key={friend._id}
                        className="flex flex-row items-center my-2 text-xl justify-between"
                      >
                        {friend.username}
                        <button className="bg-error w-[25px] h-[25px] text-black font-bold mx-2">
                          &#935;
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section id="friend-invite-section">
                <h2 className="self-center text-2xl">Friend Invites:</h2>
                <ul className="ml-10">
                  {userData?.friendInvites.map((friend) => {
                    return (
                      <li
                        key={friend._id}
                        className="flex flex-row justify-between items-center my-2 text-xl"
                      >
                        {friend.username}
                        <div>
                          <button className="bg-success w-[25px] h-[25px] text-black font-bold mx-2">
                            &#10004;
                          </button>
                          <button className="bg-error w-[25px] h-[25px] text-black font-bold mx-2">
                            &#935;
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

            </div>
            {userData?.gameInvites?.length > 0 ? 
            <section className="mt-10">
              <h2 className="text-3xl mb-3">Game invites</h2>
              <div className="grid grid-cols-2 gap-3">
              {userData?.gameInvites.map(game=>{
                return (
                  <>
                  <div className="flex flex-col justify-center bg-base-100 shadow-xl bordered px-4 pb-4">
                  <div className="card-body ">
                    <h2 className="text-2xl">{game.title}</h2>
                    <p className="text-lg">
                      {game.ready ? "This game is ready to play!": "This game needs more squares before playing, jump in and add some!"}
                    </p>
                  </div>
                  <button className="btn btn-success mb-4">
                    Accept Invite
                  </button>
                  <button className="btn btn-error">
                    Deny Invite
                  </button>
                </div>
              </>                                   
                )
              })}
              </div>
            </section> 
            :
            <></>
            }

          </div>
        </>
      )}
    </main>
  );
};

export default ProfilePage;
