// Add New Vendor To Vendors List
// form fields
const vendorName = document.querySelector("#vendorName");
const serviceName = document.querySelector("#serviceName");
const vendorLocation = document.querySelector("#location");
const contactPerson = document.querySelector("#contactPerson");
const vendorType = document.querySelector("#vendorType");
const contactNumber = document.querySelector("#contactNumber");
const vendorMail = document.querySelectorAll("#vendorMail");

let ratings, reviews, performace, contractStartDate, contractEndDate;

const form = document.querySelector(".vendor-form");
const submitBtn = document.querySelector(".submit-btn");

(document.querySelectorAll(".toggle")).forEach(element => {
    element.style.display="none"
});

//Top- Nav Bar
const addVendorBtn = document.querySelector(".btn-add-vendor");
const lisDownVendorBtn = document.querySelector(".btn-list-vendors");
const searchVendor = document.querySelector(".search-btn");
let flag = true;
let searchById=document.querySelector("#search-vendor");
let searchByName= document.querySelector("#search-by-name");
searchVendor.addEventListener("click", (e)=>{
    e.preventDefault();
    (document.querySelectorAll(".toggle")).forEach(element => {
        element.style.display="block"
    });
    
});

//containers & wrapper
const formContainer = document.querySelector(".add-vendor-container");
const listOfVendorsContainer = document.querySelector(".list-vendors-container");
const displayVendorContainer = document.querySelector(".display-vendor-container");

//Table 
const listTable = document.querySelector(".list-table");
const tbodyOfList = document.querySelector(".tbody");

function validatePattern(value, type) {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
        contactNumber: /^\d{10}$/, // 10-digit phone number
        text: /^[A-Za-z\s_]+$/, // Alphabetical characters and spaces
    };
    return patterns[type]?.test(value);
}

function setError(tag, message) {
    tag.style.border = "1px solid red";
    const errorSpan = tag.nextElementSibling;
    if (errorSpan) errorSpan.textContent = message;
}

function clearError(tag) {
    tag.style.border = "";
    const errorSpan = tag.nextElementSibling;
    if (errorSpan) errorSpan.textContent = "";
}

function validateForm() {
    let isValid = true;

    const validateField = (field, type, message) => {
        !field.value.trim() || (type && !validatePattern(field.value, type)) 
            ? (setError(field, message), isValid = false) 
            : clearError(field);
    };

    validateField(vendorName, "text", "Vendor Name is required and should only contain alphabets.");
    validateField(serviceName, "text", "Service Name is required.");
    validateField(vendorLocation, "text", "Location is required.");
    validateField(contactPerson, "text", "Contact Person is required and should only contain alphabets.");
    validateField(vendorType, "text", "Vendor Type is required.");
    validateField(contactNumber, "contactNumber", "Contact Number must be a valid 10-digit number.");

    vendorMail.forEach(mail =>
        !mail.value.trim() || !validatePattern(mail.value, "email")
            ? (setError(mail, "A valid email address is required."), isValid = false)
            : clearError(mail)
    );
    return isValid;
}

submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    form.requestSubmit();
});

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    if (validateForm()) {
        console.log("Form submitted successfully!");
    } else {
        console.log("Form contains errors.");
        return;
    }
    let vendorObj = {
        vendorName: vendorName.value,
        serviceName:serviceName.value,
        vendorLocation:vendorLocation.value,
        contactPerson:contactPerson.value,
        vendorType:vendorType.value,
        phone:contactNumber.value,
        vendorMail:vendorMail.value,
        ratings:"",
        reviews:"",
        performace:"",
        contractStartDate:"",
        contractEndDate:"",

    }
    let result = await addVendor(vendorObj, "vendor");
    // if(result){
    //     // Add Vendor Id to service collection under particular service
    //     let service = await addVendorToService(result);
    // }
    form.reset();

});

async function addVendor(obj, module) {
    try {
        let res = await fetch(`/post/${module}`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(obj)
        });
        if(res.ok){
            let result = await res.json();
            let updatedResult = await addVendorToService(result);
            if(updatedResult){
                alert("Vendor Added to vendors and also to Service Category");
            }
            let rating = await addToRatings(result);
            if(rating){
                console.log("Added to rating group");
            }
        }
        else{
            throw new Error(res.status);
        }
    } catch (error) {
        console.log(error);
    }
}

// List Down All the Vendors with Id And Service
async function getAllVendors() {
    try {
        let res = await fetch(`/getAll/vendor`, {
            method:"GET", 
            headers:{"Content-Type": "application/json"},
        });
        if(res.ok){
            let allVendors = await res.json();
            return allVendors;
        }
        else {
            throw new Error("Error in Fetching all the vendors Details");
        }
    } catch (error) {
        console.log("error in fetching all vendors Details");
    }
}

