'use client';
import { client } from "@/app/client";
import { trafficManagementSystem } from "@/app/constants/constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import ShowDriverCases from "@/app/components/ShowDriverCases";

const Admin = () => {
    const account = useActiveAccount();
    const router = useRouter();

    const [policeOfficerAddress, setPoliceOfficerAddress] = useState("");
    const [rideShareCompanyAddress, setRideShareCompanyAddress] = useState("");
    const [viewDriverAddress, setViewDriverAddress] = useState("");
    const [viewPoliceAddress, setViewPoliceAddress] = useState("");
    const [isModalOpenDriver, setIsModalOpenDriver] = useState(false);
    const [isModalOpenPolice, setIsModalOpenPolice] = useState(false);



    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    });

    useEffect(() => {
        if (!account) {
        router.push("/");
        }
    }, [account, router]);

    const { data: driverProfile, isPending: isDriverProfilePending } = useReadContract({
    contract,
    method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
    params: [viewDriverAddress]
    });

    const { data: policeProfile, isPending } = useReadContract({
    contract,
    method: "function getPoliceProfile(address _policeAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string residentialAddress, string emailAddress, string nid, string policeID, string designation, string profileImage))",
    params: [viewPoliceAddress]
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Admin Panel</h1>

                <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Appoint a Police Officer</label>
                    <input
                        type="text"
                        placeholder="Enter Police Officer Address"
                        value={policeOfficerAddress}
                        onChange={(e) => setPoliceOfficerAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <TransactionButton
                        transaction={() =>
                            prepareContractCall({
                            contract,
                            method: "function appointPoliceOfficer(address _policeAddress)",
                            params: [policeOfficerAddress]
                            })
                        }
                        onError={(error) => alert(`Error: ${error.message}`)}
                        onTransactionConfirmed={async () => alert("Police officer appointed.")}
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                            backgroundColor: "#1D4ED8", // Deep indigo color
                            color: "white",
                            padding: "0.75rem 0",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow
                            transition: "background-color 0.2s ease-in-out",
                        }}
                        
                    >
                        Appoint Police Officer
                    </TransactionButton>
                </div>

                <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Approve Ride-sharing Company</label>
                    <input
                        type="text"
                        placeholder="Enter Company Address"
                        value={rideShareCompanyAddress}
                        onChange={(e) => setRideShareCompanyAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <TransactionButton
                        transaction={() =>
                            prepareContractCall({
                                contract,
                                method: "function approveRideSharingCompany(address _companyAddress)",
                                params: [rideShareCompanyAddress]
                            })
                        }
                        onError={(error) => alert(`Error: ${error.message}`)}
                        onTransactionConfirmed={async () => alert("Company Approved")}
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                            backgroundColor: "#047857", // Deep green color
                            color: "white",
                            padding: "0.75rem 0",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow
                            transition: "background-color 0.2s ease-in-out",
                        }}
                        
                    >
                        Approve Company
                    </TransactionButton>
                </div>

                <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">View Driver</label>
                    <input
                        type="text"
                        placeholder="Enter Driver Address"
                        value={viewDriverAddress}
                        onChange={(e) => setViewDriverAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => setIsModalOpenDriver(true)}
                        className="w-full mt-3 py-2 text-sm font-bold text-white bg-blue-600 rounded focus:outline-none hover:bg-blue-700"
                    >
                        View Driver
                    </button>
                </div>

                {/* View Police Officer */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">View Police Officer</label>
                    <input
                        type="text"
                        placeholder="Enter Police Officer Address"
                        value={viewPoliceAddress}
                        onChange={(e) => setViewPoliceAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                        onClick={() => setIsModalOpenPolice(true)}
                        className="w-full mt-3 py-2 text-sm font-bold text-white bg-red-600 rounded focus:outline-none hover:bg-red-700"
                    >
                        View Police Officer
                    </button>
                </div>
            </div>
            {isModalOpenDriver && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden shadow rounded-lg border w-full max-w-4xl mx-4 p-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Driver Profile</h2>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpenDriver(false)}
                            >
                                Close
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center my-4">
                            {driverProfile?.profileImage ? (
                                <img
                                    src={driverProfile?.profileImage}
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
                                {driverProfile?.firstName} {driverProfile?.lastName}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {driverProfile?.verified ? (
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
                                        {driverProfile?.dateOfBirth}
                                    </dd>
                                </div>
                                {/* Repeat for other fields like Gender, Contact Number, etc. */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile?.gender}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile?.contactNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.emailAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">National ID (NID)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.nid}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Residential Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.residentialAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.licenseNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Expiry Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.licenseExpiryDate}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.vehicleType}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle IN</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.vehicleIN}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicle Plate Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.vehiclePlateNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tax Token Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {driverProfile?.taxTokenNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">License Image</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {driverProfile?.licenseImage ? (
                                            <img
                                                src={driverProfile?.licenseImage}
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
                                        {driverProfile?.taxTokenImage ? (
                                            <img
                                                src={driverProfile?.taxTokenImage}
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
                            walletAddress={viewDriverAddress}
                        />
                    </div>
                    
                </div>
            )}

            {isModalOpenPolice && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden shadow rounded-lg border w-full max-w-4xl mx-4 p-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Driver Profile</h2>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpenPolice(false)}
                            >
                                Close
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center my-4">
                            {policeProfile?.profileImage ? (
                                <img
                                    src={policeProfile?.profileImage}
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
                                {policeProfile?.firstName} {policeProfile?.lastName}
                            </h3>
                            <p className="text-sm leading-6 font-medium text-gray-900 mt-1">Designation: {policeProfile?.designation}</p>
                            <p className="text-sm leading-6 font-medium text-gray-900 mt-1">Police ID: { policeProfile?.policeID }</p>
                        </div>
                        
                        <div className="border-t border-gray-200 w-full px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                {/* Display driver details */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {policeProfile?.dateOfBirth}
                                    </dd>
                                </div>
                                {/* Repeat for other fields like Gender, Contact Number, etc. */}
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {policeProfile?.gender}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {policeProfile?.contactNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {policeProfile?.emailAddress}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">National ID (NID)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {policeProfile?.nid}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Residential Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {policeProfile?.residentialAddress}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
