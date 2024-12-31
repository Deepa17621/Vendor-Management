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

loginForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    !loginUserName.value?setError(loginUserName, "required"):setSuccess(loginUserName);
    !loginPassword.value?setError(loginPassword, "required"):setSuccess(loginPassword);
    console.log(loginUserName.value);
    console.log(loginPassword.value);
    try {
        let res = await fetch(`/getByUsername/admin/${loginUserName.value}`, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
    if(res.ok){
        let result = await res.json();
        console.log(result);
        
        if(loginUserName.value === result.adminName){
            if(loginPassword.value === result.adminPassword){
                alert("Logged In Successfully!")
            }
            throw new Error("Password wrong")
        }
        else{
            alert("user not found! Enter avlid Credentials");
        }
    }
    else{
        throw new Error("admin not found!");
    }
    } catch (error) {
        
    }
});

registerForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let flag = false;
    flag = !registerUserName.value?setError(registerUserName, "required"):setSuccess(registerUserName);
    falg = !registerEmail.value?setError(registerEmail, "required"):setSuccess(registerEmail);
    flag = !registerPassword.value?setError(registerPassword):((registerPassword.value).trim()).length>=8?setSuccess(registerPassword):setError(registerPassword, "password shoulb atleast 8 characters");
    if(flag){
        let adminObject = {
            "adminName": registerUserName.value,
            "adminMail":registerEmail.value,
            "adminPassword":registerPassword.value,
            "adminContact":registerContact.value
        }
        try {
            let res=await fetch("/post/admin", {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(adminObject)
            });
            if(res.ok){
                console.log(await res.json());
                alert("SuccessFully Registered!");
            }
            else {
                throw new Error(res.status+" error in storing admin data")
            }
        } catch (error) {
            console.log(error);
        }
    }
});

function setSuccess(tag) {
    tag.style.border= "2px solid grey";
    tag.style.borderRadius= "3px";
    tag.nextElementSibling.textContent = "";
    return true
}
function setError(tag, message) {
    tag.style.border= "2px solid red";
    tag.style.borderRadius="3px";
    tag.nextElementSibling.textContent = message;
    tag.nextElementSibling.style.color="red";
    return false;
}


