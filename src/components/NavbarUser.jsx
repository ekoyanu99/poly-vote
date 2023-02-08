import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import {FaRegistered} from "react-icons/fa";

export default function NavbarUser() {
    const [toggleMenu, setToggleMenu] = React.useState(false);
    return (

        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <a href="/"><p className="text-cyan-400">PolyVote</p></a>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                <li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
                <li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
                <li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
                {/* <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                    Connect Wallet
                </li> */}
            </ul>

            <div className="flex relative">
                {!toggleMenu && (
                    <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                )}
                {toggleMenu && (
                    <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                )}
                {toggleMenu && (
                    <ul
                        className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
                        <li className="mx-4 cursor-pointer"><a href="/Registration">Registration</a></li>
                        <li className="mx-4 cursor-pointer"><a href="/Voting">Voting</a></li>
                        <li className="mx-4 cursor-pointer"><a href="/Results">Results</a></li>
                        {/* <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                            Connect Wallet
                        </li> */}
                    </ul>
                )}
            </div>
        </nav>
    );
}