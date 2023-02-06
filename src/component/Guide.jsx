import React from "react";
import { BsFillCaretRightFill } from "react-icons/bs";

const GuideCard = ({ color, title, icon, subtitle }) => (
    <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
        <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
            {icon}
        </div>
        <div className="ml-5 flex flex-col flex-1">
            <h3 className="mt-2 text-white text-lg">{title}</h3>
            <p className="mt-1 text-white text-sm md:w-9/12">
                {subtitle}
            </p>
        </div>
    </div>
);

const Guide = () => (
    <div className="flex flex-col md:flex-row w-full justify-center items-center gradient-bg-services">
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
                <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                    How to use
                    <br />
                    PolyVote
                </h1>
                <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis possimus atque dolorum, quae delectus eius nesciunt voluptates est consectetur tenetur nulla numquam facilis asperiores at harum tempore voluptatem adipisci! Beatae.
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-start items-center">
                <GuideCard
                    color="bg-[#2952E3]"
                    title="Connect Wallet"
                    icon={<BsFillCaretRightFill fontSize={21} className="text-white" />}
                    subtitle="Connect your wallet. You can use Metamask or other injected wallet. Make sure connect on Mumbai Network"
                />
                <GuideCard
                    color="bg-[#8945F8]"
                    title="Register as Voter"
                    icon={<BsFillCaretRightFill fontSize={21} className="text-white" />}
                    subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis possimus atque dolorum, quae delectus eius"
                />
                <GuideCard
                    color="bg-[#f545b4]"
                    title="Vote Candidate"
                    icon={<BsFillCaretRightFill fontSize={21} className="text-white" />}
                    subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis possimus atque dolorum, quae delectus eius"
                />
                <GuideCard
                    color="bg-[#45f885]"
                    title="Mint NFT"
                    icon={<BsFillCaretRightFill fontSize={21} className="text-white" />}
                    subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis possimus atque dolorum, quae delectus eius"
                />
            </div>
        </div>
    </div>
);

export default Guide;