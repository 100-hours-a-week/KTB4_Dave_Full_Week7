import { fetchGetPostDetail, fetchIsLikePost, fetchPostLike, fetchPostReport, fetchDeletePost } from "./api/fetchData.js";
import { formatCount, formatDateTime } from "./dataUtil.js";
import { getUserInfo } from "./auth.js";
const postTitle = document.getElementById("postTitle");
const postAuthorImage = document.getElementById("postAuthorImage");
const postAuthorName = document.getElementById("postAuthorName");
const postCreatedAt = document.getElementById("postCreatedAt");
const postEditButton = document.getElementById("postEditButton");
const postDeleteButton = document.getElementById("postDeleteButton");
const postImage = document.getElementById("postImage");
const postContent = document.getElementById("postContent");

const likeButton = document.getElementById("likeButton");
let liked = false;
const likeCount = document.getElementById("likeCount");
const viewCount = document.getElementById("viewCount");
const commentCount = document.getElementById("commentCount");

const postDeleteModal = document.getElementById("postDeleteModal");
const postDeleteCancelButton = document.getElementById("postDeleteCancelButton");
const postDeleteConfirmButton = document.getElementById("postDeleteConfirmButton");
const params = new URLSearchParams(window.location.search);
const postNum = params.get("postNum");

async function getPostDetail() {
    const response = await fetchGetPostDetail(postNum);
    const data = await response.json();
    if(response.status === 200){
        const post = data.data;
        postTitle.textContent = post.title;
        postContent.textContent = post.content;
        if(post.image){
            postImage.src = post.image;
            postImage.hidden = false;
        }
        likeCount.textContent = formatCount(post.likeCount);
        viewCount.textContent = formatCount(post.viewCount);
        commentCount.textContent = formatCount(post.commentCount);
        postAuthorName.textContent = post.nickname;
        postAuthorImage.src = post.profileImage;
        postCreatedAt.textContent = formatDateTime(post.writeAt);
        postCreatedAt.dateTime = post.writeAt;
        checkOwner(post.nickname);
    }
    else{
        alert(data.code);
    }
}

async function checkLikePost(){
    const response = await fetchIsLikePost(postNum);
    const data = await response.json();

    if(response.status === 200){
        if(data.data === false){
            liked = false;
            likeButton.classList.remove("is-liked");
        }
        else{
            liked = true;
            likeButton.classList.add("is-liked");
        }
    }
    else if(response.status === 401){
        alert(data.code);
        location.href = "/page/signin.html"
    }
    else{
        alert(data.code);
    }
}

function checkOwner(nickname){
    const userInfo = getUserInfo();
    if(userInfo){
        if(userInfo.nickname === nickname){
            postControlButtonEnable();
        }
        else{
            postControlButtonDisable();
        }
    }
    else{
        postControlButtonDisable();
    }
}

function postControlButtonDisable(){
    postEditButton.hidden = true;
    postDeleteButton.hidden = true;
}

function postControlButtonEnable(){
    postEditButton.hidden = false;
    postDeleteButton.hidden = false;
}

async function init(){
    checkLikePost();
    getPostDetail();
}

likeButton.addEventListener("click", async () => {
    const response = await fetchPostLike(postNum);
    const data = await response.json();

    if(response.status === 200){
        liked = !liked;
        if(liked){
            likeButton.classList.add("is-liked");
        }
        else{
            likeButton.classList.remove("is-liked");
        }
        likeCount.textContent = formatCount(data.data.likeCount);
    }
    else{
        alert(data.code);
    }

});

postDeleteButton.addEventListener("click", () => {
    postDeleteModal.hidden = false;
});

postDeleteConfirmButton.addEventListener("click", async () => {
    const response = await fetchDeletePost(postNum);
    const data = await response.json();
    if(response.status === 200){
        alert(data.code);
        location.href = "/page/posts.html";
    }
    else{
        alert(data.code);
    }

    postDeleteModal.hidden = true;
});

postDeleteCancelButton.addEventListener("click", () => {
    postDeleteModal.hidden = true;
})

postEditButton.addEventListener("click", () => {
    location.href = `/page/post-write.html?postNum=${postNum}`;
})
init();