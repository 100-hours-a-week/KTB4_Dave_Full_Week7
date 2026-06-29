import { fetchGetPostDetail } from "./api/fetchData.js";

const postTitle = document.getElementById("postTitle");
const postAuthorImage = document.getElementById("postAuthorImage");
const postAuthorName = document.getElementById("postAuthorName");
const postCreatedAt = document.getElementById("postCreatedAt");
const postEditButton = document.getElementById("postEditButton");
const postDeleteButton = document.getElementById("postDeleteButton");
const postImage = document.getElementById("postImage");
const postContent = document.getElementById("postContent");

const likeButton = document.getElementById("likeButton");
const likeCount = document.getElementById("likeCount");
const viewCount = document.getElementById("viewCount");
const commentCount = document.getElementById("commentCount");

const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentHelper = document.getElementById("commentHelper");
const commentSubmitButton = document.getElementById("commentSubmitButton");
const commentList = document.getElementById("commentList");

const postDeleteModal = document.getElementById("postDeleteModal");
const postDeleteCancelButton = document.getElementById("postDeleteCancelButton");
const postDeleteConfirmButton = document.getElementById("postDeleteConfirmButton");

const commentDeleteModal = document.getElementById("commentDeleteModal");
const commentDeleteCancelButton = document.getElementById("commentDeleteCancelButton");
const commentDeleteConfirmButton = document.getElementById("commentDeleteConfirmButton");

