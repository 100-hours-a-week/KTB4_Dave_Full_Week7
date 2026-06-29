import {isJwtExpired} from './jwtUtil.js'
const API_BASE_URL = "http://localhost:8080";

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
    const userInfo = sessionStorage.getItem("userInfo");
    if (!userInfo) {
        return null;
    }

    try {
        return JSON.parse(userInfo);
    } catch (error) {
        console.error("userInfo 파싱 실패", error);
        return null;
    }
}

export function isSignIn(){
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

export function clearAuth() {
  removeAccessToken();
  removeUserInfo();
}