import fs from 'fs'
import path from 'path'

import ejs from 'ejs'
import { optimize } from 'svgo'

import type { OptimizedSvg } from 'svgo'

export const renderErrorCard = async (message: string) => {
  const errorTemplatePath = path.join(process.cwd(), 'src/templates/_error.ejs')

  const renderData = {
    message,
  }

  const templateFile = await fs.promises.readFile(errorTemplatePath, 'utf8')

  return (optimize(ejs.render(templateFile, renderData)) as OptimizedSvg).data
}
