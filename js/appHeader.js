import { fetchSignOut } from "./api/fetchData.js";
import { isSignIn, getUserInfo, clearAuth } from "./auth.js";

const API_BASE_URL = "http://localhost:8080";

class AppHeader extends HTMLElement {
  connectedCallback() {
    const hasBackButton = this.hasAttribute("back-url");
    const backURL = this.getAttribute("back-url");

    const signedIn = isSignIn();
    const userInfo = signedIn ? getUserInfo() : null;

    const profileImage = userInfo?.profileImage
      ? `${API_BASE_URL}${userInfo.profileImage}`
      : "/profile-image.jpeg";

    this.innerHTML = `
      <header class="header">
        <div class="header__left">
          ${
            hasBackButton
              ? `<button class="header__back-button" type="button" aria-label="이전 페이지로 이동">&lt;</button>`
              : ""
          }
        </div>

        <h1 class="header__title">아무 말 대잔치</h1>

        <div class="header__right">
          ${
            signedIn && userInfo
              ? `
                <div class="header__profile-menu">
                  <button
                    class="header__profile-button"
                    type="button"
                    aria-label="회원 메뉴 열기"
                    aria-expanded="false"
                  >
                    <img
                      class="header__profile-image"
                      src="${profileImage}"
                      alt="회원 프로필 이미지"
                    />
                  </button>

                  <div class="header__dropdown" hidden>
                    <button
                      class="header__dropdown-button"
                      type="button"
                      data-action="profile-edit"
                    >
                      회원정보수정
                    </button>

                    <button
                      class="header__dropdown-button"
                      type="button"
                      data-action="password-edit"
                    >
                      비밀번호수정
                    </button>

                    <button
                      class="header__dropdown-button"
                      type="button"
                      data-action="liked-posts"
                    >
                      좋아요한 글
                    </button>

                    <button
                      class="header__dropdown-button"
                      type="button"
                      data-action="logout"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              `
              : ""
          }
        </div>
      </header>
    `;

    this.querySelector(".header__title")?.addEventListener("click", () => {
      if (signedIn) {
        location.href = "/page/posts.html";
        return;
      }

      location.href = "/page/signin.html";
    });

    this.querySelector(".header__back-button")?.addEventListener("click", () => {
      if (backURL) {
        location.href = this.getAttribute("back-url") || "/";
        return;
      }

      history.back();
    });

    const profileButton = this.querySelector(".header__profile-button");
    const dropdown = this.querySelector(".header__dropdown");

    profileButton?.addEventListener("click", () => {
      if (!dropdown) {
        return;
      }

      const isOpen = !dropdown.hidden;

      dropdown.hidden = isOpen;
      profileButton.setAttribute("aria-expanded", String(!isOpen));
    });

    this.querySelector(".header__dropdown")?.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      const action = button.dataset.action;

      if (action === "profile-edit") {
        location.href = "/page/profile.html";
        return;
      }

      if (action === "password-edit") {
        location.href = "/page/password.html";
        return;
      }

      if (action === "liked-posts") {
        location.href = "/page/posts.html?type=liked";
        return;
      }

      if (action === "logout") {
        const response = await fetchSignOut();
        const data = await response.json();

        console.log(data);

        if (response.status === 200) {
          alert("로그아웃 성공");
          clearAuth();
          location.href = "/page/signin.html";
          return;
        }

        if (response.status === 401) {
          alert("로그인이 필요합니다.");
          clearAuth();
          location.href = "/page/signin.html";
          return;
        }

        alert("로그아웃 실패");
      }
    });
  }
}

customElements.define("app-header", AppHeader);