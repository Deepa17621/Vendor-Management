let url = window.location.search;
let param = new URLSearchParams(url);
let currentVID=param.get("id");

let table = document.querySelector(".table-display-vendor");
let backBtn=document.querySelector("#back-btn");
async function getVendorById(vendorId) {
    try {
        let res = await fetch(`/getById/vendor/${vendorId}`, {
            method:"GET",
            headers:{"Content-Type":"application"}
        });
        if(res.ok){
            let vObj = res.json();
            populateVendorDetail(vObj);
        }
        else{
            table.textContent="Vendors List is Empty!!"
        }
    } catch (error) {
        console.log(error);
        
    }
}
getVendorById(currentVID);

async function populateVendorDetail(obj) {
    let vendorObj = await obj;
    while (table.hasChildNodes()) {
        table.firstElementChild.remove();
    }
    for (const key in vendorObj) {
        let trr = document.createElement("tr");
        table.appendChild(trr);
        let keyTD = document.createElement("td");
        keyTD.setAttribute("id", "left");
        let valueTD = document.createElement("td");
        trr.appendChild(keyTD);
        valueTD.setAttribute("id", "right");
        trr.appendChild(valueTD);
        keyTD.textContent = key;
        valueTD.textContent = "-  "+ vendorObj[key];
    }
}
backBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    history.back();
})