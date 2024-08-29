import { useEffect, useState } from 'react'
import UserContext from './UserContext'
import { useMutation, useQuery } from '@apollo/client'
import {ME} from '../../utils/queries'

const UserContextProvider = ({children}) => {
    const {loading, error, data} = useQuery(ME)
    const [userData, setUserData] = useState(null)
    
    useEffect(()=>{
        setUserData(data?.me)
    }, [])

    console.log(userData)
    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider