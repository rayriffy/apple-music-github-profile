import fs from 'fs'
import path from 'path'

import { render } from 'art-template'

import { optimizeSVG } from './optimizeSVG'

export const renderErrorCard = async (message: string) => {
  const errorTemplatePath = path.join(process.cwd(), 'src/templates/_error.art')

  const renderData = {
    message,
  }

  const templateFile = await fs.promises.readFile(errorTemplatePath, 'utf8')

  return optimizeSVG(render(templateFile, renderData))
}
