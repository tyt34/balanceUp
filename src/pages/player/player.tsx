import { Button, Container, Form } from 'react-bootstrap'
import { declineWordByNumber } from '../../utils/utils'
import { deviceStore } from '../../store/deviceStore'
import { getPlayerByIds } from './player.utils'
import { Header } from '../../components/header'
import { LoadingPage } from '../loading'
import { MESSAGE } from '../../constants/message'
import { Navigate, useParams } from 'react-router-dom'
import { pages } from '../../app/config-pages'
import { showMessage } from '../../components/message/message.utils'
import { useEffect, useRef, useState } from 'react'
import type { DeclineWordType } from '../../types/types'
import type { PlayerWithName } from '../../types/devices'

import styles from './player.module.scss'

// клавиатура
const KEYS = [
  ['←'],
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0', '.'],
  ['Deposit', 'Withdraw'],
]

/**
 * Форматирует ввод пользователя для поля с числом с десятичной частью.
 *
 * Логика:
 * 1. Вставляет символ `insert` в строку `value` на позиции `cursorPos`.
 * 2. Проверяет, чтобы в результате не оказалось больше одной точки.
 * 3. Если есть дробная часть (после точки), ограничивает её максимум 2 знаками.
 *
 * @param value - текущая строка в поле ввода
 * @param insert - символ, который пытаемся вставить (цифра или точка)
 * @param cursorPos - текущая позиция курсора в поле ввода
 * @returns новую строку после вставки, либо исходную `value`, если вставка нарушает правила
 */
const formatInput = (
  value: string,
  insert: string,
  cursorPos: number,
) => {
  const newValue =
    value.slice(0, cursorPos) + insert + value.slice(cursorPos)

  const points = newValue.split('.')

  if (points.length > 2) {
    return value
  }

  if (points[1]?.length > 2) {
    return value
  }

  return newValue
}

const DECLINE_RUB: DeclineWordType = ['рубль', 'рубля', 'рублей']

