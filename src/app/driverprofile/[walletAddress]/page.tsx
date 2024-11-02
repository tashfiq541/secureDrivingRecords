'use client';
import { client } from "@/app/client";
import { trafficManagementSystem } from "@/app/constants/constant";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ShowDriverCases from "@/app/components/ShowDriverCases";

const DriverProfile = () => {
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
    
    const { data: driverProfile, isPending: isDriverProfilePending } = useReadContract({
    contract,
    method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
    params: [account?.address as string]
    });

     if (isDriverProfilePending) {
        return <div>Loading...</div>;
    }

    if (!driverProfile) {
        return <div>No profile data found.</div>;
    }
    
    return (
        <div>
        <div className="bg-gray-100 overflow-hidden shadow rounded-lg border flex flex-col items-center justify-center">
            <div className="bg-white max-w-4xl w-full px-4 py-5 sm:px-6 flex flex-col items-center">
                {/* Profile Image, Name, and Verified Status */}
                <div className="flex flex-col items-center mb-4">
                {driverProfile.profileImage ? (
                    <img
                    src={driverProfile.profileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full"
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
            </div>
            
            <div className="bg-white border-t border-gray-200 w-full max-w-4xl px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                {/* Display driver details excluding licenseImage and taxTokenImage */}
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverProfile.dateOfBirth}
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverProfile.gender}
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
                </dl>
            </div>
            </div>
            <ShowDriverCases
                walletAddress={account?.address as string}
            />
            </div>
        
    )
}

export default DriverProfile;