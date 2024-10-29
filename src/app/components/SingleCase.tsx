'use client';

import { getContract, prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { trafficManagementSystem } from "../constants/constant";

type DriverCase = {
    policeOfficer: string;
    policeOfficerFirstName: string;
    policeOfficerLastName: string;
    policeOfficerID: string;
    licenseNumber: string;
    vehiclePlateNumber: string;
    vehicleType: string;
    caseType: string;
    fineAmount: bigint;
    resolved: boolean;
}

type CaseProps = {
    driverCase: DriverCase;
    index: number;
}

const SingleCase = ({ driverCase, index }: CaseProps) => {
    const statusText = driverCase.resolved ? "Resolved" : "Pending";
    const statusStyle = driverCase.resolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

    const { mutate: sendTransaction } = useSendTransaction();

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: trafficManagementSystem,
    })

    return (
        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Case Type: <span className="text-blue-600">{driverCase?.caseType}</span>
                </h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
                    {statusText}
                </span>
            </div>

            <div className="space-y-2">
                <div>
                    <span className="text-sm font-medium text-gray-600">Vehicle Type:</span>
                    <span className="text-gray-800 ml-2">{driverCase?.vehicleType}</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Vehicle Plate:</span>
                    <span className="text-gray-800 ml-2">{driverCase?.vehiclePlateNumber}</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Officer ID:</span>
                    <span className="text-gray-800 ml-2">{driverCase?.policeOfficerFirstName} { driverCase?.policeOfficerLastName }</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Officer ID:</span>
                    <span className="text-gray-800 ml-2">{driverCase?.policeOfficerID}</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Fine Amount:</span>
                    <span className="text-gray-800 ml-2">{driverCase?.fineAmount.toString()} wei</span>
                </div>
            </div>
            <div className="mt-4">
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract,
                        method: "function payFine(uint256 _caseIndex) payable",
                        params: [BigInt(index)],
                        value: driverCase?.fineAmount,
                    })}
                    
                    onTransactionConfirmed={async () => alert("Funded successfully!")}

                    className={`w-full text-white py-2 px-4 rounded-md ${
                        driverCase?.resolved
                            ? "bg-gray-900 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-700"
                    }`}
                    disabled={driverCase?.resolved}
                >
                    Pay Fine
                </TransactionButton>
            </div>
        </div>
    )
}

export default SingleCase;