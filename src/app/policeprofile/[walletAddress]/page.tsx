'use client';
import { client } from "@/app/client";
import { trafficManagementSystem } from "@/app/constants/constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";

const PoliceProfile = () => {
    const account = useActiveAccount();
    const router = useRouter();

    const { mutate: sendTransaction } = useSendTransaction();

    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [caseType, setCaseType] = useState("");
    const [fineAmount, setFineAmount] = useState("");

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

    const { data: policeProfile, isPending } = useReadContract({
    contract,
    method: "function getPoliceProfile(address _policeAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string residentialAddress, string emailAddress, string nid, string policeID, string designation, string profileImage))",
    params: [account?.address as string]
  });

    const onClick = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function fileCase(string _licenseNumber, string _vehiclePlateNumber, string _vehicleType, string _caseType, uint256 _fineAmount)",
      params: [licenseNumber, vehiclePlateNumber, vehicleType, caseType, BigInt(fineAmount)]
    });
        await sendTransaction(transaction);
        alert("Please wait for transaction to complete.");
            // Clear the input fields
            setLicenseNumber("");
            setVehiclePlateNumber("");
            setVehicleType("");
            setCaseType("");
        setFineAmount("");
  }

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!policeProfile) {
        return <div>No profile data found.</div>;
    }

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full px-4 py-5 sm:px-6 flex flex-col items-center">
                {/* Profile Image, Name, and Badge Number */}
                <div className="flex flex-col items-center mb-4">
                    {policeProfile.profileImage ? (
                        <img
                            src={policeProfile.profileImage}
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
                        {policeProfile.firstName} {policeProfile.lastName}
                    </h3>
                    <p className="text-sm leading-6 font-medium text-gray-900 mt-1">Designation: {policeProfile.designation}</p>
                    <p className="text-sm leading-6 font-medium text-gray-900 mt-1">Police ID: { policeProfile.policeID }</p>
                </div>
            </div>

            <div className="border-t border-gray-200 w-full max-w-4xl px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {/* Display police details */}
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.dateOfBirth}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.gender}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.contactNumber}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Residential Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.residentialAddress}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.emailAddress}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">National ID (NID)</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {policeProfile.nid}
                        </dd>
                    </div>
                </dl>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border mt-6 w-full max-w-4xl">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        File a Case Against a Driver
                    </h3>
                    
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                License Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    type="text"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Vehicle Plate Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    type="text"
                                    value={vehiclePlateNumber}
                                    onChange={(e) => setVehiclePlateNumber(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Vehicle Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <select
                                    value={vehicleType}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Car">Car</option>
                                    <option value="Motorbike">Motorbike</option>
                                    <option value="Microbus">Microbus</option>
                                    <option value="Pickup">Pickup</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Three Wheeler">Three Wheeler</option>
                                    <option value="Truck">Truck</option>
                                </select>
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Case Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <select
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                >
                                    <option value="">Select Case Type</option>
                                    <option value="Speeding">Speeding</option>
                                    <option value="Wrong Parking">Wrong Parking</option>
                                    <option value="Drunk Driving">Drunk Driving</option>
                                    <option value="Reckless Driving">Reckless Driving</option>
                                    <option value="Wrong Route">Wrong Route</option>
                                    <option value="Running a Red Light">Running a Red Light</option>
                                    <option value="Driving Without a Helmet">Driving Without a Helmet</option>
                                    <option value="Driving Without Seatbelt">Driving Without Seatbelt</option>
                                    <option value="Driving Without Documents">Driving Without Documents</option>
                                    <option value="Others">Others</option>
                                </select>
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Fine Amount (wei)
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    type="number"
                                    value={fineAmount}
                                    onChange={(e) => setFineAmount(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="flex justify-end p-4">
                    <button
                        onClick={async () => {
                            await onClick();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Submit Case
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PoliceProfile;