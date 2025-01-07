import type { Ref } from 'vue'

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
