import { checkNicknameDuplicate, fetchChangeUserInfo, fetchWithdrawUser} from "./api/fetchData.js";
import { checkStringLength, checkWhiteSpace } from "./StringChecker.js";
import { getUserInfo, setUserInfo } from "./auth.js";

const API_BASE_URL = "http://localhost:8080";

const profileForm = document.getElementById("profileForm");
const profileImageInput = document.getElementById("profileImageInput");
const profilePreview = document.getElementById("profilePreview");
const emailText = document.getElementById("emailText");
const nickname = document.getElementById("nickname");
const nicknameHelper = document.getElementById("nicknameHelper");
const profileToast = document.getElementById("profileToast");
const withdrawButton = document.getElementById("withdrawButton");
const withdrawModal = document.getElementById("withdrawModal");
const withdrawConfirmButton = document.getElementById("withdrawConfirmButton");
const withdrawCancelButton = document.getElementById("withdrawCancelButton");

function initPage(){
    const userInfo = getUserInfo();
    if(userInfo === null || userInfo === undefined){
        alert("로그인이 필요합니다.")
        location.href = "/page/signin.html";
    }

    emailText.textContent = userInfo.email;
    nickname.value = userInfo.nickname;

    profilePreview.src = userInfo?.profileImage
    ? `${API_BASE_URL}${userInfo.profileImage}`
    : "/profile-image.jpeg";
}

profileImageInput.addEventListener("input", () =>{
    const file = profileImageInput.files[0];

    if (!file) {
        profilePreview.src = "/profile-image.jpeg";
        return;
    }

    profilePreview.src = URL.createObjectURL(file);
})

profileForm.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const nicknameValue = nickname.value;
    
    if(nicknameValue.length === 0){
        nicknameHelper.textContent = "*닉네임을 입력해주세요.";
    }
    else if(checkWhiteSpace(nicknameValue)){
        nicknameHelper.textContent = "*띄어쓰기를 없애주세요";
    }
    else if(!checkStringLength(nicknameValue, 1, 10)){
        nicknameHelper.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다."
    }
    else{
        if(!(await checkNicknameDuplicate(nicknameValue))){
            nicknameHelper.textContent = "*중복된 닉네임 입니다.";
            return;
        }

        nicknameHelper.textContent = "";
        const request = new FormData();
        const userInfo = getUserInfo();

        request.append("profileId", userInfo.profileId);
        request.append("nickname", nicknameValue);
        if (profileImageInput.files[0]) {
            request.append("imageFile", profileImageInput.files[0]);
        }

        const response = await fetchChangeUserInfo(request);
        const data = (await response.json());
        if(response.status === 200){
            userInfo.nickname = data.data.nickname;
            userInfo.profileImage = data.data.profileImage;
            setUserInfo(userInfo);
            profileToast.hidden = false;
            setTimeout(() => profileToast.hidden = true, 1000);
        }
        else{
            console.log(data.code);
        }
    }
})

withdrawButton.addEventListener("click", () =>{
    withdrawModal.hidden = false;
})

withdrawCancelButton.addEventListener("click", () => {
    withdrawModal.hidden = true;
})

withdrawConfirmButton.addEventListener("click", async () => {
    const response = await fetchWithdrawUser();

    if(response.status === 200){
        alert("탈퇴완료");
        location.href = "/page/signin.html";
    }
    else{
        alert("탈퇴실패");
    }

})

initPage();