import { DevicesPage } from '../pages/devices'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Message } from '../components/message'
import { NavigationPage } from '../pages/navigation/navigation'
import { pages } from './config-pages'
import { PlayerPage } from '../pages/player'
import { type JSX } from 'react'

import './app.style.scss'

type ConfigRoutes = {
  key: string | number
  path: string | undefined
  element: JSX.Element
}[]

const App = () => {
  const configRoutes: ConfigRoutes = [
    {
      key: 'first',
      path: '/',
      element: (
        <Navigate
          replace
          to={pages.navigation.path}
        />
      ),
    },
    {
      key: 1,
      path: pages.navigation.path,
      element: <NavigationPage />,
    },
    {
      key: 2,
      path: pages.devices.path,
      element: <DevicesPage />,
    },
    {
      key: 3,
      path: pages.player.path,
      element: <PlayerPage />,
    },
    {
      key: 'not-found',
      path: '*',
      element: (
        <Navigate
          to={pages.navigation.path}
          replace
        />
      ),
    },
  ]

  return (
    <section>
      <HashRouter basename={'/'}>
        <Routes>
          {configRoutes.map((route) => {
            return (
              <Route
                key={route.key}
                path={route.path}
                element={route.element}
              />
            )
          })}
        </Routes>
      </HashRouter>

      <Message />
    </section>
  )
}

export default App
