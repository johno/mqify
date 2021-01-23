const classPostfix = require('postcss-class-postfix')
const classPrefix = require('postcss-class-prefix')
const stripComments = require('strip-css-comments')
const isNumber = require('is-number')
const isObject = require('isobject')
const postcss = require('postcss')

const DEFAULTS = ['md', 'lg', 'xl', 'xxl']

module.exports = async (css, mqs) => {
  const px = parse(mqs)
		.map(({ key, mq, prefix, delimiter = '-' }) => {
			const fn = prefix ?
				classPrefix(`${key}${delimiter}`) :
				classPostfix(`${delimiter}${key}`)

			return postcss([ fn ])
				.process(css, { from: undefined })
				.then(mqified => `
					@media ${mq} {
						${stripComments(mqified.css).trim()}
					}
				`)
		})

  const mqCss = await Promise.all(px)

  return [css].concat(mqCss).join('\n')
}

const format = mediaQueries => mediaQueries.map((breakpoint, i) => {
	if (isNumber(breakpoint)) {
		return {
			key: DEFAULTS[i] || `mq${i}`,
			value: breakpoint
		}
	}

  if(breakpoint === 'print') {
    return { key: 'print', value: 'print' }
  }

  const key = Object.keys(breakpoint)[0]
  const value = breakpoint[key]

  if (isObject(value)) {
    return Object.assign({}, breakpoint[key], {
      key,
      value: value.value
    })
  } else {
    return { key, value }
  }
})

const parse = mediaQueries => {
  const formatted = format(mediaQueries)
  const hasPrintQuery = formatted.findIndex(mq => mq.key === 'print')
  const screenQueries = formatted
  let printQuery

  if (hasPrintQuery > -1) {
    // remove the print query from the screen queries list
    printQuery = screenQueries.splice(hasPrintQuery)[0];
    printQuery = Object.assign({}, printQuery, {
      key: typeof printQuery.value === 'string' ? printQuery.value : 'print',
      mq: 'print'
    })
  }

  const minMaxMedia = screenQueries.filter(s => !isMinOrMaxWidthQuery(s))
  const minMaxQueries = minMaxMedia.map((breakpoint, i) => {
    const nextBreakpoint = minMaxMedia[i+1]

    const mq = [
      'screen',
      `(min-width: ${withUnits(breakpoint.value)})`
    ]

    if (nextBreakpoint) {
      mq.push(`(max-width: ${withUnits(nextBreakpoint.value)})`)
    }

    return Object.assign({}, breakpoint, { mq: mq.join(' and ') })
  })

  const minQueries = screenQueries
    .filter(isMinWidthQuery)
    .map(breakpoint => {
      const mq = `screen and (min-width: ${withUnits(breakpoint.value)})`

      return Object.assign({}, breakpoint, { mq })
    })

  const maxQueries = screenQueries
    .filter(isMaxWidthQuery)
    .map(breakpoint => {
      const mq = `screen and (max-width: ${withUnits(breakpoint.value)})`

      return Object.assign({}, breakpoint, { mq })
    })

    return minMaxQueries
      .concat(minQueries)
      .concat(maxQueries)
      .concat(printQuery || [])
}

const isMinWidthQuery = breakpoint => breakpoint.minWidth
const isMaxWidthQuery = breakpoint => breakpoint.maxWidth
const isMinOrMaxWidthQuery = breakpoint => breakpoint.minWidth || breakpoint.maxWidth

const hasUnits = str => /(px|em|rem)$/.test(str)
const withUnits = (str, unit = 'em') => hasUnits(str) ? str : `${str}${unit}`

module.exports.format = format
module.exports.parse = parse
module.exports.hasUnits = hasUnits
module.exports.withUnits = withUnits
