import { showMessageGlobal } from './message'

export const showMessage = (text: string) => {
  showMessageGlobal?.(text)
}
