import { useEffect, useState } from 'react'
import UserContext from './UserContext'
import { useMutation, useQuery } from '@apollo/client'
import {ME} from '../../utils/queries'

const UserContextProvider = ({children}) => {
    const {loading, error, data} = useQuery(ME)

    const userData = data ? data : {}

    console.log(userData)


    // console.log(data)
    return (
        <UserContext.Provider value={{}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider