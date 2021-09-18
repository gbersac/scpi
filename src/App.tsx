import React, { useEffect, useState } from 'react'
import './App.css';
import { HoldingDetails, holdingDetails, holdingDetailsInitialValue, isHoldingDetails } from './Holding';
import { SCPIData, Transaction, FirebaseClient } from './FirebaseClient';
import firebaseConfig from "./firebase.json"

function Error(props: {message: string}): JSX.Element { 
  return <div>{props.message}</div>
}

function Dashboard(props: { list: SCPIData[], transactions: Transaction[], holding: HoldingDetails}): JSX.Element {
  return <div>
    <h1>Votre patrimoine immobilier</h1>
    <div style={{display: "flex", justifyContent: "space-around"}}>
      <div>Valeur totale<br/>{props.holding.valorisation}€</div>
      <div>Plus value<br/>{props.holding.valorisation - props.holding.deposited}€</div>
      <div>Valorisation du capital<br/>
        {props.holding.deposited ? Math.round((props.holding.valorisation / props.holding.deposited - 1) * 10000) / 100 : "-"} %
      </div>
      <div>Revenus nets versés<br/>{props.holding.withdrawn}€</div>
    </div>
    <br/>
    <br/>

    <div style={{display: "flex", justifyContent: "space-around"}}><table>
      <thead>
          <tr>
            <th>Id</th>
            <th>Montant</th>
            <th>SCPI</th>
            <th>Statut de la transaction</th>
          </tr>
      </thead>
      <tbody>
        {props.transactions.map(t =>
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.amount}</td>
            <td>{t.scpi}</td>
            <td>Confirmé</td>
          </tr>
        )}
      </tbody>
    </table></div>
  </div>
}

function App(): JSX.Element {
  let [err, setErr] = useState<string | null>(null)
  const [scpi, setScpi] = useState<SCPIData[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    try {
      const firebaseClient = new FirebaseClient(firebaseConfig)
      const close1 = firebaseClient.listenToSCPIData(setScpi, () => setErr("Connection to firebase db error"))
      const close2 = firebaseClient.listenToTransactionData(setTransactions, () => setErr("Connection to firebase db error"))
      return () => {
        close1()
        close2()
      }
    } catch (exp: any) {
      setErr(exp.toString())
    }
  }, [])

  let holding = holdingDetailsInitialValue
  if (transactions.length > 0 && scpi.length > 0) {
    const details = holdingDetails(transactions, scpi)
    isHoldingDetails(details) ? holding = details : err = details.message
  }

  return (
    <div className="App">
      {err ? <Error message={err}/> : <Dashboard list={scpi} transactions={transactions} holding={holding} /> }
    </div>
  )
}

export default App;
