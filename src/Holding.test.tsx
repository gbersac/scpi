import { capitalAppreciation, HoldingDetails, holdingDetails } from './Holding';

test('holding calculation for example case', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"}
  ]
  
  const scpis = {
    'SCPI_A': {nbShares: 10, averageBuyingPrice: 1000, currentValPerShare: 1100}, 
    'SCPI_B': {nbShares: 7, averageBuyingPrice: 714.2857142857143, currentValPerShare: 718}
  }
  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 16026, deposited: 15000, withdrawn: 0, scpis})
})

test('holding calculation with withdrawal', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":3000,"nbShares":-2,"scpi":"SCPI_A"},
  ]

  const scpis = {'SCPI_A': {nbShares: 8, averageBuyingPrice: 1000, currentValPerShare: 1100}}
  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 8800, deposited: 10000, withdrawn: 3000, scpis})
})

test('holding calculation with withdrawal - 2', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"},
    {"id":2,"amount":3000,"nbShares":-2,"scpi":"SCPI_A"},
  ]
  
  const scpis = {
    'SCPI_A': {nbShares: 8, averageBuyingPrice: 1000, currentValPerShare: 1100}, 
    'SCPI_B': {nbShares: 7, averageBuyingPrice: 714.2857142857143, currentValPerShare: 718}
  }
  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 13826, deposited: 15000, withdrawn: 3000, scpis})
})

test('holding calculation with erroneous withdrawal', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":-11,"scpi":"SCPI_A"},
  ]
  
  expect(holdingDetails(transactions, scpi)).toStrictEqual(Error("Cannot withdraw 11 out of 10 shares for transaction 1"))
})

test('holding calculation with withdrawal - valorisation back to 0', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"},
    {"id":2,"amount":3000,"nbShares":-2,"scpi":"SCPI_A"},
    {"id":3,"amount":3000,"nbShares":-8,"scpi":"SCPI_A"},
    {"id":4,"amount":7700,"nbShares":-7,"scpi":"SCPI_B"},
  ]

  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 0, deposited: 15000, withdrawn: 13700, scpis: {}})
})

test('capital appreciation for test example', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]

  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"}
  ]

  const holding = holdingDetails(transactions, scpi) as HoldingDetails
  console.log(holding)
  expect(capitalAppreciation(holding)).toStrictEqual(1026)
})

test('capital appreciation with withdrawal', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"},
    {"id":2,"amount":1500,"nbShares":-2,"scpi":"SCPI_A"},
  ]
  
  const holding = holdingDetails(transactions, scpi) as HoldingDetails
  expect(capitalAppreciation(holding)).toStrictEqual(826)
})

test('capital appreciation for with withdrawal > deposited', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"},
    {"id":2,"amount":17000,"nbShares":-7,"scpi":"SCPI_B"},
  ]
  
  const holding = holdingDetails(transactions, scpi) as HoldingDetails
  console.log(holding)
  expect(capitalAppreciation(holding)).toStrictEqual(1000)
})
