'use client';
import { client } from "@/app/client";
import { trafficManagementSystem } from "@/app/constants/constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ShowDriverCases from "@/app/components/ShowDriverCases";

const Company = () => {
    const account = useActiveAccount();
    const router = useRouter();
    const [driverAddress, setDriverAddress] = useState("");
    const [isModalOpenAddress, setIsModalOpenAddress] = useState(false);
    
    useEffect(() => {
        if (!account) {
        router.push("/");
        }
    }, [account, router]);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    });

    const { data: driverProfileByAddress, isPending } = useReadContract({
        contract,
        method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
        params: [driverAddress]
    });

    const handleSearch = () => {
        if (driverAddress.trim()) {
            setIsModalOpenAddress(true); // Ensure license modal stays closed
        } else {
            alert("Please enter driver wallet address");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Welcome, Company Portal!
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    You have restricted access and can only view driver profiles.
                </p>

                <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Search by Driver Address
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Driver Address"
                        value={driverAddress}
                        onChange={(e) => setDriverAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className="w-full mt-3 py-2 text-sm font-bold text-white bg-blue-600 rounded focus:outline-none hover:bg-blue-700"
                >
                    View Driver Profile
                </button>

                {isModalOpenAddress && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden shadow rounded-lg border w-full max-w-4xl mx-4 p-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Driver Profile</h2>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpenAddress(false)}
                            >
                                Close
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center my-4">
                            {driverProfileByAddress?.profileImage ? (
                                <img
                                    src={driverProfileByAddress?.profileImage}
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
                                {driverProfileByAddress?.firstName} {driverProfileByAddress?.lastName}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {driverProfileByAddress?.verified ? (
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
                                        {driverProfileByAddress?.dateOfBirth}
                                    </dd>
                                </div>
                                {/* Repeat for other fields like Gender, Contact Number, etc. */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfileByAddress?.gender}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfileByAddress?.contactNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.emailAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">National ID (NID)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.nid}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Residential Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.residentialAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.licenseNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Expiry Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.licenseExpiryDate}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.vehicleType}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle IN</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.vehicleIN}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Plate Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.vehiclePlateNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tax Token Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfileByAddress?.taxTokenNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Image</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfileByAddress?.licenseImage ? (
                                            <img
                                                src={driverProfileByAddress?.licenseImage}
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
                                        {driverProfileByAddress?.taxTokenImage ? (
                                            <img
                                                src={driverProfileByAddress?.taxTokenImage}
                                                alt="Tax Token"
                                                className="max-w-full h-auto rounded-md border"
                                            />
                                        ) : (
                                            <span>No Tax Token Image</span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                            </div>
                            <ShowDriverCases
                                walletAddress={driverAddress}
                            />
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Company;
