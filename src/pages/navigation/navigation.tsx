import { Button } from 'react-bootstrap'
import { navigateConfig } from '../../app/config-pages'
import { Link } from 'react-router-dom'

import styles from './navigation.module.scss'

export const NavigationPage = () => {
  return (
    <section className={styles.navigation}>
      <h1>Добро пожаловать!</h1>

      <p className={styles.navigation__description}>
        BalanceUp — приложение для управления балансами игроков. Вы
        можете открыть любое устройство, выбрать игрока и изменить его
        баланс. Если перейти по ссылке на игрока, которого нет в базе
        данных, приложение определит это и вернёт вас обратно на эту
        страницу.
      </p>

      <nav className={styles.navigation__list}>
        {navigateConfig.map((page) => {
          return (
            <Link
              to={page.navigate}
              style={{ textDecoration: 'none' }}
              key={page.id}
            >
              <Button
                key={page.title}
                variant="primary"
              >
                {page.title}
              </Button>
            </Link>
          )
        })}
      </nav>
    </section>
  )
}
