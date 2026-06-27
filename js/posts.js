import { fetchPosts } from "./api/fetchData.js";
import { formatCount, formatDateTime } from "./dataUtil.js";

const writePostButton = document.getElementById("writePostButton");
const postList = document.getElementById("postList");
const postLoading = document.getElementById("postLoading");
const emptyPostMessage = document.getElementById("emptyPostMessage");
const observerTarget = document.getElementById("postObserverTarget");

let postCardId = 1;
let page = 0;
const size = 10;
let isLoading = false;
let hasNext = true;

async function loadNextPosts() {
    if (isLoading || !hasNext) {
        return;
    }

    isLoading = true;
    postLoading.hidden = false;

    const response = await fetchPosts(page, size);
    const data = await response.json();
    const posts = data.data;
    console.log(posts.postTitleResponses);
    if (page === 0 && posts.postTitleResponses.length === 0) {
        emptyPostMessage.hidden = false;
        hasNext = false;
        postLoading.hidden = true;
        isLoading = false;
        return;
    }
    renderPost(posts.postTitleResponses);
    page += 1;
    hasNext = posts.hasNext;
    if (!hasNext) {
    observer.unobserve(observerTarget);
    }
    postLoading.hidden = true;
    isLoading = false;
}

function renderPost(posts) {
    posts.forEach( post => {
        const article = createPostCard(post);
        postList.append(article);
    });
}

function createPostCard(post) {
    const article = document.createElement("article");
    article.className = "post-card";
    article.dataset.postId = post.postNum;

    const content = document.createElement("div");
    content.className = "post-card__content";

    const main = document.createElement("div");
    main.className = "post-card__main";

    const title = document.createElement("h3");
    title.className = "post-card__title";
    title.textContent = formatTitle(post.title);

    const meta = document.createElement("div");
    meta.className = "post-card__meta";
    meta.setAttribute("aria-label", "게시글 통계");

    const like = document.createElement("span");
    like.className = "post-card__meta-item";
    like.textContent = `좋아요 ${formatCount(post.likeCount)}`;

    const comment = document.createElement("span");
    comment.className = "post-card__meta-item";
    comment.textContent = `댓글 ${formatCount(post.commentCount)}`;

    const view = document.createElement("span");
    view.className = "post-card__meta-item";
    view.textContent = `조회수 ${formatCount(post.viewCount)}`;

    meta.append(like, comment, view);
    main.append(title, meta);

    const date = document.createElement("time");
    date.className = "post-card__date";
    date.textContent = formatDateTime(post.writeAt);
    date.dateTime = post.writeAt;

    content.append(main, date);

    const author = document.createElement("div");
    author.className = "post-card__author";

    const authorImage = document.createElement("div");
    authorImage.className = "post-card__author-image";
    authorImage.setAttribute("aria-hidden", "true");

    const authorName = document.createElement("strong");
    authorName.className = "post-card__author-name";
    authorName.textContent = post.nickname;

    author.append(authorImage, authorName);
    article.append(content, author);

    return article;
}

postList.addEventListener("click", (event) => {
    const postCard = event.target.closest(".post-card");

    if (!postCard) {
        return;
    }

    const postId = postCard.dataset.postId;
    location.href = `/page/post-detail.html?postId=${postId}`;
});

const observer = new IntersectionObserver((entries) => 
    {
        const entry = entries[0];

        if (entry.isIntersecting) {
            loadNextPosts();
        }
    }, 
    {
        root: null,
        rootMargin: "200px",
        threshold: 0
    }
);

observer.observe(observerTarget);