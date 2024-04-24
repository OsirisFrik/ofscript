import Debug from 'debug'

import type { Expr, Identifier, NullLiteral, Program, Stmt } from './ast'
import { TokenType } from './lexer'
import { MethodsParserBase, ParserBase } from './modules/base'
import { MathParser } from './modules/math'

const debug = Debug('ofs:parser')

export class Parser extends ParserBase implements MethodsParserBase {
  produceAST(sourceCode: string): Program {
    this.tokens = sourceCode

    debug(this.tokens)

    const program: Program = {
      kind: 'Program',
      body: []
    }

    while (this.notEOF) {
      program.body.push(this.parseStmt())
    }

    return program
  }

  parseStmt(): Stmt {
    return this.parseExpr()
  }

  parseExpr(): Expr {
    return MathParser.parseAdditiveExpr(this)
  }

  parsePrimaryExpr(): Expr {
    const tk = this.at.type

    switch (tk) {
      case TokenType.Null:
        this.eat

        return {
          kind: 'NullLiteral',
          value: 'null'
        } as NullLiteral

      case TokenType.Number:

      case TokenType.Identifier:
        return {
          kind: 'Identifier',
          symbol: this.eat.value
        } as Identifier
        break

      case TokenType.Number:
        return {
          kind: 'NumericLiteral',
          value: parseFloat(this.eat.value)
        } as Expr
        break

      case TokenType.Let:
        return {
          kind: 'Identifier',
          symbol: this.eat.value
        } as Identifier

      case TokenType.OpenParen:
        this.eat

        const value = this.parseExpr()

        this.eat

        return value

      default:
        debug(`Unexpected token on parser: ${this.at.value}`)

        process.exit(1)
    }
  }
}
