import type { Class } from './types'
import { colors500 } from './constants'

export const playAudio = (src: string): void => {
  const audio = new Audio(src)
  audio.play()
}

export const getRandomColor = (colors: Array<string> = colors500): string => {
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getRandomAngle = () => {
  return Math.random() * 90 - 45 // Range: -45 to 45
}

export const activateClasses = (classes: Class[]): void => {
  classes.forEach((item) => {
    setTimeout(() => {
      item.name.value = item.class
    }, item.delay)
  })
}
