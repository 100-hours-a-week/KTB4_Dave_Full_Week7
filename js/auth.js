import {isJwtExpired} from './jwtUtil.js'
export function setAccessToken(token) {
    sessionStorage.setItem("accessToken", token);
}

export function removeAccessToken(token) {
    sessionStorage.removeItem("accessToken");
}

export function getAccessToken(){
    return sessionStorage.getItem("accessToken");
}

export function setUserInfo(userInfo){
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
}

export function removeUserInfo(){
    sessionStorage.removeItem("userInfo");
}

export function getUserInfo(){
    return sessionStorage.getItem("userInfo");
}

export function isSignIn(){
    console.log(getAccessToken());
    return getValidToken()? true : false;
}

export function getValidToken(){
    const accessToken = getAccessToken();

    if(!accessToken){
        return null;
    }

    if(isJwtExpired(accessToken)){
        removeAccessToken();
        return null;
    }
    return accessToken;
}