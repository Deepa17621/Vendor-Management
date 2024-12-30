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

addVendorBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    formContainer.style.display = "flex";
    listContainer.style.display= "none";
    let allServices = await getAll("service");
    let allVendors = await getAll("vendor");
    await iterateFuncToAddOptionsToFormFields(serviceOption, allServices, true); //to minimize code boolean has been added to arguments,if service-true else false
    await iterateFuncToAddOptionsToFormFields(vendorOption, allVendors, false);
});

addVendorForm.addEventListener("submit", (e)=>{
    e.preventDefault();

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
async function iterateFuncToAddOptionsToFormFields(selectTag, arrOfObjects, boolean) {
    let arr = await arrOfObjects;
    let structure = `<option value="">--Select Vendor Type--</option>`;
    arr.forEach(obj => {
        if(boolean){ //service 
            structure += `<option value="${obj.sevice}">${obj.service}</option>`
        }
        else{
            structure += `<option value="${obj._id}">${obj.vendorName}</option>`
        }
    });
    selectTag.innerHTML = structure;
}