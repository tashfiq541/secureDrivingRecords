'use client';
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_Key, API_Secret, trafficManagementSystem } from '@/app/constants/constant'
import { TransactionButton, useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { useRouter } from 'next/navigation';


const Register = () => {
  const account = useActiveAccount();
  const router = useRouter();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: trafficManagementSystem,
  })

  const { data: driver, isPending } = useReadContract({
    contract,
    method: "function getDriverProfile(address _driverAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string emailAddress, string nid, string residentialAddress, string licenseNumber, string licenseExpiryDate, string licenseType, string licenseImage, string vehicleType, string vehicleIN, string vehiclePlateNumber, string taxTokenNumber, string taxTokenImage, string profileImage, bool verified))",
    params: [account?.address as string]
  });

  useEffect(() => {
    if (driver?.firstName) {
      alert("transaction completed.")
      router.push(`/driverprofile/${account?.address}`);
    }
  })

  const [_firstName, setFirstName] = useState('');
  const [_lastName, setLastName] = useState('');
  const [_dateOfBirth, setDateOfBirth] = useState('');
  const [_gender, setGender] = useState('');
  const [_contactNumber, setContactNumber] = useState('');
  const [_emailAddress, setEmailAddress] = useState('');
  const [_nid, setNid] = useState('');
  const [_residentialAddress, setResidentialAddress] = useState('');
  const [_licenseNumber, setLicenseNumber] = useState('');
  const [_licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [_licenseType, setLicenseType] = useState('');
  const [_licenseImage, setLicenseImage] = useState<File | null>(null);
  const [_vehicleType, setVehicleType] = useState('');
  const [_vehicleIN, setVehicleIN] = useState('');
  const [_vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [_taxTokenNumber, setTaxTokenNumber] = useState('');
  const [_taxTokenImage, setTaxTokenImage] = useState<File | null>(null);
  const [_profileImage, setProfileImage] = useState<File | null>(null);
  const [licenseImageUrl, setLicenseImageUrl] = useState('');
  const [taxTokenImageUrl, setTaxTokenImageUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: sendTransaction } = useSendTransaction();

  const uploadToPinata = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: API_Key,
        pinata_secret_api_key: API_Secret,
        "Content-Type": "multipart/form-data",
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (_licenseImage) {
        const licenseImgUrl = await uploadToPinata(_licenseImage);
        setLicenseImageUrl(licenseImgUrl);
        console.log('License Image URL:', licenseImgUrl);
      }

      if (_taxTokenImage) {
        const taxTokenImgUrl = await uploadToPinata(_taxTokenImage);
        setTaxTokenImageUrl(taxTokenImgUrl);
        console.log('Tax Token Image URL:', taxTokenImgUrl);
      }

      if (_profileImage) {
        const profileImgUrl = await uploadToPinata(_profileImage);
        setProfileImageUrl(profileImgUrl);
        console.log('Profile Image URL:', profileImgUrl);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Unable to upload images to Pinata");
    }finally {
      setIsLoading(false);
    }
  };

  const handleTransactionComplete = () => {
    setIsModalOpen(false);
    alert("Driver Profile Created");
  }

  return (
    <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader">Loading...</div>
        </div>
      )}
      <div className="text-center mb-16">
        <h4 className="text-gray-800 text-base font-semibold mt-6">
          Create Driver Profile
        </h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">First Name</label>
            <input 
              name="_firstName" 
              type="text" 
              value={_firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter first name" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
            <input 
              name="_lastName" 
              type="text" 
              value={_lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter last name" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Date of Birth</label>
            <input 
              name="_dateOfBirth" 
              type="date" 
              value={_dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Gender</label>
            <select 
              name="_gender" 
              value={_gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Contact Number</label>
            <input 
              name="_contactNumber" 
              type="tel" 
              value={_contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter contact number" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Email Address</label>
            <input 
              name="_emailAddress" 
              type="email" 
              value={_emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter email address" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">NID</label>
            <input 
              name="_nid" 
              type="text" 
              value={_nid}
              onChange={(e) => setNid(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter National ID" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Residential Address</label>
            <input 
              name="_residentialAddress" 
              type="text" 
              value={_residentialAddress}
              onChange={(e) => setResidentialAddress(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter address" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">License Number</label>
            <input 
              name="_licenseNumber" 
              type="text" 
              value={_licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter license number" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">License Expiry Date</label>
            <input 
              name="_licenseExpiryDate" 
              type="date" 
              value={_licenseExpiryDate}
              onChange={(e) => setLicenseExpiryDate(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">License Type</label>
            <select 
              name="_licenseType" 
              value={_licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
            >
              <option value="">Select License Type</option>
              <option value="Professional">Professional</option>
              <option value="Non-Professional">Non-Professional</option>
            </select>
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">License Image</label>
            <input 
              name="_licenseImage" 
              type="file" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setLicenseImage(e.target.files[0]);
                }
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
            
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle Type</label>
            <select 
              name="_vehicleType" 
              value={_vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
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
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle IN</label>
            <input 
              name="_vehicleIN" 
              type="text" 
              value={_vehicleIN}
              onChange={(e) => setVehicleIN(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter vehicle identification number" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle Plate Number</label>
            <input 
              name="_vehiclePlateNumber" 
              type="text" 
              value={_vehiclePlateNumber}
              onChange={(e) => setVehiclePlateNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter vehicle plate number" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Tax Token Number</label>
            <input 
              name="_taxTokenNumber" 
              type="text" 
              value={_taxTokenNumber}
              onChange={(e) => setTaxTokenNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter tax token number" 
            />
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Tax Token Image</label>
            <input 
              name="_taxTokenImage" 
              type="file" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setTaxTokenImage(e.target.files[0]);
                }
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
            
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Profile Image</label>
            <input 
              name="_profileImage" 
              type="file" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setProfileImage(e.target.files[0]);
                }
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
            
          </div>
        </div>

        <div className="!mt-12">
          <button
            type="submit"
            className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Create
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push(`/registerpolice/${account?.address}`)}
          className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
        >
          Register as Police Officer
        </button>
      </div>

      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"> {/* Darker overlay for better visibility */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h4 className="text-lg font-semibold mb-4 text-black">Confirm Profile Creation</h4>
          <p className="text-gray-700">Are you sure you want to create this driver profile?</p> {/* Improved text color */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setIsModalOpen(false); // Close modal on cancel
              }}
              className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
              <TransactionButton
                transaction={() => 
                prepareContractCall({
                      contract,
                      method: "function createDriverProfile(string _firstName, string _lastName, string _dateOfBirth, string _gender, string _contactNumber, string _emailAddress, string _nid, string _residentialAddress, string _licenseNumber, string _licenseExpiryDate, string _licenseType, string _licenseImage, string _vehicleType, string _vehicleIN, string _vehiclePlateNumber, string _taxTokenNumber, string _taxTokenImage, string _profileImage)",
                      params: [_firstName, _lastName, _dateOfBirth, _gender, _contactNumber, _emailAddress, _nid, _residentialAddress, _licenseNumber, _licenseExpiryDate, _licenseType, licenseImageUrl, _vehicleType, _vehicleIN, _vehiclePlateNumber, _taxTokenNumber, taxTokenImageUrl, profileImageUrl]
                    })
                } 
                onError={(error) => alert(`Error:${error}`)}
                onTransactionConfirmed={async () => handleTransactionComplete}
            >
              Confirm
            </TransactionButton>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Register;

