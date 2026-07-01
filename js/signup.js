import { checkStringLength, checkWhiteSpace, checkEmailStyle, checkPasswordStyle, confirmPassword, validPassword } from "./StringChecker.js";
import { checkEmailDuplicate, fetchSignUp } from "./api/fetchData.js";

const signUpForm = document.getElementById("signupForm");
const signUpButton = document.getElementById("signupButton");
const backButton = document.getElementById("backButton");

const profileImage = document.getElementById("profileImageInput");
const profilePreview = document.getElementById("profilePreview");
const email = document.getElementById("email");
const emailHelper = document.getElementById("emailHelper");
let emailState = false;
const password = document.getElementById("password");
const passwordHelper = document.getElementById("passwordHelper");
let passwordState = false;
const passwordConfirm = document.getElementById("passwordConfirm");
const passwordConfirmHelper = document.getElementById("passwordConfirmHelper");
let passwordConfirmState = false;
const nickname = document.getElementById("nickname");
const nicknameHelper = document.getElementById("nicknameHelper");
let nicknameState = false;
const loginLink = document.getElementById("loginLink");

function moveToLogin() {
    window.location.href = "../page/signin.html";
}


function checkSignUpValid(){
    if(emailState && passwordState && passwordConfirmState && nicknameState){
        signUpButton.disabled = false;
    }
    else{
        signUpButton.disabled = true;
    }
}

profileImage.addEventListener("change", ()=>{
    const file = profileImage.files[0];

    if (!file) {
        profilePreview.hidden = true;
        return;
    }

    profilePreview.src = URL.createObjectURL(file);
    profilePreview.hidden = false;
})

email.addEventListener("focusout", async () =>{
    const emailValue = email.value
    if(emailValue.length == 0){
        emailState = false;
        emailHelper.textContent = "*이메일을 입력해주세요.";
    }
    else if(checkWhiteSpace(emailValue) || checkEmailStyle(emailValue) === false){
        emailState = false;
        emailHelper.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    }
    else {
        try{
            const response = await checkEmailDuplicate(emailValue);
            if(response){
                emailState = true;
                emailHelper.textContent = "";
            }
            else{
                emailState = false;
                emailHelper.textContent = "*중복된 이메일 입니다."
            }
        }
        catch{
            emailState = false;
            emailHelper.textContent = "*이메일 중복 검사 실패, 잠시 후 다시 시도해주세요."
        }


    }
    checkSignUpValid();
})

password.addEventListener("focusout", () => {
    const passwordValue = password.value;
    if(passwordValue.length == 0){
        passwordState = false;
        passwordHelper.textContent = "*비밀번호를 입력해주세요";
    }
    else if(!validPassword(passwordValue)){
        passwordState = false;
        passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else{
        passwordState = true;
        passwordHelper.textContent = "";
    }
    checkSignUpValid();
})

passwordConfirm.addEventListener("focusout", () => {
    const passwordConfirmValue = passwordConfirm.value;
    if(passwordConfirmValue.length == 0){
        passwordConfirmState = false;
        passwordConfirmHelper.textContent = "*비밀번호를 한번더 입력해주세요";
    }
    else if(!validPassword(passwordConfirmValue)){
        passwordConfirmState = false;
        passwordConfirmHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else if(passwordConfirmValue !== password.value){
        passwordConfirmState = false;
        passwordConfirmHelper.textContent = "*비밀번호가 다릅니다.";
    }
    else{
        passwordConfirmState = true;
        passwordConfirmHelper.textContent = "";
    }
    checkSignUpValid();
})

nickname.addEventListener("focusout",() => {
    const nicknameValue = nickname.value;
    if(nicknameValue.length === 0){
        nicknameState = false;
        nicknameHelper.textContent = "*닉네임을 입력해주세요.";
    }
    else if(checkWhiteSpace(nicknameValue)){
        nicknameState = false;
        nicknameHelper.textContent = "*띄어쓰기를 없애주세요";
    }
    else if(!checkStringLength(nicknameValue, 1, 10)){
        nicknameState = false;
        nicknameHelper.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다."
    }
    else{
        nicknameState = true;
        nicknameHelper.textContent = "";
    }
    checkSignUpValid();
})

signUpForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const request = new FormData();
    request.append("email", email.value);
    request.append("password", password.value);
    request.append("passwordConfirm", passwordConfirm.value);
    request.append("nickname", nickname.value);
    if (profileImage.files[0]) {
        request.append("imageFile", profileImage.files[0]);
    }

    try{
        const response = await fetchSignUp(request);
        moveToLogin();
    }
    catch(error){
        alert(error.message);
    }
})