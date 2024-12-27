//Add Vendor
const vendorName = document.querySelector("#vendorName");
const serviceName = document.querySelector("#serviceProvided");
const location = document.querySelector("#location");
const contactPerson = document.querySelector("#contactPerson");
const vendorType = document.querySelector("#vendorType");
const contactNumber = document.querySelector("#contactNumber");
const vendorMail = document.querySelectorAll("#vendorMail");
const password = document.querySelector("#password");

const form = document.querySelector(".vendor-form");
const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    form.requestSubmit();
});

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let vendorObj = {
        vendorName: vendorName.value,
        serviceName:serviceName.value,
        location:location.value,
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

// Search Data And Display Vendor Details
