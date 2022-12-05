import { optimize } from 'svgo'

export const optimizeSVG = (content: string) => {
  try {
    return optimize(content).data
  } catch (e) {
    console.log(e)
    return content
  }
}
