const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

const registerHere = document.querySelector(".register-here");
const loginHere = document.querySelector(".login-here");

const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const loginUserName = document.querySelector("#login-user-name");
const loginPassword = document.querySelector("#login-password");

const registerUserName = document.querySelector("#reg-user-name");
const registerEmail = document.querySelector("#admin-mail");
const registerPassword = document.querySelector("#reg-password");
const registerContact = document.querySelector("#contact");

const loginSubmit = document.querySelector(".login-submit");
const registerSubmit = document.querySelector(".register-submit");

registerHere.addEventListener("click", (e)=>{
    e.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display= "block";
});
loginHere.addEventListener("click", (e)=>{
    e.preventDefault();
    loginContainer.style.display="block";
    registerContainer.style.display="none";
});

loginSubmit.addEventListener("click", (e)=>{
    e.preventDefault();
    loginForm.requestSubmit();
});

registerSubmit.addEventListener("click", (e)=>{
    e.preventDefault();
    registerForm.requestSubmit();
});

loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    !loginUserName.value?setError(loginUserName, "required"):setSuccess(loginUserName);
    !loginPassword.value?setError(loginPassword, "required"):setSuccess(loginPassword);

    // Get Data and check whether the given data is present or not
});

registerForm.addEventListener("click", (e)=>{
    e.preventDefault();
    !registerUserName.value?setError(registerUserName, "required"):setSuccess(registerUserName);
    !registerEmail.value?setError(registerEmail, "required"):setSuccess(registerEmail);
    !registerPassword.value?setError(registerPassword):((registerPassword.value).trim()).length>=8?setSuccess(registerPassword):setError(registerPassword, "password shoulb atleast 8 characters");
    let adminObject = {
        "adminName": registerUserName.value,
        "adminMail":registerEmail.value,
        "adminPassword":registerPassword.value,
        "adminContact":registerContact.value
    }
    //Store data into DataBase
});

function setSuccess(tag) {
    tag.style.border= "2px solid grey";
    tag.style.borderRadius= "3px";
    tag.nextElementSibling.textContent = "";
}
function setError(tag, message) {
    tag.style.border= "2px solid red";
    tag.style.borderRadius="3px";
    tag.nextElementSibling.textContent = message;
    tag.nextElementSibling.style.color="red";
    return;
}


