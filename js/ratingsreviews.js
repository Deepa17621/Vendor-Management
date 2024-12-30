document.querySelector('.update-btn').addEventListener('click', function() {
    document.querySelector('.container-update').classList.add('active-container');
    document.querySelector('.container-list-ratings').classList.remove('active-container');
});

document.querySelector('.list-rating-btn').addEventListener('click', function() {
    document.querySelector('.container-list-ratings').classList.add('active-container');
    document.querySelector('.container-update').classList.remove('active-container');
});

// Form Fields
const vendorId = document.querySelector("#vendorId");
const genericRating= document.querySelector("#generic-rating");
const quality = document.querySelector("#quality");
const service = document.querySelector("#quality");
const delivery = document.querySelector("#delivery");
const pricing = document.querySelector("#pricing");
const communication = document.querySelector("#communication");

const submitBtn = document.querySelector(".submit");
const form = document.querySelector("form");

async function getAll() {
    try {
        let res = await fetch(`/getAll/vendor`, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
        if(res.ok){
            let arr = await res.json();
            let structure = `<option value="">--Select Vendor--</option>`;
            arr.forEach(element => {
                structure += `<option value="${element._id}">${element.vendorName}</option>`
            });
            vendorId.innerHTML=structure;
        }
    } catch (error) {
        console.log(error);
    }
}
getAll(); // Add options to VENDOR ID's

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    !vendorId.value?setError(vendorId):setSuccess(vendorId);
    !genericRating.value?setError(genericRating):setSuccess(genericRating);
    !quality.value?setError(quality):setSuccess(quality);
    !service.value?setError(service):setSuccess(service);
    !delivery.value?setError(delivery):setSuccess(delivery);
    !pricing.value?setError(pricing):setSuccess(pricing);
    !communication.value?setError(communication):setSuccess(communication);
    let newRatingObj = {
        "vendorId":vendorId.value,
        "genericRating":genericRating.value,
        "quality":quality.value,
        "service":service.value,
        "delivery":delivery.value,
        "pricing":pricing.value,
        "comunication":communication.value
    }
    let getRating = await getByKey(vendorId);  // get rating object using vendorId
    if(getRating){
        if(getRating.vendorId===vendorId.value){
            getRating.vendorId=newRatingObj.vendorId;
            getRating.genericRating=newRatingObj.genericRating;
            getRating.quality=newRatingObj.quality;
            getRating.service=newRatingObj.service;
            getRating.delivery = newRatingObj.service
            getRating.pricing = newRatingObj.pricing;
            getRating.communication=newRatingObj.communication;
            let updateRating = await updateRating(newRatingObj);
        }
    }
});
submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    form.requestSubmit();
});

async function getByKey(vendorId) {
    try {
        let res = await fetch(`/getByKey/ratingsreviews/${vendorId.value}/vendorId`, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
        if(res.ok){
            let exRatingObj=await res.json();
            if(vendorId.value === exRatingObj.vendorId){
                return exRatingObj;
            }
        }
    } catch (error) {
     console.log(error);  
    }
}
async function updateRating(newObj, vendorId, ratingId) {
    try {
        let res = await fetch(`/update/`)
    } catch (error) {
        
    }
}

function setError(tag) {
    tag.style.border = "1px solid red";
    tag.nextElementSibling.style.textConent = "required";
    tag.nextElementSibling.style.color = "red";
}
function setSuccess(tag) {
    tag.style.border = "1px solid green";
    tag.nextElementSibling.style.textConent = "";
    tag.nextElementSibling.style.color = "";
}