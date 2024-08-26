"use client";  // This marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import './globals.css';

const fetchData = async () => {
  try {
    const response = await fetch('https://node-express-api-dot-ixc2024-433215.as.r.appspot.com/api/balance/0e78506e-f4ec-4374-9d3b-bcb74f9e87c3'); // Adjust this endpoint as needed
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
        console.log(data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

export default function Home() {
  const [bankingInfo, setBankingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startTime = performance.now(); // Start timing

    const getData = async () => {
      try {
        const data = await fetchData();
        setBankingInfo(data);
        setLoading(false);
        const endTime = performance.now(); // End timing
        console.log(`Load time: ${endTime - startTime} ms`);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    getData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bankingInfo) {
    return <div>Error: Banking information not available.</div>;
  }

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString(undefined, options);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="w-full max-w-5xl bg-blue-600 text-white flex justify-between items-center p-4 rounded-lg mb-6">
        <div className="text-lg font-semibold">
          User Account: {bankingInfo.wallet.unique.unique_id}
        </div>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition">
          Sign Out
        </button>
      </header>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">{`Today: ${currentDate}`}</h2>
      </div>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Balance</h2>
        <p className="text-2xl">{`RM ${bankingInfo.wallet.balance}`}</p>
      </div>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <h2 className="text-xl font-semibold mb-4">Sent Contracts</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">Contract ID</th>
              <th className="py-2 px-4">Sender Name</th>
              <th className="py-2 px-4">Receiver Name</th>
              <th className="py-2 px-4">Currency</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Sent Contracts */}
            {bankingInfo.wallet.unique.sentContracts.map((transaction) => (
              <tr key={transaction.contract_id} className="border-t">
                <td className="py-2 px-4">{transaction.contract_id}</td>
                <td className="py-2 px-4">{transaction.sender_unique_id}</td>
                <td className="py-2 px-4">{transaction.receiver_unique_id}</td>
                <td className="py-2 px-4">{transaction.currency}</td>
                <td className="py-2 px-4">{transaction.amount}</td>
                <td className="py-2 px-4">{transaction.status}</td>
                <td className="py-2 px-4">{new Date(transaction.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-xl font-semibold mb-4">Received Contracts</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">Contract ID</th>
              <th className="py-2 px-4">Sender Name</th>
              <th className="py-2 px-4">Receiver Name</th>
              <th className="py-2 px-4">Currency</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Received Contracts */}
            {bankingInfo.wallet.unique.receivedContracts.map((transaction) => (
              <tr key={transaction.contract_id} className="border-t">
                <td className="py-2 px-4">{transaction.contract_id}</td>
                <td className="py-2 px-4">{transaction.sender_unique_id}</td>
                <td className="py-2 px-4">{transaction.receiver_unique_id}</td>
                <td className="py-2 px-4">{transaction.currency}</td>
                <td className="py-2 px-4">{transaction.amount}</td>
                <td className="py-2 px-4">{transaction.status}</td>
                <td className="py-2 px-4">{new Date(transaction.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

