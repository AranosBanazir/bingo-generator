import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom/dist'
import './index.css'


import App from './App.jsx'
import LoginPage from './pages/Login.jsx'
import ProfilePage from './pages/Profile.jsx'

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
     }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
