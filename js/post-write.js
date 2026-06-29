import { fetchGetPostDetail, fetchAddPost, fetchIssueTemporaryKey, fetchTemporarySavePost, fetchDeleteTemporaryKey, fetchEditPost } from "./api/fetchData.js";

const postWriteForm = document.getElementById("postWriteForm");
const postTitle = document.getElementById("postTitle");
let titleState = false;
const postContent = document.getElementById("postContent");
let contentState = false;
const postWriteHelper = document.getElementById("postWriteHelper");
const postImageInput = document.getElementById("postImageInput");
const postImageFileName = document.getElementById("postImageFileName");
const postImagePreview = document.getElementById("postImagePreview");
const postSubmitButton = document.getElementById("postSubmitButton");
let isDirty = false;
let temporaryKeyPromise = null;
const params = new URLSearchParams(window.location.search);
const postNum = params.get("postNum");

async function getEditPostData(){
    const response = await fetchGetPostDetail(postNum);
    const data = await response.json();
    if(response.status === 200){
        const post = data.data;
        postTitle.value = post.title;
        postContent.value = post.content;
        if(post.image){
            postImagePreview.src = post.image;
            postImagePreview.hidden = false;
        }
        else{
            postImagePreview.hidden = true;
        }
        const appHeader = document.getElementsByTagName("app-header")[0];
        appHeader.setAttribute("back-url", `/page/post-detail.html?postNum=${postNum}`);
    }
    else{
        alert(data.code);
    }
}

function init(){
    if(postNum){
        getEditPostData();
    }
}


function getTemporaryKey() {
    if (!temporaryKeyPromise) {
        temporaryKeyPromise = issueTemporaryKey();
    }

    return temporaryKeyPromise;
}

async function issueTemporaryKey() {
    const response = await fetchIssueTemporaryKey();
    const data = await response.json();
    return data.data.temporaryKeyId;
}

function checkState(){
    if(titleState && contentState){
        postWriteHelper.textContent = "";
        postSubmitButton.disabled = false;
    }
    else{
        postWriteHelper.textContent = "*제목, 내용을 모두 작성해주세요";
        postSubmitButton.disabled = true;
    }
}

async function temporarySave() {
    const request = new FormData();
    if(postNum){
        request.append("postNum", postNum);
    }
    request.append("title", postTitle.value);
    request.append("content", postContent.value);
    request.append("image", postImageInput.files[0]);
    const temporaryId = await getTemporaryKey();

    const response = await fetchTemporarySavePost(temporaryId, request);

    if(response.status === 200){
        console.log("임시저장 완료");
    }
    else{
        console.log("임시저장 실패");
    }
}

postTitle.addEventListener("input", () => {
    isDirty = true;
    if(postTitle.value.length === 0){
        titleState = false;
    }
    else{
        titleState = true;
    }
    checkState();
})


postContent.addEventListener("focusout", () => {
    isDirty = true;
    if(postContent.value.length === 0){
        contentState = false;
    }
    else{
        contentState = true;
    }
    checkState();
})

postImageInput.addEventListener("input", () => {
    const file = postImageInput.files[0];

    if (!file) {
        postImageFileName.textContent = "파일을 선택해주세요";
        postImagePreview.hidden = true;
        return;
    }
    postImageFileName.textContent = "";
    postImagePreview.src = URL.createObjectURL(file);
    postImagePreview.hidden = false;
})

postWriteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const request = new FormData();
    if(postNum){
        request.append("postNum", postNum);
    }
    request.append("title", postTitle.value);
    request.append("content", postContent.value);
    if(postImageInput.files[0]){
        request.append("image", postImageInput.files[0]);
    }

    let response;
    if(postNum){
        response = await fetchEditPost(postNum, request);
    }
    else{
        response = await fetchAddPost(request);
    }
    const data = (await response.json());
    if(response.status === 201){
        const tempKeyDelete = await fetchDeleteTemporaryKey(await getTemporaryKey());
        if(tempKeyDelete.status !== 200){
            console.log("임시 키 삭제 실패");
        }

        location.href = "/page/posts.html"
    }
    else if(response.status === 200){
        location.href = `/page/post-detail.html?postNum=${postNum}`
    }
    else{
        alert(data.code);
    }

})

setInterval(() => {
    const titleValue = postTitle.value.trim();
    const contentValue = postContent.value.trim();

    if (titleValue === "" || contentValue === "") {
        return;
    }
    if(isDirty === false){
        return;
    }


    
    console.log("임시저장 실행");
    temporarySave();
    isDirty = false;
}, 1000*60);
init();