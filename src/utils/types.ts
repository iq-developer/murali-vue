import type { Ref } from 'vue'

export type SlideType = 'story' | 'storyQuestion'

export type Class = {
  name: Ref<string>
  delay: number
  class: string
}

export type Word =
  | {
      word: string
      delay: number
    }
  | string

export type CommonSlidePart = {
  id: string
  isLesson?: boolean
  slideType: SlideType
}

type WordAnswer = {
  word: string
  answer?: boolean
  userAnswer?: 'selected' | 'correct' | 'wrong' | null
}
type ImageAnswer = {
  image: string
  alt: string
  answer?: boolean
  userAnswer?: 'selected' | 'correct' | 'wrong' | null
}
export type Answer = WordAnswer | ImageAnswer

export type AllSlideParts = CommonSlidePart & {
  words?: Word[]
  answers?: Answer[]
  word?: string
  image?: string | boolean
  sound?: string | boolean
}