//Add Vendor Id To Service
async function addVendorToService(vendorObj) {

    //1.Check whether the service is already there
    try {
        let vendor;
        let vendorRes = await fetch(`/getById/vendor/${vendorObj.id}`, {
            method:"GET",
            headers: {"Content-Type":"application/json"}
        });
        if(vendorRes.ok) {
            vendor= await vendorRes.json();
        }
        let service = await fetch(`/getByKey/service/${vendor.serviceName}/service`, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
        let data;
        if(service.ok){
            data = await service.json()
            console.log(data.message);

        }
        let updateService='';
        let addNewService;
        if(data.message){
            updateService = await fetch(`/updateService/service/${service.service}/${vendor._id}/true`, {
                method:"PUT",
                headers:{"Content-Type":"application/json"}
            });
        }
        else{
            addNewService = await fetch(`/updateService/service/${vendor.serviceName}/${vendor._id}/false`, {
                method:"PUT",
                headers:{"Content-Type":"application/json"}
            }); 
        }
        if(updateService.ok || addNewService.ok){
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

//Add Vendor ID to Ratings Collection
async function addToRatings(vendor) {
    let data = await vendor;
    console.log(data);
    
    try {
        let res = await fetch(`/post/ratingsreviews`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                                   "vendorId":`${vendor.id}`,
                                   "genericRating":"",
                                   "quality":"",
                                   "service":"",
                                   "delivery":"",
                                   "pricing":"",
                                   "communication":""
            })
        });
        if(res.ok){
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
addVendorBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    listOfVendorsContainer.style.display= "none";
    displayVendorContainer.style.display = "none";
    formContainer.style.display = "flex";
    (document.querySelector(".search-btn")).classList.remove("true");
    (document.querySelectorAll(".toggle")).forEach(element => {
        element.style.display= "none";
    });
});

lisDownVendorBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    listOfVendorsContainer.style.display = "flex";
    displayVendorContainer.style.display = "none";
    formContainer.style.display = "none";
    (document.querySelector(".search-btn")).classList.add("true");
});

async function addDataToTable() {
    if(getAllVendors()){
        let arr =await getAllVendors();
    
        arr.forEach(vendor => {
            let trr = document.createElement("tr");
            tbodyOfList.appendChild(trr);
            trr.setAttribute("id", `${vendor._id}`);
            trr.classList.add("row");
            let tds = `<td class="vendor-id">${vendor._id}</td>
                       <td class="vendor-name">${vendor.vendorName}</td>
                       <td class="vendor-type">${vendor.vendorType}</td>`;
            trr.innerHTML = tds;
        });
    }
}
addDataToTable();

searchById.addEventListener("input", async(e)=>{
    e.preventDefault();
    formContainer.style.display = "none";
    listOfVendorsContainer.style.display= "flex";
    // displayVendorContainer.style.display = "flex";
    let allVendors = await getAllVendors();

    let filterItem = allVendors.filter(vendor=>{
        if(vendor._id.includes(searchById.value)){
            return vendor;
        }
    });
    if(filterItem.length>0){
        (document.querySelector(".not-found")).textContent="";
        (document.querySelectorAll(".row")).forEach(element => {
            element.style.display="none";
        });
        filterItem.forEach(obj => {
            (document.querySelectorAll(".row")).forEach(element => {
                if(element.id === obj._id){
                    element.style.display="block"
                }
            });
        });
    }  
    else{
        (document.querySelectorAll(".row")).forEach(element => {
            element.style.display="none";
        });
        (document.querySelector(".not-found")).textContent="Not Found!"
    } 
    // searchById.value = '';
});

searchByName.addEventListener("input", async(e)=>{
    e.preventDefault();
    formContainer.style.display = "none";
    listOfVendorsContainer.style.display= "flex";
    // displayVendorContainer.style.display = "flex";
    let allVendors = await getAllVendors();

    let filterItem = allVendors.filter(vendor=>{
        if(vendor.vendorName.toLowerCase().includes(searchByName.value.toLowerCase())){
            return vendor;
        }
    });
    if(filterItem.length>0){
        (document.querySelector(".not-found")).textContent="";
        (document.querySelectorAll(".row")).forEach(element => {
            element.style.display="none";
        });
        filterItem.forEach(obj => {
            (document.querySelectorAll(".row")).forEach(element => {
                if(element.id === obj._id){
                    element.style.display="block"
                }
            });
        });
    }  
    else{
        (document.querySelectorAll(".row")).forEach(element => {
            element.style.display="none";
        });
        (document.querySelector(".not-found")).textContent="Not Found!"
    } 
    // searchByName.value = '';
});

