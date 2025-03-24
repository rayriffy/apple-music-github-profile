import fs from 'node:fs'
import path from 'node:path'

import { render } from 'art-template'

import { optimizeSvg } from './optimizeSvg'

export const renderErrorCard = async (message: string) => {
  const errorTemplatePath = path.join(process.cwd(), 'src/templates/_error.art')

  const renderData = {
    message,
  }

  const templateFile = await fs.promises.readFile(errorTemplatePath, 'utf8')

  return optimizeSvg(render(templateFile, renderData))
}
