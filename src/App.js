import './App.css';
import { ethers } from "ethers";
import simpleStorageABI from "./abi.json";
import AionABI from "./AionABI.json";
import React, { useState, useEffect } from 'react';


function App() {
const addressSimpleStorage = "0x25B4eDbEAD64C33fDC229BAd7c67D1a11B5A83c9";
const addressAionContract ="0x206D2eDc962931a9831bf24a3d20c021119096c1";

const [Var, setVar] = useState(0);
const [getNumber, setGetNumber] = useState(0);
const [blockNumber, setBlockNumber] = useState(0)
const [latestBlockNumber, setLatestBlockNumber] = useState(0);

let provider;
let contract;
let signer;
let gasPrice;
let gasLimit;
let data;
let AionContractInstance;
async function ConnectWallet(){
  provider = new ethers.providers.Web3Provider(window.ethereum)

// // MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);
}


ConnectWallet();

async function AccountInitialisation(){

  signer = provider.getSigner();
  contract = new ethers.Contract("0x25B4eDbEAD64C33fDC229BAd7c67D1a11B5A83c9",simpleStorageABI, signer);
  AionContractInstance = new ethers.Contract(addressAionContract,AionABI,signer);
console.log(contract);
console.log(AionContractInstance);
}

AccountInitialisation();

async function getStoredNumber(){
 let reply = await contract.storeNum();
 let number = parseInt(reply, 10);
 setGetNumber(number);
 console.log(reply);
}

const handleChange = e => {
  setVar(e.target.value);
}
const handleChange2 = e => {
  setBlockNumber(e.target.value);
}

async function submitTransaction() {
 let reply = await contract.ScheduleTxn(blockNumber,Var,50000,10,false,{value:900000});
}

async function executeFunction(){

   data = await contract.data();
   let AionId = await AionContractInstance.AionID();
   let reply = await AionContractInstance.executeStoreCall(blockNumber,addressSimpleStorage,addressSimpleStorage,50000,10,data,AionId,false);
   console.log(reply);
}

async function updateBlockNumber () {
  let blockNumber = await provider.getBlock("latest");
  setLatestBlockNumber(blockNumber.number);
  console.log(blockNumber);
  console.log(latestBlockNumber);
}


useEffect(() => {
  const interval = setInterval(() => updateBlockNumber(), 4500);
  return () => {
    clearInterval(interval);
  };
}, []);



  return (
    <div className="App">
      <header className="App-header">
        <h2> Latest Block Number : {latestBlockNumber} </h2>        
        <div className='wholePanel'>
        <div className="Client Panel">
        <h3>Client Panel</h3>
       
        Block Number <input type="number" name="blockNumber" value={blockNumber} onChange={handleChange2}  />  <br/>
        Number to Store <input type="number" name="storeNumber" value={Var} onChange={handleChange} />

        <br/> <br/>
        <button onClick={submitTransaction} > Schedule </button>
      
        </div>
        <div className="Admin Panel" >
        <h3>Admin Panel</h3>
        <button onClick={executeFunction}> Exectue </button>
        </div>
        </div>
      
        <div className="storedNumberPanel">
          <button onClick={getStoredNumber}>Get Stored Number</button> 
          <label> : {getNumber}</label>
        </div>
      </header>
    </div>
  );
}

export default App;
