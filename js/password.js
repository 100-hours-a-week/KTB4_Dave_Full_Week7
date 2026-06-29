import { validPassword, confirmPassword } from "./StringChecker.js";
import { fetchChangePassword } from "./api/fetchData.js";

const passwordForm = document.getElementById("passwordForm");
const currentPassword = document.getElementById("currentPassword");
const currentPasswordHelper = document.getElementById("currentPasswordHelper");
let currentPasswordState = false;
const newPassword = document.getElementById("newPassword");
const newPasswordHelper = document.getElementById("newPasswordHelper");
let newPasswordState = false;
const newPasswordConfirm = document.getElementById("newPasswordConfirm");
const newPasswordConfirmHelper = document.getElementById("newPasswordConfirmHelper");
let newPasswordConfirmState = false;
const passwordSubmitButton = document.getElementById("passwordSubmitButton");
const passwordToast = document.getElementById("passwordToast");

function checkSubmit(){
    if(currentPasswordState && newPasswordState && newPasswordConfirmState){
        passwordSubmitButton.disabled = false;
    }
    else{
        passwordSubmitButton.disabled = true;
    }
}

currentPassword.addEventListener("input", () => {
    const currentPasswordValue = currentPassword.value;
    if(currentPasswordValue.length == 0){
        currentPasswordState = false;
        currentPasswordHelper.textContent = "*비밀번호를 입력해주세요";
    }
    else if(!validPassword(currentPasswordValue)){
        currentPasswordState = false;
        currentPasswordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else{
        currentPasswordState = true;
        currentPasswordHelper.textContent = "";
    }
    checkSubmit()
})

newPassword.addEventListener("input", () => {
    const newPasswordValue = newPassword.value;
    if(newPasswordValue.length == 0){
        newPasswordState = false;
        newPasswordHelper.textContent = "*비밀번호를 입력해주세요";
    }
    else if(!validPassword(newPasswordValue)){
        newPasswordState = false;
        newPasswordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else{
        newPasswordState = true;
        newPasswordHelper.textContent = "";
    }
    checkSubmit()
})

newPasswordConfirm.addEventListener("input", () => {
    const newPasswordConfirmValue = newPasswordConfirm.value;
    if(newPasswordConfirmValue.length == 0){
        newPasswordConfirmState = false;
        newPasswordConfirmHelper.textContent = "*비밀번호를 입력해주세요";
    }
        else if(!validPassword(newPasswordConfirmValue)){
        newPasswordConfirmState = false;
        newPasswordConfirmHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else if(!confirmPassword(newPassword.value, newPasswordConfirmValue)){
        newPasswordConfirmState = false;
        newPasswordConfirmHelper.textContent = "*비밀번호와 다릅니다.";
    }
    else{
        newPasswordConfirmState = true;
        newPasswordConfirmHelper.textContent = "";
    }
    checkSubmit()
})

passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const request = {
        password: currentPassword.value,
        nextPassword: newPassword.value,
        passwordConfirm: newPasswordConfirm.value
    }

    const response = await fetchChangePassword(request);
    const data = await response.json();
    if(response.status === 200){
        passwordToast.hidden = false;
        setTimeout(()=>passwordToast.hidden = true, 1000);
    }
    else if(response.status === 401) {
        alert("로그인이 필요합니다.")
        location.href = "/page/signin.html";
    }
    else{
        alert(data.code);
    }
})