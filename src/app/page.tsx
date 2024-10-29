"use client";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { getContract } from "thirdweb";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { trafficManagementSystem } from "./constants/constant";
import { useEffect, useState } from "react";

export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: trafficManagementSystem,
  })

  const { data: government, isPending: isGovernmentPrnding } = useReadContract({
    contract,
    method: "function government() view returns (address)",
    params: []
  });

  const { data: driverProfile, isPending: isDriverPending } = useReadContract({
    contract,
    method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
    params: [account?.address as string]
  });

  const { data: policeProfile, isPending: isPolicePending } = useReadContract({
    contract,
    method: "function getPoliceProfile(address _policeAddress) view returns ((string firstName, string lastName, string nid, string badgeNumber, string profileImage))",
    params: [account?.address as string]
  });

  const { data: companies, isPending } = useReadContract({
    contract,
    method: "function getApprovedRideSharingCompanies() view returns (address[])",
    params: []
  });

  const isApprovedCompany = companies?.includes(account?.address as string);

  useEffect(() => {
  // Redirect based on the user's role or approval status
  if (account?.address && government && account.address === government) {
    router.push(`/admin/${account.address}`);
  } else if (driverProfile?.firstName) {
    router.push(`/driverprofile/${account?.address}`);
  } else if (policeProfile?.firstName) {
    router.push(`/policeprofile/${account?.address}`);
  } else if (isApprovedCompany) {
    router.push(`/company/${account?.address}`);
  }
}, [account, government, driverProfile, policeProfile, isApprovedCompany, router]);

  const handleRegisterClick = () => {
    if (account) {
      router.push(`/register/${account?.address}`);
    }
  };

  return (
    <section className="bg-white text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Welcome to Secure Driving Records
            <br className="hidden lg:inline-block"/>Your Trusted Web3 Solution
          </h1>
          <p className="mb-8 leading-relaxed">
            Manage driver profiles and resolve traffic violation cases seamlessly. Police officers can file cases against drivers, while authorized ride-sharing companies can access verified driver records. <span className="font-bold">All interactions are secure and require MetaMask wallet connection for authentication.</span> 
          </p>
          <div className="flex justify-center">
            <button 
              onClick={handleRegisterClick}
              className={`inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none rounded text-lg 
                ${!account ? 'opacity-50 cursor-default' : 'hover:bg-indigo-600 cursor-pointer'}`}
              disabled={!account}
            >
              Register
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded" alt="chain and lock image" src="/images/chain_lock.png" />
        </div>
      </div>
    </section>

  );
}
