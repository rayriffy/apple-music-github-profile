import fs from 'fs'
import path from 'path'

import { render } from 'art-template'
import { optimizeSVG } from '../src/core/services/optimizeSVG'

import { themes } from '../src/core/constants/themes'
;(async () => {
  const builtRenderedData = {
    title: 'キミの魔法',
    artist: '北白川たまこ(cv:洲崎 綾)',
    coverImageData: `data:image/jpeg;base64,${await fs.promises.readFile(
      'tools/preview.jpg',
      'base64'
    )}`,
    timestamp: {
      percentage: 33.33,
      elapsed: '1:14',
      remaining: '2:28',
    },
  }

  // generates sample cards
  await Promise.all(
    themes.map(async theme => {
      // read template file
      const templateData = await fs.promises.readFile(
        path.join(process.cwd(), 'src/templates', `${theme.id}.art`),
        'utf-8'
      )

      // render and write with provided template file
      const optimizedRender = optimizeSVG(
        render(templateData, builtRenderedData)
      )
      await fs.promises.writeFile(
        path.join(process.cwd(), `img/${theme.id}.svg`),
        optimizedRender
      )
    })
  )

  // read original readme
  const readme = await fs.promises.readFile(
    path.join(process.cwd(), 'README.md'),
    'utf-8'
  )

  // modify readme
  const modifiedReadme = readme
    .split('## ')
    .map(section => {
      if (section.startsWith('Themes\n')) {
        return `Themes\n\n| Themes | Preview |\n| - | - |\n${themes
          .map(
            theme =>
              `| ${
                theme.name
              } | <img alt="${theme.name.toLowerCase()} theme" src="./img/${
                theme.id
              }.svg" height="350" /> |`
          )
          .join('\n')}\n\n`
      } else {
        return section
      }
    })
    .join('## ')

  // write readme
  await fs.promises.writeFile(
    path.join(process.cwd(), 'README.md'),
    modifiedReadme
  )
})()
