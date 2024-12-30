//btns
const searchBtn = document.querySelector(".btn-search-service");
const addVendorBtn = document.querySelector(".btn-add-vendor");
//Container
const formContainer= document.querySelector(".container-add-vendor");
const listContainer = document.querySelector(".container-list-vendors");
//form fields
const addVendorForm = document.querySelector("form");
const serviceOption = document.querySelector("#service");
const vendorOption = document.querySelector("#vendor");
const submitBtn = document.querySelector(".submit-btn");

// I. Add Vendors to Service
addVendorBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    formContainer.style.display = "flex";
    listContainer.style.display= "none";
    let allServices = await getAll("service");
    let allVendors = await getAll("vendor");
    await iterateFuncToAddOptionsToFormFields(serviceOption, allServices, true); //to minimize code boolean has been added to arguments,if service-true else false
    await iterateFuncToAddOptionsToFormFields(vendorOption, allVendors, false);
});

async function getAll(module) {
    try {
        let res = await fetch(`/getAll/${module}`, {
            method:"GET",
            headers: {"Content-Type":"application/json"}
        });
        if(res.ok){
            return await res.json();
        }
    } catch (error) {
        console.log(error);
    }
}
async function iterateFuncToAddOptionsToFormFields(selectTag, arrOfObjects, flag) {
    let arr = await arrOfObjects;
    let structure = `<option value="">--Select Vendor Type--</option>`;
    arr.forEach(obj => {
        if(flag){ //service 
            structure += `<option value="${obj.service}">${obj.service}</option>`
        }
        else{
            structure += `<option value="${obj._id}">${obj.vendorName}</option>`
        }
    });
    selectTag.innerHTML = structure;
}

// Add Vendor to service 
submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    addVendorForm.requestSubmit();
})
addVendorForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    !serviceOption.value?setError(serviceOption):setSuccess(serviceOption);
    !vendorOption.value?setError(vendorOption):setSuccess(vendorOption);
    console.log(serviceOption.value);
    
    //1.Check whether the service is already there
    try {
        addNewService = await fetch(`/updateService/service/${serviceOption.value}/${vendorOption.value}/false`, {
            method:"PUT",
            headers:{"Content-Type":"application/json"}
        }); 
    }
    catch (error) {
        console.log(error);
    }
});

function setError(tag) {
    tag.style.border="2px solid red";
    tag.style.borderRadius = "3px"
    tag.nextElementSibling.textContent="Required";
    tag.nextElementSibling.style.color="red";
}
function setSuccess(tag) {
    tag.style.border="2px solid green";
    tag.style.borderRadius = "3px"
    tag.nextElementSibling.textContent="";
    tag.nextElementSibling.style.color="";
}

// II. Search Vendor Functions
searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    formContainer.style.display="none";
    listContainer.style.display = "flex";
});

const serviceNameInp = document.querySelector("#serviceName");
const tbody = document.querySelector(".tbody");

let debounceTimeout;

serviceNameInp.addEventListener("input", (e) => {
    e.preventDefault();
    let service = e.target.value;

    // Clear the previous timeout
    clearTimeout(debounceTimeout);

    // Set a new timeout to delay the HTTP request
    debounceTimeout = setTimeout(async () => {
        if (service.trim()) { // Ensure the input is not empty or just spaces
            console.log('Fetching data for service:', service);
            try {
                let res = await fetch(`/getByKey/service/${service}/service`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    let obj = await res.json();
                    console.log(obj);

                    // Clear previous results (optional)
                    tbody.innerHTML = "";
                    (obj.vendors).forEach(vendorId => {
                        let tr = document.createElement("tr");
                        tr.setAttribute("id", `${vendorId}`);
                        let structure = `
                            <td>${service}</td>
                            <td>${vendorId}</td>`;
                        tr.innerHTML = structure;
                        tbody.appendChild(tr);
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }, 800); // Delay of 500ms
});

