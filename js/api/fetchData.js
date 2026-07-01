import { getValidToken } from "../auth.js";
const API_BASE_URL = "http://127.0.0.1:8080";

export async function checkEmailDuplicate(email) {
    const request = new Request(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: email
    });
    try{
        const response = await fetch(request);
        if(response.status === 200){
            return true;
        }else if(response.status === 409){
            return false;
        }
        else{
            throw error;
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function checkNicknameDuplicate(nickname) {
    const request = new Request(`${API_BASE_URL}/users/nickname`, {
        method: "POST",
        body: nickname
    });
    try{
        const response = await fetch(request);
        if(response.status === 200){
            return true;
        }else{
            return false;
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchSignUp(signUpRequest){
    const request = new Request(`${API_BASE_URL}/users`, {
        method: "POST",
        body: signUpRequest
    });
    
    try{
        const data = await fetch(request);
        const json = await data.json();
        if(data.status === 201){
            return json;     
        }
        else {
            throw new Error(json.code);
        }
    
    }
    catch(error){
        throw error;
    }
}

export async function fetchSignIn(signInRequest){
    const request = new Request(`${API_BASE_URL}/users/state`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(signInRequest)
    });
    
    try{
        const data = await fetch(request);
        const json = await data.json();
        if(data.status === 200){
            return json;
        }
        else {
            throw new Error(json.code);
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchSignOut() {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/users/state`, {
        method: "DELETE",
        headers: {
            "Authorization" : "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    
    try{
        const data = await fetch(request);
        const json = await data.json();
        if(data.status === 200){
            return json;
        }
        else{
            throw new Error(json.code);
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
    
}

export async function fetchWithdrawUser(){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/users`, {
        method: "DELETE",
        headers: {
            "Authorization" : "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    
    try{
        const data = await fetch(request);
        const json = await data.json();
        if(data.status === 200){
            return json;
        }
        else{
            throw new Error(json.code);
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchChangeUserInfo(userInfoRequest){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/users/info`, {
        method: "PATCH",
        headers: {
            "Authorization" : "Bearer " + accessToken
        },
        body: userInfoRequest
    });
    
    try{
        const data = await fetch(request);
        const json = await data.json();
        if(data.status === 200){
            return json;
        }
        else{
            throw new Error(json.code);
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchChangePassword(passwordRequest){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/users/password`, {
        method: "PATCH",
        headers: {
            "Authorization" : "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordRequest)
    });
    
    try{
        const data = await fetch(request);
        if(data.status === 200){
            return data;
        }
        else{
            throw new Error("비밀번호 변경 실패");
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
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
        throw error;
    }
}

export async function fetchAddPost(postRequest){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Authorization" : "Bearer " + accessToken
        },
        body: postRequest
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchIssueTemporaryKey(){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/temporaryPost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchDeleteTemporaryKey(temporaryId){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/temporaryPost/${temporaryId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchTemporarySavePost(temporaryId,postRequest){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/temporaryPost/${temporaryId}`, {
        method: "PUT",
        headers: {
            "Authorization" : "Bearer " + accessToken
        },
        body: postRequest
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchGetTemporaryPost(temporaryId){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/temporaryPost/${temporaryId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchGetMyTemporaryPosts(){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/temporaryPost/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchGetPostDetail(postNum) {
    const request = new Request(`${API_BASE_URL}/posts/${postNum}`, {
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
        throw error;
    }
}

export async function fetchIsLikePost(postNum) {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/${postNum}/like`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchPostLike(postNum) {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/${postNum}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchPostReport(postNum){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/${postNum}/report`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchEditPost(postNum, postRequest) {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/${postNum}`, {
        method: "PATCH",
        headers: {
            "Authorization" : "Bearer " + accessToken
        },
        body: postRequest
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
    }
}

export async function fetchDeletePost(postNum){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/${postNum}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchGetLikedPost(index, size){
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/posts/myLike?page=${index}&size=${size}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }    
}

export async function fetchGetCommentsByPost(postNum) {
    const request = new Request(`${API_BASE_URL}/comments/list/${postNum}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchAddCommentToPost(postNum, commentRequest) {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/comments/post/${postNum}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify(commentRequest)
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchAddCommentToComment(postNum, commentRequest) {
    const accessToken = getValidToken();
    const request = new Request(`${API_BASE_URL}/comments/comment/${postNum}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify(commentRequest)
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export async function fetchEditComment(commentNum, commentRequest) {
    const accessToken = getValidToken();
        const request = new Request(`${API_BASE_URL}/comments/${commentNum}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify(commentRequest)
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}


export async function fetchDeleteComment(commentNum) {
    const accessToken = getValidToken();
        const request = new Request(`${API_BASE_URL}/comments/${commentNum}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + accessToken
        }
    });
    
    try{
        const data = await fetch(request);
        return data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}