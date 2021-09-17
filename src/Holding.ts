import { SCPIData, Transaction } from "./useFirebase";

export type TransactionDetails = {
  id: number
  amount: number
  nbShares: number
  scpi: string
  pricePerShare: number
}

export type HoldingDetails = {
  valorisation: number
  deposited: number
  withdrawn: number
}
const holdingDetailsInitialValue: HoldingDetails = {valorisation: 0, deposited: 0, withdrawn: 0}

export function holdingDetails(transactions: Transaction[], scpis: SCPIData[]): HoldingDetails | Error {
  const findSCPIByName = (name: string) => scpis.find(s => s.name === name)
  return transactions.reduce<HoldingDetails | Error>(
      (acc, t) => {
        if (acc instanceof Error)
          return acc
        const scpi = findSCPIByName(t.scpi)
        if (scpi === undefined)
          return Error(`Cannot find scpi ${t.scpi}`)
        return {
          valorisation: acc.valorisation + scpi.currentValPerShare * t.nbShares,
          deposited: t.nbShares > 0 ? acc.deposited + t.amount : acc.deposited,
          withdrawn: t.nbShares < 0 ? acc.withdrawn + t.amount : acc.withdrawn,
        }
      },
      holdingDetailsInitialValue
    )
}
