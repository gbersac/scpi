import React, { useContext } from 'react'

import { initializeApp } from "firebase/app"
import { getDatabase, Database, ref, DatabaseReference, onValue, off } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAlNcuzjG0tVfPWFcDPP293GEv6LEVse1E",
  authDomain: "test2-fd6d9.firebaseapp.com",
  databaseURL: "https://test2-fd6d9-default-rtdb.firebaseio.com",
  projectId: "test2-fd6d9",
  storageBucket: "test2-fd6d9.appspot.com",
  messagingSenderId: "419591498174",
  appId: "1:419591498174:web:dcb06a36f48c4270e8b1ef"
}

function dbReturnToList<A>(input: { [s: string]: A }): (A & {name: string})[] {
  return Object.entries(input)
    .map(a => {
      return {name: a[0], ...a[1]}
    })
}

type SCPIDataDB = {
  currentValPerShare: number
}
export type SCPIData = {
  name: string
  currentValPerShare: number
}

export class FirebaseClient {
  private db: Database
  private scpiRef: DatabaseReference
  private transactionRef: DatabaseReference

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app)
    this.scpiRef = ref(this.db, 'scpiData')
    this.transactionRef = ref(this.db, 'transaction')
  }

  listenToSCPIData(successCallback: (s: SCPIData[]) => any, errorCallback: () => any): () => any {
    const unsubscribe = onValue( this.scpiRef,
      (snapshot) => successCallback(dbReturnToList<SCPIDataDB>(snapshot.val())),
      errorCallback
    )
    return unsubscribe
  }

  getTransactions() {
    
  }

}

const FirebaseContext = React.createContext(new FirebaseClient())
export default function useFirebase(): FirebaseClient {
  return useContext(FirebaseContext)
}