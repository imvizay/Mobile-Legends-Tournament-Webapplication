import React from 'react'
import AppRoutesConfig from './routes/AppRoutesConfig';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutesConfig/>  
      <ToastContainer/>
    </>
  )
}

export default App