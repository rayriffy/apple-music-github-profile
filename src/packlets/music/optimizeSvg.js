import { optimize } from 'svgo'
export const optimizeSvg = content => {
  try {
    return optimize(content).data
  } catch (e) {
    return content
  }
}
