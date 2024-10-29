'use client';
import { client } from "@/app/client";
import { trafficManagementSystem, API_Key, API_Secret } from "@/app/constants/constant";
import { useEffect, useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import axios from 'axios';
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { useRouter } from "next/navigation";

const RegisterPolice = () => {
    const account = useActiveAccount();
    const router = useRouter();
    
    const contract = getContract({
    client: client,
    chain: sepolia,
    address: trafficManagementSystem,
    })

    const { data: police, isPending } = useReadContract({
        contract,
        method: "function getPoliceProfile(address _policeAddress) view returns ((string firstName, string lastName, string dateOfBirth, string gender, string contactNumber, string residentialAddress, string emailAddress, string nid, string policeID, string designation, string profileImage))",
        params: [account?.address as string]
    });

    useEffect(() => {
        if (police?.firstName) {
            alert("transaction completed.")
            router.push(`/policeprofile/${account?.address}`)
        }
    })
    
    const [_firstName, setFirstName] = useState('');
    const [_lastName, setLastName] = useState('');
    const [_dateOfBirth, setDateOfBirth] = useState("");
    const [_gender, setGender] = useState("");
    const [_contactNumber, setContactNumber] = useState("");
    const [_residentialAddress, setResidentialAddress] = useState("");
    const [_emailAddress, setEmailAddress] = useState("");
    const [_nid, setNid] = useState('');
    const [_policeID, setPoliceID] = useState("");
    const [_designation, setDesignation] = useState("");
    const [_profileImage, setProfileImage] = useState<File | null>(null);
    const [_code, setCode] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        alert("Please wait couple of seconds. You will get confirm button.")
        try {
            if (_code !== 'police1971@') {
                alert('Invalid registration code. Please enter the correct code.');
                return;
            }

            if (_profileImage) {
                const profileImgUrl = await uploadToPinata(_profileImage);
                setProfileImageUrl(profileImgUrl);
                console.log('Profile Image URL:', profileImgUrl);
            }

            setIsModalOpen(true);
            } catch (error) {
            console.error("Error uploading image:", error);
            alert("Unable to upload image to Pinata");
            }
    };
    
    const { mutate: sendTransaction } = useSendTransaction();

    const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function createPoliceProfile(string _firstName, string _lastName, string _dateOfBirth, string _gender, string _contactNumber, string _residentialAddress, string _emailAddress, string _nid, string _policeID, string _designation, string _profileImage, string _code)",
      params: [_firstName, _lastName, _dateOfBirth, _gender, _contactNumber, _residentialAddress, _emailAddress, _nid, _policeID, _designation, profileImageUrl, _code]
    });
    sendTransaction(transaction);
  }
    
    return (
        <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
            <div className="text-center mb-16">
                <h4 className="text-gray-800 text-base font-semibold mt-6">
                Register Police Officer
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
                    <label className="text-gray-800 text-sm mb-2 block">Police ID</label>
                    <input 
                    name="_policeID" 
                    type="text" 
                    value={_policeID}
                    onChange={(e) => setPoliceID(e.target.value)}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
                    placeholder="Enter police ID" 
                    />
                    </div>
                    
                    <div>
                    <label className="text-gray-800 text-sm mb-2 block">Designation</label>
                    <input 
                    name="_designation" 
                    type="text" 
                    value={_designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
                    placeholder="Enter your designation" 
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

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Registration Code</label>
                    <input 
                    name="_code" 
                    type="password" 
                    value={_code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
                    placeholder="Enter registration code" 
                    />
                </div>
                </div>

                <div className="!mt-12">
                <button
                    type="submit"
                    className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                    Register
                </button>
                </div>
            </form>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h4 className="text-lg font-semibold mb-4 text-black">Confirm Registration</h4>
                    <p className="text-gray-700">Are you sure you want to register this police officer?</p>
                    <div className="flex justify-end mt-4">
                    <button
                        onClick={() => {
                        setIsModalOpen(false);
                        }}
                        className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                        await onClick();
                                    setIsModalOpen(false);
                                    alert("please wail until transaction completed")
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default RegisterPolice;