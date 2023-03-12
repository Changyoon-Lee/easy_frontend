import "../css/tailwind.css";

const profileBtn = document.getElementById("profile_img");
const profileMenu = document.getElementById("profile_menu");

let hidden = true;
const handleProfileClick = () => {
    if (hidden) {
        profileMenu.classList.remove("hidden")
    } else {
        profileMenu.classList.add("hidden")
    }
    hidden = !hidden;
    console.log(profileMenu.classList)
}
if (profileBtn) {
    profileBtn.addEventListener("click", handleProfileClick)
}