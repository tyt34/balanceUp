interface Page {
  [key: string]: {
    /**
     * Полный путь для роута внутри приложения
     * Используется в Route и navigate
     * Пример: '/devices', '/player/:idDevice/:idPlayer'
     */
    path: string
    /**
     * Путь для отображения в URL, когда используем HashRouter
     * Для GitHub Pages / других хеш-поддерживающих хостингов
     * Пример: '#/devices', '#/player/1/1'
     */
    hashPath: string

    /**
     * Используется для формирования ссылки с использованием id
     */
    partPath?: string
  }
}

export const pages: Page = {
  navigation: { path: '/navigation', hashPath: '#/navigation' },
  devices: { path: '/devices', hashPath: '#/devices' },
  player: {
    path: '/player/:idDevice/:idPlayer',
    hashPath: '#/player/',
    partPath: '/player/',
  },
}

export const navigateConfig = [
  {
    id: 1,
    navigate: pages.devices.path,
    title: 'Все устройства',
  },
  {
    id: 2,
    navigate: `${pages.player.partPath}1/1`,
    title: 'Существующий игрок',
  },
  {
    id: 3,
    navigate: `${pages.player.partPath}1/3`,
    title: 'Не существующий игрок',
  },
]
