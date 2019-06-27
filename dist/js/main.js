const aboutMeButton = document.querySelector(".about-btn");
const aboutExitButton = document.querySelector(".about-exit-btn");
const aboutDiv = document.querySelector(".about");

aboutMeButton.addEventListener("click", showAboutMe);
aboutExitButton.addEventListener("click", hideAboutMe);

function showAboutMe() {
  aboutDiv.classList.add("show");
}

function hideAboutMe() {
  aboutDiv.classList.remove("show");
}
