import { useState } from 'react'
import './App.css'

const BUTTONS = [
  ['C', '+/-', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

const OP_MAP = { '÷': '/', '×': '*', '−': '-', '+': '+' }

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)

  function handleDigit(digit) {
    if (waitingForSecond) {
      setDisplay(digit === '.' ? '0.' : digit)
      setWaitingForSecond(false)
      return
    }
    if (digit === '.' && display.includes('.')) return
    setDisplay(display === '0' && digit !== '.' ? digit : display + digit)
  }

  function handleOperator(op) {
    const current = parseFloat(display)
    if (firstOperand !== null && !waitingForSecond) {
      const result = calculate(firstOperand, current, operator)
      setDisplay(format(result))
      setFirstOperand(result)
    } else {
      setFirstOperand(current)
    }
    setOperator(op)
    setWaitingForSecond(true)
  }

  function handleEquals() {
    if (operator === null || firstOperand === null) return
    const result = calculate(firstOperand, parseFloat(display), operator)
    setDisplay(format(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  function calculate(a, b, op) {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? 'Error' : a / b
      default: return b
    }
  }

  function format(value) {
    if (value === 'Error') return 'Error'
    const str = String(parseFloat(value.toFixed(10)))
    return str.length > 12 ? parseFloat(value.toPrecision(9)).toString() : str
  }

  function handleClear() {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  function handleToggleSign() {
    setDisplay(format(parseFloat(display) * -1))
  }

  function handlePercent() {
    setDisplay(format(parseFloat(display) / 100))
  }

  function onButton(label) {
    if (label === 'C') return handleClear()
    if (label === '+/-') return handleToggleSign()
    if (label === '%') return handlePercent()
    if (label === '=') return handleEquals()
    if (label in OP_MAP) return handleOperator(OP_MAP[label])
    handleDigit(label)
  }

  function buttonClass(label) {
    if (label === '0') return 'btn btn-wide'
    if (['÷', '×', '−', '+', '='].includes(label)) return 'btn btn-operator'
    if (['C', '+/-', '%'].includes(label)) return 'btn btn-function'
    return 'btn'
  }

  const activeOp = operator
    ? Object.entries(OP_MAP).find(([, v]) => v === operator)?.[0]
    : null

  return (
    <div className="calculator">
      <div className="display">
        <span className="display-text">{display}</span>
      </div>
      <div className="buttons">
        {BUTTONS.map((row, i) => (
          <div key={i} className="row">
            {row.map((label) => (
              <button
                key={label}
                className={`${buttonClass(label)}${label === activeOp && waitingForSecond ? ' active' : ''}`}
                onClick={() => onButton(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
