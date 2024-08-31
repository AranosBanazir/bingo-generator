import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom/dist'
import './index.css'


import App from './App.jsx'
import LoginPage from './pages/Login.jsx'
import ProfilePage from './pages/Profile.jsx'
import SingleCardPage from './pages/SingleCard.jsx'
import GamesPage from './pages/Games.jsx'

//TODO: need to expand the router to work with new pages
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    error: <Error />,
    children: [
     {
      index: true,
      element: <LoginPage/>
     },
     {
      path: '/profile',
      element: <ProfilePage/>
     },
     {
      path: '/card/:gameId',
      element: <SingleCardPage/>
     },
     {
      path: '/games',
      element: <GamesPage/>
     }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
