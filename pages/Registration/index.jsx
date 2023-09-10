import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
const Election_ABI = require("../../utils/Election.json");
import CryptoJS from 'crypto-js';
import NotInit from "../../components/NotInit";

// Encrypt data using AES encryption
function encryptData(data, secretKey) {
	const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
	return ciphertext;
};

// Decrypt data using AES decryption
function decryptData(ciphertext, secretKey) {
	const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
	const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedData;
};

export default function Registration() {

	// Contract Address & ABI
	const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";
	const contractABI = Election_ABI.abi;

	const [isLoading, setisLoading] = useState(false);
	const [elStarted, setelStarted] = useState(false);
	const [elEnded, setelEnded] = useState(false);
	const [voterName, setvoterName] = useState("");
	const [voterPhone, setvoterPhone] = useState("");
	const [currentVoter, setcurrentVoter] = useState({
		address: undefined,
		name: null,
		phone: null,
		hasVoted: false,
		isVerified: false,
		isRegistered: false,
	});
	const [secretKey, setsecretKey] = useState(process.env.NEXT_PUBLIC_SECRET_KEY);
	const { data: signer } = useSigner();
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
			checkStart();
		}
	}, [signer]);

	const electionInstance = new ethers.Contract(contractAddress, contractABI, signer);

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

	const checkStart = async () => {
		try {
			const start = await electionInstance.getStart();
			setelStarted(start);
			const end = await electionInstance.getEnd();
			setelEnded(end);
			if (start === true) {
				fetchCurrentVoter();
			}
		} catch (error) {
			console.error(error);
		}
	}

	const fetchCurrentVoter = async () => {
		try {
			const voter = await electionInstance.voterDetails(address);

			const decryptedName = decryptData(voter.name, secretKey);
			const decryptedPhone = decryptData(voter.phone, secretKey);

			setcurrentVoter({
				address: voter.voterAddress,
				name: decryptedName,
				phone: decryptedPhone,
				hasVoted: voter.hasVoted,
				isVerified: voter.isVerified,
				isRegistered: voter.isRegistered,
			});

		} catch (error) {
			console.error(error);
		}
	}

	const registerAsVoter = async () => {
		try {
			const encryptedName = encryptData(voterName, secretKey);
			const encryptedPhone = encryptData(voterPhone, secretKey);
			const registTx = await electionInstance.registerAsVoter(encryptedName, encryptedPhone);

			setisLoading(true);
			await registTx.wait();

			window.location.reload();
			setisLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	const updateVoterName = (event) => {
		setvoterName(event.target.value);
	}

	const updateVoterPhone = (event) => {
		setvoterPhone(event.target.value);
	}

	return (
		<>
			{isDisconnected ?
				(<>
					<div className="min-h-screen">
						<div className="loader">
                            <p className="text-white font-semibold text-lg mt-1"> Please connect your wallet </p>
                        </div>
					</div>
				</>) :
				(<>
					<div className="min-h-screen">
						<div className="gradient-bg-services">
							{!elStarted && !elEnded ? (
								<>
									<NotInit />
								</>
							) : (
								<>
									<div className='flex w-full justify-center items-center'>
										<div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
											<div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
												<div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
													<h5 className='text-xl sm:text-3xl text-white text-gradient py-1'>Register to vote</h5>
													<div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
														<form>
															<div className="mb-3">
																<label className={`form-label text-white`}>
																	Account Address
																	<input
																		className={`form-control my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism`}
																		type="text"
																		value={currentAccount}
																	/>{" "}
																</label>
															</div>
															<div className="mb-3">
																<label className={`form-label text-white`}>
																	Name
																	<input
																		className={`form-control my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism`}
																		type="text"
																		placeholder="eg. Ava"
																		value={voterName}
																		onChange={updateVoterName}
																	/>{" "}
																</label>
															</div>
															<div className="mb-3">
																<label className={`form-label text-white`}>
																	Phone number <span style={{ color: "tomato" }}>*</span>
																	<input
																		className={`form-control my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism`}

																		type="number"
																		placeholder="eg. 628231234567"
																		value={voterPhone}
																		onChange={updateVoterPhone}
																	/>
																</label>
															</div>
															<button
																type='button'
																className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer"
																disabled={
																	voterPhone.length !== 13 ||
																	currentVoter.isVerified || isLoading
																}
																onClick={registerAsVoter}
															>
																{currentVoter.isRegistered
																	? "Update"
																	: "Register"}
															</button>
														</form>
													</div>
												</div>
											</div>
											<br />
											<div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
												<div className="flex flex-1 justify-start items-center flex-col mf:mr-10">
													{loadCurrentVoter(
														currentVoter,
														currentVoter.isRegistered
													)}

													<br />
													<h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
														Note
													</h1>
													<p className="text-left mt-5 text-red-400 font-light md:w-9/12 w-11/12 text-base">
														Make sure your account address and Phone number are correct.
														Admin might not approve your account if the provided Phone number nub does not matches the account address registered in admins catalogue.
													</p>
												</div>
											</div>
										</div>

									</div>
								</>
							)}

						</div>

					</div>
				</>)}

		</>
	);
}

const companyCommonStyles =
	"min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

export function loadCurrentVoter(voter, isRegistered) {
	return (
		<>
			<div
				className='flex flex-1 justify-start items-center flex-col mf:mr-10'
			>
				<h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
					Your Registered Info
				</h1>
				<br />
				<div className='sm:flex flex-1 justify-start items-center flex-col mf:mr-10 sm:flex-col'>
					<table className={`table text-center border-separate border-spacing-2 border border-slate-500 ${companyCommonStyles}`}>
						<tr>
							<th className='border border-slate-600'>Account Address</th>
							<td className='border border-slate-600 '>
								<div className="overflow-x-auto max-w-[200px] md:max-w-[none]">
									{voter.address}
								</div>
							</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Name</th>
							<td className='border border-slate-600'>{voter.name}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Phone</th>
							<td className='border border-slate-600'>{voter.phone}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Voted</th>
							<td className='border border-slate-600'>{voter.hasVoted ? "True" : "False"}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Verification</th>
							<td className='border border-slate-600'>{voter.isVerified ? "True" : "False"}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Registered</th>
							<td className='border border-slate-600'>{voter.isRegistered ? "True" : "False"}</td>
						</tr>
					</table>
				</div>
			</div>
		</>
	);
}