import { optimize } from 'svgo'

export const optimizeSVG = (content: string) => {
  try {
    return optimize(content).data
  } catch (e) {
    return content
  }
}
