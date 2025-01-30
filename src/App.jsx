import  { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import './App.css';


function App() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contractAddress = '';

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function handleDeposit() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
          throw new Error('Please enter a valid deposit amount.');
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const amountInWei = ethers.parseEther(depositAmount.toString());
        const tx = await contract.deposit(amountInWei);
        await tx.wait();
        setDepositAmount('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }
  async function handleWithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
          throw new Error('Please enter a valid withdrawal amount.');
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const amountInWei = ethers.parseEther(withdrawAmount.toString());
        const tx = await contract.withdraw(amountInWei);
        await tx.wait();
        setWithdrawAmount('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getContractBalance() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getBalance();
        setContractBalance(ethers.formatEther(balance));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
    <div>
      <h2>An Ethereum mini Wallet</h2>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}
        </p>}
    
      <div className='App'>
        <label htmlFor="">Deposit Eth</label>
        <input type="text" id="" placeholder='Input Amount' onChange={(e) => setDepositAmount(e.target.value)} disabled={loading}/>
        <button type="submit" onClick={handleDeposit} disabled={loading}>Deposit Amount </button>
      </div>

      <div className='App'>
        <label htmlFor="">Withdraw Eth</label>
        <input type="text" id="" placeholder='Input Amount' onChange={(e) => setWithdrawAmount(e.target.value)} disabled={loading}/>
        <button type="submit" onClick={handleWithdraw} disabled={loading} >{loading ? 'Withdrawing...' : 'Withdraw'} </button>
      </div>

      <div className='App'>
        <label htmlFor="">Contract Balance</label>
        <button type="submit" onClick={getContractBalance} disabled={loading}>{loading ? 'Fetching...' : 'Get Balance'} </button>
        <p>Balance: {contractBalance} ETH</p>

      </div>

        </div>
    </>
  )
}

export default App
