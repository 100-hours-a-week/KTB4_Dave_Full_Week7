import { fetchGetCommentsByPost, fetchAddCommentToPost, fetchAddCommentToComment, fetchEditComment, fetchDeleteComment } from "./api/fetchData.js";
import { getUserInfo } from "./auth.js";
import { formatDateTime, formatCount} from "./dataUtil.js"

const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentHelper = document.getElementById("commentHelper");
const commentSubmitButton = document.getElementById("commentSubmitButton");
const commentList = document.getElementById("commentList");

const commentDeleteModal = document.getElementById("commentDeleteModal");
const commentDeleteCancelButton = document.getElementById("commentDeleteCancelButton");
const commentDeleteConfirmButton = document.getElementById("commentDeleteConfirmButton");

const params = new URLSearchParams(window.location.search);
const postNum = params.get("postNum");

const userInfo = getUserInfo();
let isEdit = false;
let isReply = false;
let parentNum = null;
let commentNum = null; 

function init(){
    getComments();
}

async function getComments(){
    const response = await fetchGetCommentsByPost(postNum);
    const data = await response.json();

    if(response.status === 200){
        console.log(data);
        renderComments(data.data);
    }
    else{
        alert(data.code);
    }
}

function renderComments(comments) {
    commentList.innerHTML = "";

    comments.forEach((commentNode) => {
        const commentElement = createCommentElement(commentNode);
        commentList.append(commentElement);
    });
}

function createCommentElement(commentNode) {
    const { comment, childComments } = commentNode;

    const article = document.createElement("article");
    article.className = "comment-item";
    article.dataset.commentId = comment.commentNum;

    const authorImage = document.createElement("div");
    authorImage.className = "comment-item__author-image";
    authorImage.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "comment-item__body";

    const header = document.createElement("div");
    header.className = "comment-item__header";

    const authorName = document.createElement("strong");
    authorName.className = "comment-item__author-name";
    authorName.textContent = comment.nickname;

    const date = document.createElement("time");
    date.className = "comment-item__created-at";
    date.textContent = formatDateTime(comment.writeAt);
    date.dateTime = comment.writeAt;

    header.append(authorName, date);

    const content = document.createElement("p");
    content.className = "comment-item__content";
    content.textContent = comment.content;

    body.append(header, content);

    const actions = document.createElement("div");
    actions.className = "comment-item__actions";

    if(!comment.deleted){
        if(comment.depth < 3){
            const replyButton = document.createElement("button");
            replyButton.className = "comment-item__reply-button";
            replyButton.type = "button";
            replyButton.textContent = "답글";
            replyButton.dataset.commentId = comment.commentNum;

            actions.append(replyButton);
        }
        
        if(userInfo){
            if(userInfo.nickname == comment.nickname){
                const editButton = document.createElement("button");
                editButton.className = "comment-item__edit-button";
                editButton.type = "button";
                editButton.textContent = "수정";
                editButton.dataset.commentId = comment.commentNum;

                const deleteButton = document.createElement("button");
                deleteButton.className = "comment-item__delete-button";
                deleteButton.type = "button";
                deleteButton.textContent = "삭제";
                deleteButton.dataset.commentId = comment.commentNum;
                actions.append(editButton, deleteButton);
            }
        }
    }

    article.append(authorImage, body, actions);

    if (childComments.length > 0) {
        const childList = document.createElement("div");
        childList.className = "comment-item__children";

        childComments.forEach((childCommentNode) => {
        childList.append(createCommentElement(childCommentNode));
        });

        article.append(childList);
    }

    return article;
}

commentInput.addEventListener("input", () => {
    if(commentInput.value.length > 0){
        commentSubmitButton.disabled = false;
    }
    else{
        commentSubmitButton.disabled = true;
    }
});

commentList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const commentItem = event.target.closest(".comment-item");

    if (!commentItem) {
        return;
    }

    const commentId = commentItem.dataset.commentId;

    if (button.classList.contains("comment-item__reply-button")) {
        startReply(commentId);
        return;
    }

    if (button.classList.contains("comment-item__edit-button")) {
        const contentElement = commentItem.querySelector(".comment-item__content");
        startEdit(commentId, contentElement.textContent);
        return;
    }

    if (button.classList.contains("comment-item__delete-button")) {
        openCommentDeleteModal(commentId);
    }
});

function startReply(commentId){
    isReply = true;
    parentNum = commentId;
    commentSubmitButton.textContent = "답글 등록";
}

function startEdit(commentId, content){
    isEdit = true;
    commentNum = commentId;
    commentInput.value = content;
    commentSubmitButton.textContent = "댓글 수정";
}

function openCommentDeleteModal(commentId){
    commentNum = commentId;
    commentDeleteModal.hidden = false;
}

commentDeleteConfirmButton.addEventListener("click",async () =>{
    const response = await fetchDeleteComment(commentNum);
    if(response.status === 200){
        alert("댓글 삭제 완료");
        getComments();
    }
    else{
        alert("실패");
    }
    commentNum = null;
    commentDeleteModal.hidden = true;
})

commentDeleteCancelButton.addEventListener("click", () =>{
    commentDeleteModal.hidden = true;
})

commentForm.addEventListener("submit", async (event)=> {
    event.preventDefault();
    let response = null;
    if(!isReply){
        const request = {
            "content": commentInput.value
        };
        console.log(postNum, request);
        if(isEdit){
            response = await fetchEditComment(commentNum, request);
        }
        else{
            response = await fetchAddCommentToPost(postNum, request);
        }
        if(response.status === 200){
            isEdit = false;
            commentNum = null;
            alert("댓글 수정 완료");
            commentSubmitButton.textContent = "댓글 등록";
            commentInput.value = "";
            getComments();
        }
        else if(response.status === 201){
            alert("댓글 등록 완료");
            commentInput.value = "";
            getComments();
        }
        else{
            alert("댓글 등록 실패");
        }
    }
    else{
        const request = {
            "content": commentInput.value,
            "parentNum": parentNum
        }

        response = await fetchAddCommentToComment(postNum, request);
        if(response.status === 201){
            isReply = false;
            parentNum = null;
            alert("댓글 등록 완료");
            commentInput.value = "";
            commentSubmitButton.textContent = "댓글 등록";
            getComments();
        }
        else{
            alert("댓글 등록 실패");
        }
    }
});

init();