// Add New Vendor To Vendors List
// form fields
const vendorName = document.querySelector("#vendorName");
const serviceName = document.querySelector("#serviceProvided");
const vendorLocation = document.querySelector("#location");
const contactPerson = document.querySelector("#contactPerson");
const vendorType = document.querySelector("#vendorType");
const contactNumber = document.querySelector("#contactNumber");
const vendorMail = document.querySelectorAll("#vendorMail");
const password = document.querySelector("#password");

let ratings, reviews, performace, contractStartDate, contractEndDate;

const form = document.querySelector(".vendor-form");
const submitBtn = document.querySelector(".submit-btn");

//Top- Nav Bar
const addVendorBtn = document.querySelector(".btn-add-vendor");
const lisDownVendorBtn = document.querySelector(".btn-list-vendors");
const searchVendor = document.querySelector("#search-vendor");

//containers & wrapper
const formContainer = document.querySelector(".add-vendor-container");
const listOfVendorsContainer = document.querySelector(".list-vendors-container");
const displayVendorContainer = document.querySelector(".display-vendor-container");

//Table 
const listTable = document.querySelector(".list-table");
const tbodyOfList = listTable.getElementsByTagName("tbody");

function validatePattern(value, type) {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
        contactNumber: /^\d{10}$/, // 10-digit phone number
        text: /^[A-Za-z\s]+$/, // Alphabetical characters and spaces
        password: /^.{8,}$/, // Minimum 8 characters
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
    validateField(serviceName, null, "Service Name is required.");
    validateField(vendorLocation, null, "Location is required.");
    validateField(contactPerson, "text", "Contact Person is required and should only contain alphabets.");
    validateField(vendorType, null, "Vendor Type is required.");
    validateField(contactNumber, "contactNumber", "Contact Number must be a valid 10-digit number.");
    
    vendorMail.forEach(mail =>
        !mail.value.trim() || !validatePattern(mail.value, "email")
            ? (setError(mail, "A valid email address is required."), isValid = false)
            : clearError(mail)
    );

    validateField(password, "password", "Password must be at least 8 characters long.");

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
        location:vendorLocation.value,
        contactPerson:contactPerson.value,
        vendorType:vendorType.value,
        phone:contactNumber.value,
        vendorMail:vendorMail.value,
        password:password.value,
        ratings:"",
        reviews:"",
        performace:"",
        contractStartDate:"",
        contractEndDate:"",

    }
    let result = await addVendor(vendorObj, "vendor");

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
            alert("Vendor has been added");
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
            console.log(await res.json());
            return;
        }
        else {
            throw new Error("Error in Fetching all the vendors Details");
        }
    } catch (error) {
        console.log("error in fetching all vendors Details");
    }
}

addVendorBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    listOfVendorsContainer.style.display= "none";
    displayVendorContainer.style.display = "none";
    formContainer.style.display = "flex";
});

lisDownVendorBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    listOfVendorsContainer.style.display= "flex";
    displayVendorContainer.style.display = "none";
    formContainer.style.display = "none";
    
    try {
        let res = await fetch("/getAll/vendor", {
            method: "GET",
            headers: {"Content-Type":"application/json"}
        })
        if(res.ok){
            let allVendors = await res.json();
            allVendors.forEach(vendor => {
                let tr = document.createElement("tr");
                tbodyOfList.appendChild(tr);
                let tds = `<td class="vendor-id">${vendor._id}</td>
                           <td class="vendor-name">${vendor.vemdorName}</td>
                           <td class="vendor-type">${vendor.vendorType}</td>`;
                tr.innerHTML = tds;
            });
        }
        else{

        }
    } catch (error) {
        
    }
});

searchVendor.addEventListener("input", (e)=>{
    e.preventDefault();
    formContainer.style.display = "none";
    listOfVendorsContainer.style.display= "none";
    displayVendorContainer.style.display = "flex";
});