import type { Device } from '../../types/devices'

export const getPlayerByIds = (
  idDevice: string,
  idPlayer: string,
  devices: Device[],
) => {
  const device = devices.find((d) => String(d.id) === String(idDevice))

  if (!device) {
    return null
  }

  const player = device.places.find(
    (p) => String(p.place) === String(idPlayer),
  )

  if (!player) {
    return null
  }

  return {
    ...player,
    deviceName: device.name,
  }
}
