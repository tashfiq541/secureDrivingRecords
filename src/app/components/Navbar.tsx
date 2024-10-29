'use client';
import { client } from '@/app/client'
import { useState } from 'react';
import { getContract, prepareContractCall } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { ConnectButton, lightTheme, useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { trafficManagementSystem } from '../constants/constant';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
    const account = useActiveAccount();
    const router = useRouter();

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    })
    const { mutate: sendTransaction } = useSendTransaction();

    const { data: driverProfile, isPending: isDriverProfilePending } = useReadContract({
    contract,
    method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
    params: [account?.address as string]
    });

    const { data: policeProfile, isPending: isPoliceProfilePending } = useReadContract({
        contract,
        method: "function getPoliceProfile(address _policeAddress) view returns ((string firstName, string lastName, string nid, string badgeNumber, string profileImage))",
        params: [account?.address as string]
    });

    const { data: appointedPoliceOfficers, isPending: isAppointedPolicePending } = useReadContract({
    contract,
    method: "function getAppointedPoliceOfficers() view returns (address[])",
    params: []
    });
    
    const isAppointedOfficer = appointedPoliceOfficers?.includes(account?.address as string);


    return (
        <header className="bg-white text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-3 text-xl">S-DrivingRecords</span>
                </a>
                <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
                    {account && driverProfile?.firstName && (
                        <Link href={`/driverprofile/${account?.address}`}>Profile</Link>
                    )}
                    {account && policeProfile?.firstName && (
                        <Link href={`/policeprofile/${account?.address}`}>Profile</Link>
                    )}
                </nav>

                {isAppointedOfficer && (
                    <button
                        onClick={() => router.push('/verifydriver')}
                        className="py-2 px-4 mr-3 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Verify Driver
                    </button>
                )}
                
                <ConnectButton
                    client={client}
                    theme={lightTheme()}
                    detailsButton={{
                        style: {
                            maxHeight: '50px'
                        }
                    }}
                />
            </div>
        </header>
    )
}

export default Navbar;