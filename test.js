import test from 'ava'
import mqify from './'

const INPUT = `
.fl { float: left }
.fr { float: right }
`

test('mqifies an array', async t => {
  t.snapshot(await mqify(INPUT, [24, 32, 64, 'print']))
})

const COMPLEX = [
  { m: '32' },
  {
    l: {
      value: '64'
    }
  },
  {
    med: {
      value: 64,
      minWidth: true,
      prefix: true,
      delimiter: '@'
    }
  },
  {
    xl: {
      value: 123,
      minWidth: true
    }
  },
  {
    ns: {
      value: 1234,
      maxWidth: true
    }
  },
  {
    print: true,
  }
]

test('handles all the options', async t => {
	t.snapshot(await mqify(INPUT, COMPLEX))
})
