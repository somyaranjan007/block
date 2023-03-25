import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import abi from "./Transactions.json"

const Smartcontract = () => {

	const [userAccount, setUserAccount] = useState("")
	const [showMessage, setShowMessage] = useState(false)
	const [allMessage, setAllMessage] = useState([])
	const [userData, setUserData] = useState({receiver: "", amount: "", message: ""})

	// contract abi and contract address
	const contractAddress = "0x862C20EA84B4265a8476A9a44b4b741AcD5a87F0"
	const ABI = abi.abi

	// ethereum object
	const { ethereum } = window

	// 0x862C20EA84B4265a8476A9a44b4b741AcD5a87F0


	// This function for accessing our smart contract
	const accessContract = () => {
		const provider = new ethers.providers.Web3Provider(ethereum)
		const signer = provider.getSigner()
		const transactionContract = new ethers.Contract(contractAddress, ABI, signer)

		return transactionContract
	}


	// This function for connecting the wallet in your website
	const walletConnect = async () => {
		try {
			if(!ethereum) return alert("Please install metamask on your device")
			else {
				const requestAccount = await ethereum.request({ method: "eth_requestAccounts" }) 

				setUserAccount(requestAccount[0])
				setShowMessage(false) 
				setAllMessage([])
			}
		} catch (err) {
			console.log(err)
		}
	}


	// This function for handling input 
	const handleInput = (e) => {
		const name = e.target.name
		const value = e.target.value 

		setUserData({...userData, [name]: value})
	}


	// This function for sending ehtereum to another address
	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			if(!ethereum) return alert("Please install metamask!")
			else {
				const transactionContract = accessContract()
				const {receiver, amount, message} = userData
				const parseAmmount = ethers.utils.parseEther(amount)

				// This is for sending ehtereum to another address
				await ethereum.request({
					method: "eth_sendTransaction",
					params: [
						{
							from: userAccount,
							to: receiver,
							gas: "0x5208",
							value: parseAmmount._hex
						}
					]
				})

				// This is for adding transaction to block chain
				const transactionHash = await transactionContract.addToBlockchain(receiver, parseAmmount, message)
				await transactionHash.wait()
				alert("Your transaction is successfull")

			}
		}catch (err) {
			console.log(err) 
		}
	}



	// This function show all message
	const handleMessage = async () => {
		try {
			if(!ethereum) return alert("Please install metamask!")
			else {
				const userAddress = ethers.utils.getAddress(userAccount)

				const transactionContract = accessContract()
				const allTransaction = await transactionContract.getAllTransactions()

				const transaction = allTransaction.filter((items) => items.receiver === userAddress)
				setAllMessage(transaction)
			}
		} catch (err) {
			console.log(err)
		}
	}


	// this useEffect calls the handle message function 
	useEffect(() => {
		if(userAccount) {
			handleMessage()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAccount, showMessage])

	return (
		<div className="p-5"> 
			<button onClick={walletConnect} className="bg-blue-500 mb-2 px-5 py-2 text-white font-semibold rounded">Connect Wallet</button>
			{
				userAccount &&
				<div>
					<p className="bg-blue-300 p-2 rounded text-white font-semibold">Active user {userAccount}</p>
					<form action="" onSubmit={handleSubmit} className="mt-4">
						<input 
				            type="text" 
				            name="receiver" 
				            placeholder="Enter receiver address" 
				            onChange={handleInput}
				            required
				            className="border border-blue-300 p-2 rounded mb-2 outline-none"
				        /> 
				        <br />

				       	<input 
				            type="number" 
				            name="amount"
				            step="0.00001"
				            placeholder="Enter amount" 
				            onChange={handleInput}
				            required
				            className="border border-blue-300 p-2 rounded mb-2 outline-none"
			          	/> 
				        <br />

				        <input 
				            type="text" 
				            name="message" 
				            placeholder="Enter your message"
				            onChange={handleInput} 
				            required
				            className="border border-blue-300 p-2 rounded mb-2 outline-none"
				        /> 
				        <br />

				        <button className="bg-blue-500 px-5 py-2 text-white font-semibold rounded">Send Ethereum</button>
					</form>

					<div>
						<p className="bg-blue-300 p-2 mt-4 mb-2 rounded text-white font-semibold">check all messages</p>
						<button onClick={() => setShowMessage(!showMessage)} className="bg-blue-500 px-5 py-2 text-white font-semibold rounded">{showMessage ? "Hide Message" : "Show Message"}</button>
						{
							showMessage &&
							<div className="border border-blue-300 p-2 rounded mt-4">
								{
									allMessage.length > 0 &&
									allMessage.map((items, index) => {
										return (
											<div key={index} className="bg-blue-300 p-2 mb-2 rounded text-white font-semibold"> 
												<span>Message - {items.message}</span>
											</div>
										)
									})
								}
							</div>
						}
					</div>
				</div>
			}
		</div>
	)
}

export default Smartcontract