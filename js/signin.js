import { fetchSignIn } from "./api/fetchData.js";
import { setAccessToken, setUserInfo } from "./auth.js";
import { checkStringLength, checkWhiteSpace, checkEmailStyle, validPassword} from "./StringChecker.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
let emailState = false;
const password = document.getElementById("password");
let passwordState = false;
const signInHelper = document.getElementById("signInHelper");

const loginButton = document.getElementById("loginButton");
const signUpLink = document.getElementById("signUpLink");

function checkSignInValid(){
    if(emailState && passwordState){
        loginButton.disabled = false;
    }
    else{
        loginButton.disabled = true;
    }
}

function moveToPostPage(){
    window.location.href = ("/page/posts.html");
}

email.addEventListener("input", () => {
    const emailValue = email.value
    if(emailValue.length == 0){
        emailState = false;
        signInHelper.textContent = "*이메일을 입력해주세요.";
    }
    else if(checkWhiteSpace(emailValue) || checkEmailStyle(emailValue) === false){
        emailState = false;
        signInHelper.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    }
    else{
        emailState = true;
        if(passwordState === false){
            signInHelper.textContent = "*비밀번호를 입력해주세요";
        }
        else{
            signInHelper.textContent = "";
        }
    }
    checkSignInValid();
});

 password.addEventListener("input", () => {
    if(!emailState) return;
    const passwordValue = password.value;
    if(passwordValue.length == 0){
        passwordState = false;
        signInHelper.textContent = "*비밀번호를 입력해주세요";
    }
    else if(!validPassword(passwordValue)){
        passwordState = false;
        signInHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else{
        passwordState = true;
        signInHelper.textContent = "";
    }
    checkSignInValid();
})

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const request = {
        email: email.value,
        password: password.value
    };

    const response = await fetchSignIn(request);

    const data = (await response.json()).data;
    if(response.status === 200){
        const {
            accessToken,
            ...userInfo
        } = data;
        setAccessToken(accessToken);
        setUserInfo(userInfo);
        moveToPostPage();
    }
    else{
        signInHelper.textContent = "*아이디 또는 비밀번호를 확인해주세요"
        alert(data.code);
    }
})