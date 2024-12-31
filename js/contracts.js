//Add Vendor Id To For Lookup-s Dynamically to form fields
const contractFormVendorOption = document.querySelector("#vendorId");
const overlapFormVendorOption = document.querySelector("#vendorIdCheck");
async function getAllVendorsSetToOptions() {
    try {
        let res = await fetch(`/getAll/vendor`,{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
        let structure=`<option value="">Choose Vendor</option>`;
        if(res.ok){
            let allVendors = await res.json();
            allVendors.forEach(vendor => {
                structure += `<option value="${vendor._id}">${vendor.vendorName}</option>`
            });
            contractFormVendorOption.innerHTML=structure;
            overlapFormVendorOption.innerHTML=structure;
        }
    } catch (error) {
        console.log(error);
    }
}
getAllVendorsSetToOptions();
function showContainer(containerId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(containerId).style.display = 'flex';
}
const contractForm=document.querySelector("#contractForm");
const overlapForm = document.querySelector("#overlapForm");

const submitBtnContract = document.querySelector(".add");
const submitBtnOverlap = document.querySelector(".check");

submitBtnContract.addEventListener("click", (e)=>{
    e.preventDefault();
    contractForm.requestSubmit();
});
submitBtnOverlap.addEventListener("click", (e)=>{
    e.preventDefault();
    overlapForm.requestSubmit();
})
contractForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const vendorId = document.getElementById('vendorId').value;
    const service = document.getElementById('service').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!vendorId || !service || !startDate || !endDate) {
        console.log("valida");
        
        return;
    }

    const contractData = { "vendorId":`${vendorId}`, "service":`${service}`, "startDate":`${startDate}`, "endDate":`${endDate}` };
    fetch('/post/contract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Contract added successfully');
        contractForm.reset();
    })
    .catch(error => console.error('Error:', error));
});

overlapForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const vendorId = document.getElementById('vendorIdCheck').value;
    const startDate = document.getElementById('startDateCheck').value;
    const endDate = document.getElementById('endDateCheck').value;

    const overlapData = { vendorId, startDate, endDate };

    fetch('/post/contract/checkOverlap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(overlapData),
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('overlapResult');
        resultDiv.innerHTML = data.overlap ? 'Overlap detected!' : 'No overlap.';
    })
    .catch(error => console.error('Error:', error));
});
