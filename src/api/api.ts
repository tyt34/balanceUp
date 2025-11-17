const PATH = `https://dev-space.su/api/v1/`

export const API = {
  DEVICES: `${PATH}a/devices/`,
  CHANGE: (deviceId: number, placeId: number) =>
    `${PATH}a/devices/${deviceId}/place/${placeId}/update`,
}
