function signIn() {
  event.preventDefault();
  if (event.target[0].value === "user1" && event.target[1].value === "12345") {
    localStorage.setItem("user", "user1");
    window.location.replace("../pages/main.html");
  }
}
