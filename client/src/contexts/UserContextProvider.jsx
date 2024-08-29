import { useEffect, useState } from 'react'
import UserContext from './UserContext'
import { useMutation, useQuery } from '@apollo/client'
import {ME} from '../../utils/queries'

const UserContextProvider = ({children}) => {
    const {loading, error, data} = useQuery(ME)

    
    const userData = data ? data?.me : {}

    return (
        <UserContext.Provider value={{userData}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider