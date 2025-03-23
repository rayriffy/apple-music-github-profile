import { optimize } from 'svgo'

export const optimizeSvg = (content: string) => {
  try {
    return optimize(content).data
  } catch (e) {
    return content
  }
}
