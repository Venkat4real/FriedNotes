# Pincode details API
Resource description:   


This documentation details the PINCODE VALIDATION API for validating an Indian Pincode and retrieving the corresponding delivery post office details.  
The PINCODE VALIDATION API allows Users to check the validity of a given PINCODE. If the Pincode is valid, the API returns information about the associated delivery post office,  including the Circle, Region, and Division. This API also supports searching by partial office names.

Endpoints and methods:

POST: 
URL link: https://api.cept.gov.in/CommonFacilityMaster/api/values/Fetch_Facility

Parameters for POST endpoint: 

The API accepts input in a JSON format.

Key	Type	Description
Input_Pincode	-- String	-- The Pincode (e.g., "532001") or a partial office name (e.g., "srikak").

Request example for POST endpoint: 

Example for pincode
{
  "Input_Pincode": "532001"
}

Example for Place
{
  "Input_Pincode": "srikak"
}

Response example and schema: 

The API returns the result in JSON file, containing the validation status and, for successful, the post office details.

Response parameters 
Key,Type,Description
Validation Status,String,"Indicates successful validation. Value: ""Valid Pincode""."
Circle,String,The Postal Circle the office belongs to.
Region,String,The Postal Region.
Division,String,The Postal Division.
Name of the office,String,The official name of the post office.
Delivery/Non-Delivery Office,String,"Specifies if the office delivers mail (""Delivery Office"") or not (""Non-Delivery Office"")."

Sample result 
{
  "Validation Status": "Valid Pincode",
  "Circle": "Andhra Pradesh Circle",
  "Region": "Visakhapatnam Region",
  "Division": "Srikakulam Division",
  "Name of the office": "Srikakulam H.O",
  "Delivery/Non-Delivery Office": "Delivery Office"
}

Error Response 
(Invalid Request/Input) An error response is returned when the input is invalid (e.g., an invalid Pincode format, non-existent Pincode, or an unprocessable search term).

KeyType Description Validation Status
String Indicates an error. Value: "Invalid Input"

Sample error output 
{
  "Validation Status": "Invalid Input"
}


