import type { DeclineWordType } from '../types/types'

/**
 * Возвращает случайный элемент из массива.
 * @param arr Массив элементов типа T
 * @returns Случайный элемент из массива
 */
export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * declineByNumber(1, ['продукт', 'продукта', 'продуктов']) => 'продукт'
 * declineByNumber(5, ['продукт', 'продукта', 'продуктов']) => 'продуктов'
 *
 * variants[0] for (1, 21, ... etc.)
 * variants[1] for (2,3, ... etc.)
 * variants[2] for (5,6, ... etc.)
 */
export const declineWordByNumber = (
  num: number,
  variants: DeclineWordType,
): string => {
  const cases = [2, 0, 1, 1, 1, 2]
  const lastTwoDigits = num % 100

  const isFrom5To19 = lastTwoDigits > 4 && lastTwoDigits < 20

  if (isFrom5To19) {
    return variants[2]
  } else {
    const lastDigit = num % 10
    const index = lastDigit < 5 ? lastDigit : 5
    const choiceWordIndex = cases[index]
    return variants[choiceWordIndex]
  }
}