export const PlayerPage = () => {
  const { idDevice, idPlayer } = useParams()

  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState<PlayerWithName | null>(null)
  const [isFound, setIsFound] = useState<boolean | null>(null)
  const [updateBalance, setUpdateBalance] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const handleDeposit = async () => {
    if (+updateBalance === 0) {
      showMessage(MESSAGE.MORE_ZERO)
      return
    }

    const delta = parseFloat(updateBalance)
    if (isNaN(delta)) {
      return
    }

    try {
      const res = await deviceStore.updatePlayerBalance(
        player!.device_id,
        player!.place,
        delta,
      )

      setPlayer((prev) =>
        prev ? { ...prev, balances: res.balances } : prev,
      )
    } catch (e) {
      console.error({ e })
    }
  }

  const handleWithdraw = async () => {
    const delta = -parseFloat(updateBalance)

    if (+updateBalance === 0) {
      showMessage(MESSAGE.MORE_ZERO)
      return
    }

    if (isNaN(delta)) {
      return
    }

    try {
      const res = await deviceStore.updatePlayerBalance(
        player!.device_id,
        player!.place,
        delta,
      )

      setPlayer((prev) =>
        prev ? { ...prev, balances: res.balances } : prev,
      )
    } catch (e) {
      console.error({ e })
    }
  }

  /**
   * Обрабатывает нажатие "кнопки" на виртуальной клавиатуре для изменения баланса.
   *
   * Логика:
   * - 'Deposit' / 'Withdraw' вызывают соответствующие функции.
   * - '←' удаляет символ слева от каретки или выделение.
   * - Цифры и '.' вставляются в текущую позицию курсора с проверкой через formatInput.
   * - После изменений обновляется состояние и позиция каретки.
   */
  const handleKeyPress = (value: string) => {
    if (value === 'Deposit') {
      return handleDeposit()
    }

    if (value === 'Withdraw') {
      return handleWithdraw()
    }

    const input = inputRef.current

    if (!input) {
      return
    }

    // Текущие позиции курсора / выделения
    let start = input.selectionStart || 0
    let end = input.selectionEnd || 0
    let newValue = updateBalance

    // Вставка обычных цифр или точки
    if (value !== '←' && value !== 'Deposit' && value !== 'Withdraw') {
      newValue = formatInput(updateBalance, value, start)
    }

    // Обработка кнопки "Backspace"
    if (value === '←') {
      if (start !== end) {
        // Если есть выделение - удаляем его
        newValue =
          updateBalance.slice(0, start) + updateBalance.slice(end)

        end = start
      } else if (start > 0) {
        // Если выделения нет - удаляем символ слева от курсора
        newValue =
          updateBalance.slice(0, start - 1) + updateBalance.slice(end)

        start -= 1
        end = start
      }
    } else {
      // Вставка обычного символа (цифра или точка)
      newValue = formatInput(updateBalance, value, start)
      start += value.length
      end = start
    }

    setUpdateBalance(newValue)

    // После обновления состояния устанавливаем позицию каретки
    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + value.length
      input.focus()
    })
  }

  /**
   * Обрабатывает нажатие клавиш в поле изменения баланса
   * Разрешает только цифры, одну точку и управляющие клавиши
   * Ограничивает дробную часть максимум двумя знаками
   */
  const handleBalanceInputKeyDown = (
    e: React.KeyboardEvent<unknown>,
    value: string,
  ) => {
    const input = e.currentTarget as HTMLInputElement

    const ALLOWED_KEYS = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']

    const { selectionStart = 0, selectionEnd = 0 } = input

    const decimalIndex = value.indexOf('.')

    // Разрешаем управляющие клавиши
    if (ALLOWED_KEYS.includes(e.key)) {
      return
    }

    if (e.key === '.') {
      // Блокируем, если точка уже есть
      if (decimalIndex >= 0) {
        e.preventDefault()
      }
      return
    }

    // Разрешаем только цифры
    if (/[0-9.]/.test(e.key)) {
      const newValue = formatInput(
        updateBalance,
        e.key,
        input.selectionStart!,
      )
      if (newValue === updateBalance) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }

    // Проверка на количество знаков после точки
    if (decimalIndex >= 0 && selectionStart! > decimalIndex) {
      const fractionalPart = value.slice(decimalIndex + 1)
      // Если курсор выделен - можно вставить цифру
      if (
        fractionalPart.length >= 2 &&
        selectionStart === selectionEnd
      ) {
        e.preventDefault()
      }
    }
  }

  useEffect(() => {
    // Асинхронная функция для загрузки данных игрока
    const loadPlayer = async () => {
      // 1. Сначала пытаемся найти игрока в уже загруженных устройствах
      let foundPlayer = getPlayerByIds(
        idDevice!,
        idPlayer!,
        deviceStore.devices,
      )

      if (foundPlayer) {
        // Если игрок найден в сторе, сразу устанавливаем его в состояние и снимаем загрузку
        setPlayer(foundPlayer)
        setLoading(false)
        return
      }

      // 2. Если игрок не найден в сторе - делаем запрос на backend
      try {
        await deviceStore.fetchDevices()

        // После получения обновленных данных ищем игрока снова
        foundPlayer = getPlayerByIds(
          idDevice!,
          idPlayer!,
          deviceStore.devices,
        )

        setIsFound(!!foundPlayer)

        if (foundPlayer) {
          setPlayer(foundPlayer)
        }
      } catch (e) {
        console.error(e)
      }

      setLoading(false)
    }

    loadPlayer()
  }, [idDevice, idPlayer])

  if (loading) {
    return <LoadingPage />
  }

  // Если игрок не найден, то редиректим на главную страницу
  if (isFound === false) {
    return (
      <Navigate
        to={pages.navigation.path}
        replace
      />
    )
  }

  return (
    <>
      <Header showDevicesButton></Header>

      <Container className="mt-4">
        <h2>Игрок: {player!.name}</h2>
        <h2>Устройство: {player!.device_id}</h2>
        <h2>Id: {player!.place}</h2>
        <h2>
          Баланс: {player!.balances}{' '}
          {declineWordByNumber(player!.balances, DECLINE_RUB)}
        </h2>

        <Form.Group className="mb-3">
          <Form.Label>Изменение баланса на</Form.Label>
          <div className={styles.balanceInputWrapper}>
            <Form.Control
              ref={inputRef}
              value={updateBalance}
              onChange={(e) => setUpdateBalance(e.target.value)}
              type="text"
              style={{ flex: 1 }}
              onKeyDown={(e) =>
                handleBalanceInputKeyDown(e, updateBalance)
              }
            />

            <span className={styles.balanceLabel}>
              {declineWordByNumber(+updateBalance, DECLINE_RUB)}
            </span>
          </div>
        </Form.Group>

        <div className={styles.keyboardGrid}>
          {KEYS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.keyboardRow}
              style={{
                gridTemplateColumns: `repeat(${row.length}, 1fr)`, // теперь адаптивно
              }}
            >
              {row.map((key) => (
                <Button
                  key={key}
                  variant="secondary"
                  onClick={() => handleKeyPress(key)}
                  className={styles.keyboardButton}
                >
                  {key === 'backspace' ? '⌫' : key}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}

/*
Причина, зачем давать возможность писать числа с не более чем сотой доли: 
в реальных финансовых приложениях операции с валютой требуют 
точности до центов/копеек, а лишние дробные знаки могут привести к 
ошибкам округления, неправильным расчетам или багам при хранении и 
переводе средств.
*/
