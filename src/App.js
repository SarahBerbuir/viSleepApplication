import Header from './components/Header'
import Footer from './components/Footer'
import MainComp from './components/MainComp';
import './App.css';
import React, {useEffect} from 'react';

function App() {
  /*useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);*/
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  return (
    <>
      <Header/>
      <MainComp />
      <Footer/>
    </>
  )
}

export default App;
