import { SCPIData, Transaction } from "./FirebaseClient";

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
  scpis: {[scpi: string]: {nbShares: number, averageBuyingPrice: number, currentValPerShare: number}}
}
export const holdingDetailsInitialValue: () => HoldingDetails = () => {
  return {valorisation: 0, deposited: 0, withdrawn: 0, scpis: {}}
}
export function isHoldingDetails(toCheck: any): toCheck is HoldingDetails {
  return typeof toCheck === "object" && 
    (toCheck as HoldingDetails).valorisation !== undefined && toCheck.deposited !== undefined && toCheck.withdrawn !== undefined
}

export function holdingDetails(transactions: Transaction[], scpis: SCPIData[]): HoldingDetails | Error {
  const findSCPIByName = (name: string) => scpis.find(s => s.name === name)
  return transactions.reduce<HoldingDetails | Error>(
      (acc, t) => {
        // find the corresponding scpi
        if (acc instanceof Error)
          return acc
        const scpi = findSCPIByName(t.scpi)
        if (scpi === undefined)
          return Error(`Cannot find scpi ${t.scpi}`)

        // update the holding details for each scpi
        if (acc.scpis[t.scpi] === undefined)
          acc.scpis[t.scpi] = {
            nbShares: t.nbShares, 
            averageBuyingPrice: t.amount / t.nbShares, 
            currentValPerShare: scpi.currentValPerShare
          }
        else if (t.nbShares > 0) {
          const old = acc.scpis[t.scpi]
          acc.scpis[t.scpi] = {
            nbShares: old.nbShares + t.nbShares, 
            averageBuyingPrice: (old.nbShares * old.averageBuyingPrice + t.amount) / (old.nbShares + t.nbShares),
            currentValPerShare: scpi.currentValPerShare
          }
        }
        else if (t.nbShares < 0) {
          const old = acc.scpis[t.scpi]
          if (-t.nbShares > old.nbShares)
            return Error(
              `Cannot withdraw ${-t.nbShares} out of ${old.nbShares} shares for transaction ${t.id}`
            )
          else if (old.nbShares === -t.nbShares) 
            delete acc.scpis[t.scpi]
          else
            acc.scpis[t.scpi] = {
              nbShares: old.nbShares + t.nbShares, 
              averageBuyingPrice: old.averageBuyingPrice,
              currentValPerShare: scpi.currentValPerShare
            }
        }

        // update the state of the holding after this transaction
        return {
          valorisation: acc.valorisation + scpi.currentValPerShare * t.nbShares,
          deposited: t.nbShares > 0 ? acc.deposited + t.amount : acc.deposited,
          withdrawn: t.nbShares < 0 ? acc.withdrawn + t.amount : acc.withdrawn,
          scpis: acc.scpis
        }
      },
      holdingDetailsInitialValue()
    )
}

export function capitalAppreciation(holding: HoldingDetails): number | null {
  if (holding.deposited === 0) return null
  return Object.entries(holding.scpis).reduce(
    (acc, [_, scpiDetails]) => {
      return acc + 
        (scpiDetails.currentValPerShare * scpiDetails.nbShares) - 
        (scpiDetails.averageBuyingPrice * scpiDetails.nbShares)
    },
    0
  )
}
