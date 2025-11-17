/**
 * Представляет игрока (Player) в рамках приложения.
 *
 * Поле `place` идентифицирует игрока на устройстве.
 */
export interface Player {
  /** ID устройства, к которому привязан игрок */
  device_id: number
  /** ID игрока */
  place: number
  currency: string
  /** Баланс игрока */
  balances: number
}

/**
 * Игрок с именем.
 * Расширяет Player, добавляя поле name для отображения в UI.
 */
export interface PlayerWithName extends Player {
  name: string
}

/**
 * Устройство с игроками.
 */
export interface Device {
  /** ID устройства */
  id: number
  /** Название устройства */
  name: string
  /** Список игроков, привязанных к устройству */
  places: PlayerWithName[]
  created_at: string
  updated_at: string
}

/**
 * Хранения имён игроков в локальном хранилище.
 * Связывает конкретное устройство и место с именем игрока.
 */
export interface StorePlayer {
  /** ID устройства */
  deviceId: number
  /** ID игрока */
  place: number
  /** Имя игрока, которое генерируется случайным образом и сохраняется в local storage */
  name: string
}

export interface PlayerBalanceResponse {
  /** ID устройства */
  device_id: number
  /** ID игрока */
  place: number
  currency: string
  /** Баланс игрока */
  balances: number
}

export interface PlayerBalanceError {
  /** Текст ошибки */
  err: string
  data: null
}

export type PlayerBalanceResult =
  | PlayerBalanceResponse
  | PlayerBalanceError
