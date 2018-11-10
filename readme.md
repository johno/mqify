# mqify [![Build Status](https://secure.travis-ci.org/johno/mqify.svg?branch=master)](https://travis-ci.org/johno/mqify) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Turn a css string and media query config into classes for each breakpoint

## Installation

```bash
npm install --save mqify
```

## Usage

```javascript
var mqify = require('mqify')

mqify(CSS, [24, 32, 46])
```

#### Input

```css
.fl { float: left }
```

#### Output

```css
.fl { float: left }

@media screen and (min-width: 24em) and (max-width: 32em) {
  .fl-md { float: left }
}

@media screen and (min-width: 32em) and (max-width: 64em) {
  .fl-lg { float: left }
}

@media screen and (min-width: 64em) {
  .fl-xl { float: left }
}
```

#### Options

In addition to a breakpoint array, `mqify` accepts a key/value pair or a more complex config.

##### Key/value pair

```js
[
  { medium: 24 },
  { large: 48 }
]
```

##### All the options

```js
[
  {
    med: {
      value: 32,
      prefix: true,
      delimiter: '-',
      minWidth: true
    }
  }
]
```

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by John Otander ([@4lpine](https://twitter.com/4lpine)).

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
