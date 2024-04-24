import type { BinaryExpr, Expr } from '../ast'
import type { Parser } from '../parser'

export class MathParser {
  static parseAdditiveExpr(source: Parser): Expr {
    let left: Expr | BinaryExpr = this.parseMultiplicativeExpr(source)

    while (source.at.value == '+' || source.at.value == '-') {
      const operator = source.eat.value
      const right = this.parseMultiplicativeExpr(source)

      left = { kind: 'BinaryExpr', left, right, operator }
    }

    return left
  }

  static parseMultiplicativeExpr(source: Parser): Expr {
    let left: Expr | BinaryExpr = source.parsePrimaryExpr()

    while (
      source.at.value == '*' ||
      source.at.value == '/' ||
      source.at.value == '%'
    ) {
      const operator = source.eat.value
      const right = source.parsePrimaryExpr()

      left = { kind: 'BinaryExpr', left, right, operator }
    }

    return left
  }
}
