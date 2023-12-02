export interface IMovie {
  title: string
  summary: string
  poster: string
  rating_average: number
  genre: string
}

export interface NearTextType {
  concepts: [string] | []
  certainty?: number
  moveAwayFrom?: object
}
