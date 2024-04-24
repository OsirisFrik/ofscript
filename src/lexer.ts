export enum TokenType {
  // Literals
  Null,
  Number,
  Identifier,

  // Operators and Delimiters
  Equals,
  OpenParen,
  CloseParen,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  BinaryOperator,

  // Keywords
  Let,

  // Symbols
  EOF
}

export interface Token {
  type: TokenType
  value: string
}

const KEY_WORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null
}

const token = (value: string = '', type: TokenType): Token => ({ value, type })
const isAlpha = (str: string) => str.toLowerCase() != str.toUpperCase()
const isInt = (str: string) => {
  const c = str.charCodeAt(0)
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]

  return c >= bounds[0] && c <= bounds[1]
}

const isSkipable = (str: string) =>
  str === '' || str === '\n' || str === '\t' || ' '

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  const src = input.split('')

  /**
   * District between keywords and identifiers
   */
  while (src.length > 0) {
    // Grouping keywords
    if (src[0] === '(') {
      tokens.push(token(src.shift(), TokenType.OpenParen))
    } else if (src[0] === ')') {
      tokens.push(token(src.shift(), TokenType.CloseParen))
    } else if (src[0] === '{') {
      tokens.push(token(src.shift(), TokenType.OpenBrace))
    } else if (src[0] === '}') {
      tokens.push(token(src.shift(), TokenType.CloseBrace))
    } else if (src[0] === '[') {
      tokens.push(token(src.shift(), TokenType.OpenBracket))
    } else if (src[0] === ']') {
      tokens.push(token(src.shift(), TokenType.CloseBracket))
    } else if (
      // operators
      src[0] === '+' ||
      src[0] === '-' ||
      src[0] === '*' ||
      src[0] === '/'
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator))
    } else if (src[0] === '=') {
      tokens.push(token(src.shift(), TokenType.Equals))
    } else {
      // Handle multicharacter tokens

      // Parse number token
      if (isInt(src[0])) {
        let num = ''

        while (src.length > 0 && isInt(src[0])) {
          num += src.shift()
        }

        tokens.push(token(num, TokenType.Number))
      } else if (isAlpha(src[0])) {
        let id = ''

        while (src.length > 0 && isAlpha(src[0])) {
          id += src.shift()
        }

        // check for key words
        const reserved = KEY_WORDS[id]

        if (typeof reserved === 'number') tokens.push(token(id, reserved))
        else tokens.push(token(id, TokenType.Identifier))
      } else if (isSkipable(src[0])) {
        src.shift()
      } else {
        throw new Error(`Unexpected character: ${src[0]}`)
      }
    }
  }

  tokens.push({
    type: TokenType.EOF,
    value: 'EOF'
  })

  return tokens
}
