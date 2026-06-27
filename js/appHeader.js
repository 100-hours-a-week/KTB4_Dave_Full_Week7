import { isSignIn, getUserInfo } from "./auth.js";

class AppHeader extends HTMLElement {
  connectedCallback() {
    const hasBackButton = this.hasAttribute("back-url");
    const backURL = this.getAttribute("back-url");

    const signedIn = isSignIn();
    const userInfo = signedIn ? getUserInfo() : null;

    const profileImage = userInfo?.profileImage || "/profile-image.jpeg";

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
                      data-action="logout"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              `
              :  ""//`<a class="header__login-link" href="/page/login.html">로그인</a>`
          }
        </div>
      </header>
    `;

    this.querySelector(".header__back-button")?.addEventListener("click", () => {
      if (backURL) {
        location.href = backURL;
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

    this.querySelector(".header__dropdown")?.addEventListener("click", (event) => {
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

      if (action === "logout") {
        // logout();
        location.href = "/page/login.html";
      }
    });
  }
}

customElements.define("app-header", AppHeader);