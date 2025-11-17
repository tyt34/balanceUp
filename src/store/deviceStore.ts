import { API } from '../api/api'
import { FIRST_NAME, SECOND_NAME } from '../constants/names'
import { getRandomItem } from '../utils/utils'
import { makeAutoObservable, runInAction } from 'mobx'
import { showMessage } from '../components/message/message.utils'
import axios from 'axios'

import type {
  Device,
  PlayerBalanceResponse,
  PlayerBalanceResult,
  StorePlayer,
} from '../types/devices'
import { MESSAGE } from '../constants/message'

class DeviceStore {
  devices: Device[] = []
  loading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  private LOCAL_STORAGE_KEY = 'playerNames'

  // Получение сохранённых имён игроков из localStorage
  private getStoredNames(): StorePlayer[] {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // Сохранение имён игроков в localStorage
  private saveNamesToStorage(names: StorePlayer[]) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(names))
  }

  async fetchDevices() {
    this.loading = true
    this.error = null

    try {
      const response = await axios.get<Device[]>(API.DEVICES, {
        params: { fullText: true },
        timeout: 5000,
      })

      const data = response.data

      // Загружаем имена из localStorage
      const storedNames = this.getStoredNames()

      const newStoredNames: StorePlayer[] = [...storedNames]

      // Добавляем имена игрокам, если их нет
      const dataWithNames = data.map((device) => ({
        ...device,
        places: device.places.map((player) => {
          const existing = storedNames.find(
            (p) => p.deviceId === device.id && p.place === player.place,
          )

          if (existing) {
            // Если имя уже есть - используем его
            return { ...player, name: existing.name }
          } else {
            // Если имени нет - генерируем случайное и сохраняем
            const name = `${getRandomItem(FIRST_NAME)} ${getRandomItem(
              SECOND_NAME,
            )}`
            newStoredNames.push({
              deviceId: device.id,
              place: player.place,
              name,
            })
            return { ...player, name }
          }
        }),
      }))

      // Сохраняем обновлённые имена в localStorage
      this.saveNamesToStorage(newStoredNames)

      this.devices = dataWithNames
    } catch (error: any) {
      const message = error?.response?.data?.err || MESSAGE.SOME
      showMessage(message)
      this.error = message
      this.devices = []
    } finally {
      this.loading = false
    }
  }

  async updatePlayerBalance(
    deviceId: number,
    placeId: number,
    delta: number,
  ): Promise<PlayerBalanceResponse> {
    try {
      const res = await axios.post<PlayerBalanceResult>(
        API.CHANGE(deviceId, placeId),
        { delta },
      )

      const data = res.data

      // Если сервер вернул объект с ошибкой - выбрасываем исключение
      if ('err' in data) {
        throw new Error(data.err)
      }

      // Обновляем баланс игрока в сторе
      runInAction(() => {
        const player = this.devices
          .find((d) => d.id === deviceId)
          ?.places.find((p) => p.place === placeId)
        if (player) {
          player.balances = data.balances
        }
      })

      return data
    } catch (error: any) {
      const message = error?.response?.data?.err || MESSAGE.SOME
      showMessage(message)
      this.error = message
      throw error
    }
  }
}

export const deviceStore = new DeviceStore()
