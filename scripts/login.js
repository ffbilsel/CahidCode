function signIn() {
  event.preventDefault();
  fetch("http://localhost:8080/login/", {
    method: "POST",
    body: JSON.stringify({
      username: event.target[0].value,
      password: event.target[1].value,
    }),
  })
    .then((res) => res.body())
    .then((token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", event.target[0].value);
      window.location.replace("../pages/main.html");
    })
    .catch(() => {
      document.getElementsByClassName("fail")[0].style.display = block;
    });
}
