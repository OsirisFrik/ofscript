import type { Expr, Program, Stmt } from '../ast'
import { TokenType, tokenize, type Token } from '../lexer'

export abstract class MethodsParserBase {
  parsePrimaryExpr(): Expr {
    throw new Error('ParsePrimaryExpr not implemented')
  }

  parseExpr(): Expr {
    throw new Error('ParseExpr not implemented')
  }

  parseStmt(): Stmt {
    throw new Error('ParseStmt not implemented')
  }

  // @ts-expect-error
  produceAST(sourceCode: string): Program {
    throw new Error('ProduceAST not implemented')
  }
}

export class ParserBase extends MethodsParserBase {
  #tokens: Token[] = []

  get tokens(): Token[] {
    return this.#tokens
  }

  set tokens(tokens: string) {
    this.#tokens = tokenize(tokens)
  }

  get at(): Token {
    return this.#tokens[0]
  }

  get eat(): Token {
    const prev = this.#tokens.shift()

    return prev as Token
  }

  get notEOF(): boolean {
    return this.#tokens[0].type !== TokenType.EOF
  }

  expect(type: TokenType, err: any) {
    const prev = this.#tokens.shift()

    if (!prev || prev.type !== type) {
      console.error('Parser Error:\n', err, prev, ' - Expecting: ', type)
    }

    return prev
  }
}
