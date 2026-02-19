import { createBrowserRouter, RouterProvider } from 'react-router'
import { useAuth } from './context/AuthContext'
import RootLayout from './RootLayout'
import { Dairy, Feed, Groups, Messages } from './pages'
import Landing from './pages/Landing'


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Feed />
      },
      {
        path: '/dairy',
        element: <Dairy />
      },
      {
        path: '/groups',
        element: <Groups />
      },
      {
        path: '/messages',
        element: <Messages />
      }
    ]
  }
])

function App() {
  const { token, user } = useAuth();

  if (!token || !user?._id) {
    return (
      <Landing />
    )
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
