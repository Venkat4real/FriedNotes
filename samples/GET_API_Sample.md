## Postal PIN Code API
### Desciption
Postal PIN Code API allows developers to get details of Post Office by searching Postal PIN Code or Post Office Branch Name of India.

### End Points
* Get Post Office(s) details search by Postal PIN Code
  GET https://api.postalpincode.in/pincode/{PINCODE}


* Get Post Office(s) details search by Post Office branch name
  GET https://api.postalpincode.in/postoffice/{POSTOFFICEBRANCHNAME}

Postal PIN Code API returns the response in JSON format. "Status" field in response is set to SUCCESS or ERROR, "Message" field will return message against the request and "PostOffice" field will return data.

Example 1 (Search by Postal PIN Code):

To get details of a PIN Code (110001), use following query

https://api.postalpincode.in/pincode/110001



### Response For Valid PIN Codes:

```
{
   "Message":"Number of Post office(s) found: 21",
   "Status":"Success",
   "PostOffice":[
      {
         "Name":"Baroda House",
         "Description":"",
         "BranchType":"Sub Post Office",
         "DeliveryStatus":"Non-Delivery",
         "Circle":"New Delhi",
         "District":"Central Delhi",
         "Division":"New Delhi Central",
         "Region":"Delhi",
         "State":"Delhi",
         "Country":"India"
      }
   ]
}

```

Response For Invalid PIN Codes or Error messages:

```
{
   "Message":"No records found",
   "Status":"Error",
   "PostOffice":null
}
```

Example 2 (Search by Post Office Branch Name):

To get details of a Post Office Branch details (New Delhi), use following query

https://api.postalpincode.in/postoffice/New Delhi


Response For Valid Post Office Branch Name:

```
{
   "Message":"Number of Post office(s) found: 2",
   "Status":"Success",
   "PostOffice":[
      {
         "Name":"New Delhi G.P.O.",
         "Description":"",
         "PINCode":"110001",
         "BranchType":"Head Post Office",
         "DeliveryStatus":"Delivery",
         "Circle":"New Delhi",
         "District":"New Delhi",
         "Division":"New Delhi GPO",
         "Region":"Delhi",
         "State":"Delhi",
         "Country":"India"
      },
      {
         "Name":"New Delhi South Ext-II",
         "Description":"",
         "PINCode":"110049",
         "BranchType":"Sub Post Office",
         "DeliveryStatus":"Non-Delivery",
         "Circle":"New Delhi",
         "District":"South Delhi",
         "Division":"New Delhi South",
         "Region":"Delhi",
         "State":"Delhi",
         "Country":"India"
      }
   ]
}
```

Response For Invalid Post Office Branch Name or Error messages:

```
{
   "Message":"No records found",
   "Status":"Error",
   "PostOffice":null
}
```
> Note:
Limits:
There is no limits of API requests.

> Note: 
Terms of Use:
You are free to use the API for commercial or non-commercial purposes.

