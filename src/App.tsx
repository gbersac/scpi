import React, { useEffect, useState } from 'react'
import './App.css';
import { holdingDetails } from './Holding';
import useFirebase, { SCPIData, Transaction } from './useFirebase';

function Error(props: {message: string}): JSX.Element { 
  return <div>{props.message}</div>
}

function SCPI(props: { list: SCPIData[]}): JSX.Element {
  return <table>
    {props.list.map(v => <tr>{v.name}</tr>)}
  </table>
}

function App(): JSX.Element {
  const [err, setErr] = useState<string | null>(null)
  const [scpi, setScpi] = useState<SCPIData[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const firebaseClient = useFirebase()

  useEffect(() => {
    const close1 = firebaseClient.listenToSCPIData(setScpi, () => setErr("Connection to firebase db error"))
    const close2 = firebaseClient.listenToTransactionData(setTransactions, () => setErr("Connection to firebase db error"))
    return () => {
      close1()
      close2()
    }
  }, [])

  console.log("SCPI:", JSON.stringify(scpi))
  console.log("transactions:", JSON.stringify(transactions))
  console.log("holding:", JSON.stringify(holdingDetails(transactions, scpi)))

  return (
    <div className="App">
      {err ? <Error message={err}/> : <SCPI list={scpi} /> }
    </div>
  );
}

export default App;
