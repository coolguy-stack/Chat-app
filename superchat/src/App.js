import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB9ZwkmzxyRjeZrQYDM77dBtrctXhR9sqw",
  authDomain: "chatapp-4c10b.firebaseapp.com",
  projectId: "chatapp-4c10b",
  storageBucket: "chatapp-4c10b.appspot.com",
  messagingSenderId: "80051142826",
  appId: "1:80051142826:web:c43abbf2fed7784a00d0d3",
  measurementId: "G-3YFMZNN3M2"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior:'smooth'});
  }
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} message={msg} />)}
  
        <div ref={dummy}></div>  

      </main>
      <form onSubmit={sendMessage}>
        <input value ={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type = "submit">*</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className ={'message ${messageClass}'}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
