import { Card } from 'react-bootstrap'
import { Flipper, Flipped } from 'react-flip-toolkit'
import { Link } from 'react-router-dom'
import { pages } from '../../app/config-pages'
import { useState, type FC } from 'react'
import type { Device } from '../../types/devices'

import styles from './device-card.module.scss'

interface Props {
  device: Device
}

export const DeviceCard: FC<Props> = ({ device }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const transformStyle = {
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }

  return (
    <Flipper flipKey={`${device.id}-${isFlipped}`}>
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={styles.container}
      >
        <Flipped flipId={`card-${device.id}`}>
          <Card
            className={styles.card}
            style={transformStyle}
          >
            {/* Передняя сторона карточки */}

            <div className={styles.front}>
              <Card.Title className="text-center">
                {device.name}
              </Card.Title>
            </div>

            {/* Задняя сторона карточки */}

            <div className={styles.back}>
              <div className={styles.players}>
                {device.places.map((player, index) => {
                  const key = `${device.id}_${player.place}`

                  const playerLink = pages.player.path
                    .replace(':idDevice', String(device.id))
                    .replace(':idPlayer', String(player.place))

                  return (
                    <Link
                      key={key}
                      to={playerLink}
                      className={styles.playerLink}
                    >
                      {player.name || `Игрок ${index + 1}`}
                    </Link>
                  )
                })}
              </div>
            </div>
          </Card>
        </Flipped>
      </div>
    </Flipper>
  )
}
