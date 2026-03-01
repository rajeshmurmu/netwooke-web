import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './RootLayout'
import { Dairy, Feed, Groups, Messages, Profile } from './pages'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


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
      },
      {
        path: '/profile/:username',
        element: <Profile />
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

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
