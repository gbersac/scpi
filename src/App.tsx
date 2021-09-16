import React, { useEffect, useState } from 'react'
import './App.css';
import useFirebase, { SCPIData } from './useFirebase';

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
  const firebaseClient = useFirebase()

  useEffect(() => {
    return firebaseClient.listenToSCPIData(setScpi, () => setErr("Connection to firebase db error"))
  }, [])
  return (
    <div className="App">
      {err ? <Error message={err}/> : <SCPI list={scpi} /> }
    </div>
  );
}

export default App;
