# Vitals - Decentralized Patient Record

## **Disclaimer**
 This documentation only covers the backend web application aspect of vitals and does not cover any blockchain related aspects such as the smart contract and Frontend aspect. This is also a personal continuation of this great work that was first started under [Learnable Organisation](https://github.com/learnable-2022) and sterred by a group of 14 great Minds (`6 Product Designers`, `4 Frontend Engineers`, `3 **Backend Engineers**` and `1 Web3 Engineer`).

> This Modification contains futher Authentication and Integration Testing on the pre-existing work

## Prerequisites
-   npm installed
-   IDE eg _vscode_
-   CLI eg _postman_

## How to start code
1.  Clone or Download repository
2.  Setup .env file => `port`, `mongo_uri`, `jwt _secret`, `cloudinary`
2.  run `npm install`
3.  run `npm start`
>   DPR-12-BE is ready for use

## Model Diagram
>   [Diagrams on dbdiagrams.io](https://dbdiagram.io/d/646c9bdcdca9fb07c49993a3)

## Live Server `@render`
>   [Render Live](https://vitals-8myt.onrender.com)

## Postman Documentation
>   [Postman Docs](https://documenter.getpostman.com/view/19026826/2s93m7X2Jc)

## **Vitals** is a SAS app designed as a _Decentralized Patient Record_ (**DPR**).

> A DPR is a web3 feature implemented in the medical sector that stores patients health record on the blockchain and give patients full ownership of their data. 

## How Patient Health Record Ownership Works 
Gives patient ownership of their health record by linearly storing an encrypted form of their records on the blockchain which can only be viewed by them. Now patients get to carry their Health Record with them which can be interoperable across all Health Care Providers using `Vitals`.

## How Health Records are stored 
 Health records are stored separately on an `IPFS` Chain DB and pushed to the Blockchain. After each patient appointment their Health Record is sent to the patients wallet address(public key) which is automatically encrypted and stored on the Blockchain.

## How Patients Health Record Can be Accessed
When a personnel is in need of a patients Health record for what so ever reason the Doctor connects to his wallet and make a request that will be sent the patient requesting for access to view their Record. The patient has the ability to `grant` or `Deny` access to any Medical Personnel asking to view their records, As easy as accepting a friend request. Or The record could just be viewed on the patients device using Vitals

## How the Blockchain Works for Vitals 
Using the `Asymmetric Encryption` 2 keys are created _Public key_ and _Private Key_. The public key can be seen a Patients _username_ on the blockchain while their private key is seen as their _password_. As the method works the public key is accessible to everyone trying to store the patients health record while the private key is enclosed to only you for **approving transactions**. The public key is used to _encrypt_ your health records that will be stored on the blockchain while the private key would be used to _decrypt_ the health record for either you or a doctor asking to be granted access. This Feature helps Patient Health Record stay easily accessible and highly secured.

## How Vitals Store Data  
Consists of a `Web2` and `Web3` Data Storage, Web3 deals with all patient health record on the blockchain, while the Web 2 part deals with storing the patient , Health Care Provider and Doctors Identity with enumerous authentication by only granting existing users access to the blockchain, this help scale down traffic and improve effectiveness

### THIS DOCUMENTATION ONLY COVERS THE `WEB2` ASPECTS OF VITALS as the user flows are displayed below

## Patient Flow
> An MVP of how a Patient Moves on Vitals 
![Patient UserFlow](https://res.cloudinary.com/prog-bio/image/upload/v1687747505/WhatsApp_Image_2023-06-26_at_03.39.38_i1soly.jpg)

## Doctors Flow
> An MVP of how a Doctor Moves and Navigates through assigned roles on Vitals 
![Doctor UserFlow](https://res.cloudinary.com/prog-bio/image/upload/v1687747591/WhatsApp_Image_2023-06-26_at_03.39.38_1_f6xgbq.jpg)

## Health Care Provider Flow
> An MVP of how a Hospital Moves and Navigates through their roles on Vitals 
![Health Care Provider UserFlow](https://res.cloudinary.com/prog-bio/image/upload/v1687748669/WhatsApp_Image_2023-06-26_at_04.02.13_uxvpu9.jpg)


## Design Pattern
For this API `layered_structure` was abopted for the main purpose of creating 
all the files in an order that could acomodate the rest easily. This structure was optimized 
as `scalable` and the best for the project decided by the developer. 
> Developer: "If I can get one path right, then the rest would be `cake`"
    
## **Soft Delete** 
This feature was implemented by adding an extra attribute to the models called `deleted`
**Patient**
```json
{
    "post": "Soft delete feature",
    "ownerID": "640a12d5f6020fee349f8219",
    "deleted": false    // default: false
}
```
All `get` request in the db have been set to get request by `id` and `delete == false`. To prevent a user from calling a 
deleted request 