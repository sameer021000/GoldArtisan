import { useState } from "react"
import "./AddressQuestionsCSS.css"

// All Indian states for the dropdown
const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
]

function AddressQuestionsScreen()
{
    const [hasPermanentAddress, setHasPermanentAddress] = useState(null)
    const [addressesSame, setAddressesSame] = useState(null)
    const [addressForm, setAddressForm] = useState(
    {
        state: "",
        district: "",
        pinCode: "",
        city: "",
        center: "",
        street: "",
        landmark: "",
        doorNo: "",
    })

    const handleYesClick = () =>
    {
        setHasPermanentAddress(true)
        setAddressesSame(null)
    }

    const handleNoClick = () =>
    {
        setHasPermanentAddress(false)
        setAddressesSame(null)
    }

    const handleAddressesSameYes = () =>
    {
        setAddressesSame(true)
    }

    const handleAddressesSameNo = () =>
    {
        setAddressesSame(false)
    }

    const handleFormChange = (field, value) =>
    {
        setAddressForm((prev) => (
        {
            ...prev,
            [field]: value,
        }))
    }

    const handleNextClick = () =>
    {
        // Validate form before proceeding
        console.log("[v0] Address form submitted:", addressForm)
        // Add your navigation or submission logic here
    }

    const isFormValid = () =>
    {
        return (
            addressForm.state &&
            addressForm.district &&
            addressForm.pinCode &&
            addressForm.city &&
            addressForm.center &&
            addressForm.street &&
            addressForm.landmark &&
            addressForm.doorNo
        )
    }

    return (
      <div id="divId1_AddressQuestions">
        <div id="contentWrap_AddressQuestions">
            {/* Top Box - Initial Question */}
            <div id="topBox_AddressQuestions">
                <h1 id="h1Id1_AddressQuestions">Answer few questions</h1>
                <p id="pId1_AddressQuestions">Please answer the following questions about your address details</p>

                <h2 id="questionTitle_AddressQuestions">Do you have a permanent address?</h2>

                {/* Yes/No Button Group */}
                <div id="buttonGroup_AddressQuestions">
                    <button
                        id="yesBtn_AddressQuestions"
                        type="button"
                        className={hasPermanentAddress === true ? "selectedOption" : ""}
                        onClick={handleYesClick}
                        aria-pressed={hasPermanentAddress === true}
                    >
                        <div id="yesIcon_AddressQuestions" aria-hidden="true">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>Yes</span>
                    </button>

                    <button
                      id="noBtn_AddressQuestions"
                      type="button"
                      className={hasPermanentAddress === false ? "selectedOption" : ""}
                      onClick={handleNoClick}
                      aria-pressed={hasPermanentAddress === false}
                    >
                      <div id="noIcon_AddressQuestions" aria-hidden="true">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                      <span>No</span>
                    </button>
                </div>
            </div>

            {/* Second Box - Shown when first answer is "Yes" */}
            {hasPermanentAddress === true && (
                <div id="secondBox_AddressQuestions">
                    <h2 id="questionTitle2_AddressQuestions">Is your permanent address and temporary address are same?</h2>

                    <div id="buttonGroup2_AddressQuestions">
                        <button
                            id="yesBtn2_AddressQuestions"
                            type="button"
                            className={addressesSame === true ? "selectedOption" : ""}
                            onClick={handleAddressesSameYes}
                            aria-pressed={addressesSame === true}
                        >
                        <div id="yesIcon2_AddressQuestions" aria-hidden="true">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>Yes</span>
                        </button>

                        <button
                            id="noBtn2_AddressQuestions"
                            type="button"
                            className={addressesSame === false ? "selectedOption" : ""}
                            onClick={handleAddressesSameNo}
                            aria-pressed={addressesSame === false}
                        >
                        <div id="noIcon2_AddressQuestions" aria-hidden="true">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        <span>No</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Address Form Box - Shown when first answer is "No" */}
            {hasPermanentAddress === false && (
                <div id="addressFormBox_AddressQuestions">
                    <h2 id="formTitle_AddressQuestions">Enter your address details</h2>

                    <div id="formGrid_AddressQuestions">
                        {/* State Dropdown */}
                        <div id="formGroup_State" className="formGroup_AddressQuestions">
                            <label id="label_State" htmlFor="input_State">
                                State <span className="required">*</span>
                            </label>
                            <div id="selectWrapper_State" className="customSelectWrapper">
                                <select
                                    id="input_State"
                                    value={addressForm.state}
                                    onChange={(e) => handleFormChange("state", e.target.value)}
                                    className="customSelect"
                                >
                                    <option value="">Select a state</option>
                                    {INDIAN_STATES.map((state) => (
                                        <option key={state} value={state}>
                                          {state}
                                        </option>
                                    ))}
                                </select>
                                <div className="selectArrow" aria-hidden="true">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                            
                        {/* District */}
                        <div id="formGroup_District" className="formGroup_AddressQuestions">
                            <label id="label_District" htmlFor="input_District">
                                District <span className="required">*</span>
                            </label>
                            <input
                                id="input_District"
                                type="text"
                                placeholder="Enter district"
                                value={addressForm.district}
                                onChange={(e) => handleFormChange("district", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* PIN Code */}
                        <div id="formGroup_PinCode" className="formGroup_AddressQuestions">
                            <label id="label_PinCode" htmlFor="input_PinCode">
                                PIN Code <span className="required">*</span>
                            </label>
                            <input
                                id="input_PinCode"
                                type="number"
                                placeholder="Enter PIN code"
                                value={addressForm.pinCode}
                                onChange={(e) => handleFormChange("pinCode", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* City */}
                        <div id="formGroup_City" className="formGroup_AddressQuestions">
                            <label id="label_City" htmlFor="input_City">
                                City <span className="required">*</span>
                            </label>
                            <input
                                id="input_City"
                                type="text"
                                placeholder="Enter city"
                                value={addressForm.city}
                                onChange={(e) => handleFormChange("city", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* Center */}
                        <div id="formGroup_Center" className="formGroup_AddressQuestions">
                            <label id="label_Center" htmlFor="input_Center">
                                Center <span className="required">*</span>
                            </label>
                            <input
                                id="input_Center"
                                type="text"
                                placeholder="Enter center"
                                value={addressForm.center}
                                onChange={(e) => handleFormChange("center", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* Street */}
                        <div id="formGroup_Street" className="formGroup_AddressQuestions">
                            <label id="label_Street" htmlFor="input_Street">
                                Street <span className="required">*</span>
                            </label>
                            <input
                                id="input_Street"
                                type="text"
                                placeholder="Enter street"
                                value={addressForm.street}
                                onChange={(e) => handleFormChange("street", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* Landmark */}
                        <div id="formGroup_Landmark" className="formGroup_AddressQuestions">
                            <label id="label_Landmark" htmlFor="input_Landmark">
                                Landmark <span className="required">*</span>
                            </label>
                            <input
                                id="input_Landmark"
                                type="text"
                                placeholder="Enter landmark"
                                value={addressForm.landmark}
                                onChange={(e) => handleFormChange("landmark", e.target.value)}
                                className="customInput"
                            />
                        </div>
                            
                        {/* Door Number */}
                        <div id="formGroup_DoorNo" className="formGroup_AddressQuestions">
                            <label id="label_DoorNo" htmlFor="input_DoorNo">
                                D.No <span className="required">*</span>
                            </label>
                            <input
                                id="input_DoorNo"
                                type="text"
                                placeholder="Enter door number"
                                value={addressForm.doorNo}
                                onChange={(e) => handleFormChange("doorNo", e.target.value)}
                                className="customInput"
                            />
                        </div>
                    </div>
                          
                    {/* Next Button inside form box */}
                    <div id="formBottomRow_AddressQuestions">
                        <button
                            id="nextBtn_AddressQuestions"
                            type="button"
                            onClick={handleNextClick}
                            disabled={!isFormValid()}
                            aria-disabled={!isFormValid()}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    )
}

export default AddressQuestionsScreen
