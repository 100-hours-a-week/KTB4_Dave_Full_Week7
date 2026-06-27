import { getValidToken } from "../auth.js";
const API_BASE_URL = "http://localhost:8080";
const accessToken = getValidToken();

export async function checkEmailDuplicate(email) {
    const request = new Request(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: email
    });
    try{
        const response = await fetch(request);
        console.log(await response.json());
        if(response.status === 200){
            return true;
        }else{
            return false;
        }
    }
    catch(error){
        console.log(error.message);
    }
}

export async function checkNicknameDuplicate(nickname) {
    const request = new Request(`${API_BASE_URL}/users/nickname`, {
        method: "POST",
        body: nickname
    });
    try{
        const response = await fetch(request);
        console.log(await response.json());
        if(response.status === 200){
            return true;
        }else{
            return false;
        }
    }
    catch(error){
        console.log(error.message);
    }
}


export async function fetchSignUp(signUpRequest){
    const request = new Request(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(signUpRequest)
    });
    
    try{
        const data = await fetch(request);
        return data;     
    }
    catch(error){
        console.log(error.message);
    }
}

export async function fetchSignIn(signInRequest){
    const request = new Request(`${API_BASE_URL}/users/state`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(signInRequest)
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
    }
}

export async function fetchPosts(index, size){
    const request = new Request(`${API_BASE_URL}/posts?page=${index}&size=${size}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        }
    });

    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
    }
}