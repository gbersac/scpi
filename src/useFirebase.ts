import React, { useContext } from 'react'

import { initializeApp } from "firebase/app"
import { getDatabase, Database, ref, DatabaseReference, onValue } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAlNcuzjG0tVfPWFcDPP293GEv6LEVse1E",
  authDomain: "test2-fd6d9.firebaseapp.com",
  databaseURL: "https://test2-fd6d9-default-rtdb.firebaseio.com",
  projectId: "test2-fd6d9",
  storageBucket: "test2-fd6d9.appspot.com",
  messagingSenderId: "419591498174",
  appId: "1:419591498174:web:dcb06a36f48c4270e8b1ef"
}

/**
 * Convert an object whose properties are a list of (key -> object of type A) 
 * to a list of object of type A with the property (`keyName` -> key)
 * @param input List of object of type A in the form of an object
 * @param keyName the name of the property to add to the object of type `A`
 * @returns A list of object of type A with the property (`keyName` -> key)
 */
function dbReturnToList<A, K extends string>(input: { [s: string]: A } | undefined, keyName: K): (A & {[P in K]: string})[] {
  if (input === undefined)
    return []
  return Object.entries(input)
    .map(a => {
      const keyAsProperty = { [keyName]: a[0] } as { [P in K]: string }
      return {...keyAsProperty, ...a[1]}
    })
}

type SCPIDataDB = {
  currentValPerShare: number
}
export type SCPIData = {
  name: string
  currentValPerShare: number
}

type TransactionDB = {
  amount: number
  nbShares: number
  scpi: string
}
export type Transaction = {
  id: number
  amount: number
  nbShares: number
  scpi: string
}

export class FirebaseClient {
  private db: Database
  private scpiRef: DatabaseReference
  private transactionRef: DatabaseReference

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app)
    this.scpiRef = ref(this.db, 'scpiData')
    this.transactionRef = ref(this.db, 'transactions')
  }

  listenToSCPIData(successCallback: (s: SCPIData[]) => any, errorCallback: () => any): () => any {
    return onValue( this.scpiRef,
      (snapshot) => successCallback(dbReturnToList<SCPIDataDB, "name">(snapshot.val(), "name")),
      errorCallback
    )
  }

  listenToTransactionData(successCallback: (s: Transaction[]) => any, errorCallback: () => any): () => any {
    return onValue( this.transactionRef,
      (snapshot) => successCallback(
        dbReturnToList<TransactionDB, "id">(snapshot.val(), "id")
          .map(v => {return {...v, id: parseInt(v.id)}})
      ),
      errorCallback
    )    
  }

}

const FirebaseContext = React.createContext(new FirebaseClient())
export default function useFirebase(): FirebaseClient {
  return useContext(FirebaseContext)
}
