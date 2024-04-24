import Debug from 'debug'
import type { BinaryExpr, NumericLiteral, Program, Stmt } from '../ast'
import type { NullRuntimeVal, NumberRuntimeVal, RuntimeVal } from './values'

const debug = Debug('ofs:interpreter')

function evaNumericBinaryExpr(
  left: NumberRuntimeVal,
  right: NumberRuntimeVal,
  operator: string
): NumberRuntimeVal {
  let res = 0

  if (operator === '+') res = left.value + right.value
  else if (operator === '-') res = left.value - right.value
  else if (operator === '*') res = left.value * right.value
  else if (operator === '/') res = left.value / right.value
  else if (operator === '%') res = left.value % right.value

  debug(res)

  return {
    type: 'number',
    value: res
  }
}

function evaBinaryExpr(binop: BinaryExpr): RuntimeVal {
  const lhs = eva(binop.left)
  const rhs = eva(binop.right)

  if (lhs.type !== 'number' || rhs.type !== 'number') {
    return evaNumericBinaryExpr(
      lhs as NumberRuntimeVal,
      rhs as NumberRuntimeVal,
      binop.operator
    )
  }

  return {
    type: 'null',
    value: 'null'
  } as NullRuntimeVal
}

function evaProgram(program: Program): RuntimeVal {
  let lastEval: RuntimeVal = {
    type: 'null',
    value: 'null'
  } as NullRuntimeVal

  for (const state of program.body) {
    lastEval = eva(state)
  }

  return lastEval
}

export function eva(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case 'NumericLiteral':
      return {
        value: (astNode as NumericLiteral).value,
        type: 'number'
      } as NumberRuntimeVal

    case 'NullLiteral':
      return {
        type: 'null',
        value: 'null'
      } as NullRuntimeVal

    case 'BinaryExpr':
      return evaBinaryExpr(astNode as BinaryExpr)

    case 'Program':
      return evaProgram(astNode as Program)

    default:
      console.error('Unknown node type', astNode.kind)

      process.exit(1)
  }
}
