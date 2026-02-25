import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './RootLayout'
import { Dairy, Feed, Groups, Messages } from './pages'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'


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
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
