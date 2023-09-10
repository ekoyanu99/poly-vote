import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
const Election_ABI = require("../../utils/Election.json");

export default function Navbar() {

	// Contract Address & ABI
	const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";		
	const contractABI = Election_ABI.abi;

	const [toggleMenu, settoggleMenu] = useState(false);
	const [isAdmin, setisAdmin] = useState(false);
	const { data: signer } = useSigner()
	const [currentAccount, setcurrentAccount] = useState(null);

	const { address, isDisconnected } = useAccount({
		onDisconnect() {
			setcurrentAccount(null);
		},
	});

	useEffect(() => {
		checkIfWalletConnected();
	}, [address]);

	useEffect(() => {
		if (signer) {
			checkAdmin();
		}
	}, [signer]);

	const checkIfWalletConnected = async () => {
		try {
			if (!isDisconnected) {
				setcurrentAccount(address);
			} else {
				setcurrentAccount(null);
			}
		} catch (error) {
			console.error(error);
		}
	}

	const checkAdmin = async () => {
		// Check if signer is available
		if (signer) {
			const electionInstance = new ethers.Contract(contractAddress, contractABI, signer);

			try {
				const admin = await electionInstance.getAdmin();

				if (address === admin) {
					setisAdmin(true);
				} else {
					setisAdmin(false);
				}
			} catch (error) {
				console.error("Error checking admin:", error);
			}
		} else {
			console.warn("Signer not available. Ensure that a wallet is connected.");
		}
	}

	return (
		<nav className="w-full flex md:justify-center justify-between items-center p-4">
			<div className="md:flex-[0.5] flex-initial justify-center items-center">
				<a href="/"><p className="text-cyan-400">PolyVote</p></a>
			</div>
			<ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
				{isAdmin ?
					<>
						<li className="mx-4 cursor-pointer"><a href="/Verification">Verification</a></li>
						<li className="mx-4 cursor-pointer"><a href="/AddCandidate">Add Candidate</a></li>
						<li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
						<li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
						<li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
					</>
					: <>
						<li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
						<li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
						<li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
					</>
				}
				<li className="mx-4 cursor-pointer"><ConnectButton></ConnectButton></li>
			</ul>

			<div className="flex relative">
				{!toggleMenu && (
					<HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => settoggleMenu(true)} />
				)}
				{toggleMenu && (
					<ul
						className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
					>
						<AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => settoggleMenu(false)} />
						{isAdmin ?
							<>
								<li className="mx-4 cursor-pointer"><a href="/Verification">Verification</a></li>
								<li className="mx-4 cursor-pointer"><a href="/AddCandidate">Add Candidate</a></li>
								<li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
								<li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
								<li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
							</>
							: <>
								<li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
								<li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
								<li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
							</>
						}
						<li className="mx-4 cursor-pointer"><ConnectButton></ConnectButton></li>
					</ul>
				)}
			</div>
		</nav>
	);
}
