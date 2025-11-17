import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { pages } from '../../app/config-pages'
import type { FC } from 'react'

import styles from './header.module.scss'

interface Props {
  showDevicesButton?: boolean
}

export const Header: FC<Props> = ({ showDevicesButton }) => {
  return (
    <div className={styles.header}>
      <Link
        to={pages.navigation.path}
        style={{ textDecoration: 'none' }}
      >
        <Button variant="primary">Главная</Button>
      </Link>

      {showDevicesButton && (
        <Link
          to={pages.devices.path}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="primary">Все устройства</Button>
        </Link>
      )}
    </div>
  )
}
