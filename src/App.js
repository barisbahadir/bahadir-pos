import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import ProtectedRoute from './ProtectedRoute'
import './scss/style.scss'
import './scss/examples.scss'
import store from './store'
import Logout from './pages/logout/Logout'
import './scss/App.css'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./pages/login/Login'))
const Register = React.lazy(() => import('./pages/register/Register'))
const Page404 = React.lazy(() => import('./pages/page404/Page404'))
const Page500 = React.lazy(() => import('./pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('bahadir-pos-theme')

  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    // const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    // if (theme) {
    //   setColorMode(theme)
    // }

    // if (isColorModeSet()) {
    //   return
    // }

    setColorMode('light')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="loading-overlay">
              <div className="loading-spinner">
                <CSpinner color="info" />
              </div>
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/logout" name="Logout Page" element={<Logout />} />
            <Route
              path="*"
              name="Home"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
