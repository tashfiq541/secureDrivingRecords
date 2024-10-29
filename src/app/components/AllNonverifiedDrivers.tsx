'use client';

import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { trafficManagementSystem } from "../constants/constant";
import { useState } from "react";
import { useRouter } from "next/navigation";

type NonVerifiedProps = {
    driverAddress: string;
}

const AllNonverifiedDrivers = ({ driverAddress }: NonVerifiedProps) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    })

    const { mutate: sendTransaction } = useSendTransaction();
    
    const { data: driverProfile, isPending } = useReadContract({
        contract,
        method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
        params: [driverAddress]
    });

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!driverProfile) {
        return <div>No profile data found.</div>;
    }

    const onClick = () => {
        const transaction = prepareContractCall({
        contract,
        method: "function verifyDriver(address _driverAddress)",
        params: [driverAddress]
        });
        sendTransaction(transaction);
    }
    
    return (
         <div className="flex items-center justify-between pb-3 pt-3 last:pb-0">
                    <div className="flex items-center gap-x-3">
                    <img
                        src={driverProfile.profileImage}
                        alt={driverProfile.firstName}
                        className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                    />
                    <div>
                        <h6 className="text-slate-800 font-semibold">
                        {driverProfile.firstName} {driverProfile.lastName}
                        </h6>
                        <p className="text-slate-600 text-sm">
                        License Number: {driverProfile.licenseNumber}
                        </p>
                    </div>
                    </div>
                    <button 
                        className="rounded-md bg-cyan-600 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-cyan-700 active:bg-cyan-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        View Profile
            </button>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden shadow rounded-lg border w-full max-w-4xl mx-4 p-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Driver Profile</h2>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center my-4">
                            {driverProfile.profileImage ? (
                                <img
                                    src={driverProfile.profileImage}
                                    alt="Profile"
                                    className="rounded-full"
                                    width={120}
                                    height={120}
                                />
                            ) : (
                                <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span>No Image</span>
                                </div>
                            )}
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                                {driverProfile.firstName} {driverProfile.lastName}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {driverProfile.verified ? (
                                    <span className="text-green-500 font-semibold">Verified</span>
                                ) : (
                                    <span className="text-red-500 font-semibold">Not Verified</span>
                                )}
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-200 w-full px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                {/* Display driver details */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile.dateOfBirth}
                                    </dd>
                                </div>
                                {/* Repeat for other fields like Gender, Contact Number, etc. */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile.gender}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile.contactNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.emailAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">National ID (NID)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.nid}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Residential Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.residentialAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.licenseNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Expiry Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.licenseExpiryDate}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.vehicleType}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle IN</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.vehicleIN}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Plate Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.vehiclePlateNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tax Token Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile.taxTokenNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Image</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile.licenseImage ? (
                                            <img
                                                src={driverProfile.licenseImage}
                                                alt="License"
                                                className="max-w-full h-auto rounded-md border"
                                            />
                                        ) : (
                                            <span>No License Image</span>
                                        )}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tax Token Image</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile.taxTokenImage ? (
                                            <img
                                                src={driverProfile.taxTokenImage}
                                                alt="Tax Token"
                                                className="max-w-full h-auto rounded-md border"
                                            />
                                        ) : (
                                            <span>No Tax Token Image</span>
                                        )}
                                    </dd>
                                </div>
                                <div className="flex justify-center mt-4">
                                <button
                                    className="rounded-md bg-green-600 py-2 px-4 text-white text-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={async () => {
                                            await onClick();
                                            setIsModalOpen(false);
                                            alert("Please wait for transaction to complete.")
                                            router.push('/verifydriver');
                                    }}
                                    >
                                    Verify
                                </button>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
                </div>
    )
}

export default AllNonverifiedDrivers;