export type ValueType = 'null' | 'number'

export interface RuntimeVal {
  type: ValueType
}

export interface NullRuntimeVal extends RuntimeVal {
  type: 'null'
  value: 'null'
}

export interface NumberRuntimeVal extends RuntimeVal {
  type: 'number'
  value: number
}
