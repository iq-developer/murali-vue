import type { Ref } from 'vue'

export type SlideType =
  | 'Story'
  | 'StoryQuestion'
  | 'AssembleWord'
  | 'ThisIs'
  | 'DragTo'
  | 'SoapBubbles'

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

// Component types

type imageWords = {
  image: string | boolean
  words: Word[]
} & CommonSlidePart

type AssembleWordSlide = {
  image: string | boolean
  answer: string
} & CommonSlidePart

type StoryQuestionSlide = {
  answers: Answer[]
  word?: string
  image?: string | boolean
  sound?: string | boolean
} & CommonSlidePart

type SoapBubblesSlide = {
  answer: string
} & CommonSlidePart

export type AllSlides = imageWords | AssembleWordSlide | StoryQuestionSlide | SoapBubblesSlide
