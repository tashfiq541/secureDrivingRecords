'use client';
import { useActiveAccount, useReadContract } from "thirdweb/react";
import SingleCase from "./SingleCase";
import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { trafficManagementSystem } from "../constants/constant";

type WalletAddress = {
    walletAddress: string;
}


const ShowDriverCases = ({walletAddress}: WalletAddress) => {
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    })

    const { data: allCases, isPending: isCasesPending } = useReadContract({
    contract,
    method: "function getCasesByDriver(address _driverAddress) view returns ((address policeOfficer, string policeOfficerFirstName, string policeOfficerLastName, string policeOfficerID, string licenseNumber, string vehiclePlateNumber, string vehicleType, string caseType, uint256 fineAmount, bool resolved)[])",
    params: [walletAddress]
  });
    
    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100">
            <div className="flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-full max-w-4xl">
                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-slate-800 text-lg font-semibold">
                        Cases
                    </h5>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {!isCasesPending && allCases && (
                            allCases.length > 0 ? (
                                allCases.map((singleCase, index) => (
                                    <SingleCase
                                        key={index}
                                        walletAddress={walletAddress}
                                        driverCase={singleCase}
                                        index={index}
                                    />  
                                ))
                            ) : (
                                <p>There are no cases</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowDriverCases;