import Debug from 'debug'
import { parseArgs } from 'util'
import { Parser } from './parser'
import { eva } from './runtime/interpreter'

const debug = Debug('ofs:main')

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    file: {
      type: 'string'
    }
  },
  strict: true,
  allowPositionals: true
})

const parser = new Parser()

if (values.file) {
  const file = Bun.file(values.file)

  const program = parser.produceAST(await file.text())

  debug(program)

  process.exit(0)
}

while (true) {
  const input = prompt('> ')

  if (!input || input.includes('exit')) {
    process.exit(0)
  }

  const program = parser.produceAST(input)

  debug(program)

  const result = eva(program)

  debug(result)
}
