import { checkStringLength, checkWhiteSpace, checkEmailStyle, 
    checkPasswordStyle, confirmPassword } from "./StringChecker";

const signUpForm = document.getElementById("signUpForm");
const backButton = document.getElementById("backButton");

const email = document.getElementById("email");
const emailHelper = document.getElementById("emailHelper");
const emailState = false;
const password = document.getElementById("password");
const passwordHelper = document.getElementById("passwordHelper");
const passwordState = false;
const passwordConfirm = document.getElementById("passwordConfirm");
const passwordConfirmHelper = document.getElementById("passwordConfirmHelper");
const passwordConfirmState = false;
const nickname = document.getElementById("nickname");
const nicknameHelper = document.getElementById("nicknameHelper");
const nicknameState = false;
const loginLink = document.getElementById("loginLink");
const emailState = false;

email.addEventListener("blur", () =>{
    if(checkWhiteSpace(email.value)){
        emailState = false;
        
    }
    else{
        emailState = true;
    }
})