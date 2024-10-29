'use client';
import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { trafficManagementSystem } from "../constants/constant";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import AllNonverifiedDrivers from "../components/AllNonverifiedDrivers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyDriver = () => {
    const account = useActiveAccount();
    const router = useRouter();

    useEffect(() => {
        if (!account) {
        router.push("/");
        }
    }, [account, router]);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    })
    
    const { data: nonVerifiedDrivers, isPending: isNonVerifiedDriversPending } = useReadContract({
        contract,
        method: "function getNonVerifiedDrivers() view returns (address[])",
        params: []
    });
    
    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100">
            <div className="flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-full max-w-4xl">
                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-slate-800 text-lg font-semibold">
                        All Non-Verified Drivers
                    </h5>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {!isNonVerifiedDriversPending && nonVerifiedDrivers && (
                            nonVerifiedDrivers.length > 0 ? (
                                nonVerifiedDrivers.map((nonVerifiedDriver) => (
                                    <AllNonverifiedDrivers
                                        key={nonVerifiedDriver}
                                        driverAddress= {nonVerifiedDriver}
                                    />
                                ))
                            ) : (
                                    <p>No Driver</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default VerifyDriver;