import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils/mutations";
import { useEffect, useState } from "react";


const LoginPage = () => {
  const [login, { error, loading, data }] = useMutation(LOGIN);
  const [formState, setFormState] = useState({})



  const handleFormSubmit = async (e) => {
    e.preventDefault();


    try {
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // Clear form values
    setFormState({
      username: '',
      password: '',
    });
  };

  const handleChange = async (e) =>{
    const {name, value} = e.target
    setFormState({
        ...formState,
        [name]: value
    })
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <form className="gap-3 flex flex-col min-w-[25vw]" onSubmit={handleFormSubmit}>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" name="username" className="grow" placeholder="Username" onChange={handleChange} required/>
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
            <input name="password" type="password" className="grow" onChange={handleChange} required/>
          </label>
          <button onSubmit={handleFormSubmit} className="btn btn-success max-w-[20vw]">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
