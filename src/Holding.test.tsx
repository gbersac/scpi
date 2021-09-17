import { holdingDetails } from './Holding';

test('holding calculation for default db case', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"}
  ]
  
  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 16026, deposited: 15000, withdrawn: 0})
});

test('holding calculation with withdrawal', () => {
  const scpi = [
    {"name":"SCPI_A","currentValPerShare":1100},
    {"name":"SCPI_B","currentValPerShare":718}
  ]
  
  const transactions = [
    {"id":0,"amount":10000,"nbShares":10,"scpi":"SCPI_A"},
    {"id":1,"amount":5000,"nbShares":7,"scpi":"SCPI_B"},
    {"id":1,"amount":3000,"nbShares":-2,"scpi":"SCPI_A"},
  ]
  
  expect(holdingDetails(transactions, scpi)).toStrictEqual({valorisation: 13826, deposited: 15000, withdrawn: 3000})
});
