function signIn() {
  event.preventDefault();
  let ev = event;
  fetch("http://localhost:8080/login", {
    method: "POST",
    body: JSON.stringify({
      username: event.target[0].value,
      password: event.target[1].value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((token) => {
      localStorage.setItem("token", JSON.parse(token));
      localStorage.setItem("user", ev.target[0].value);
      window.location.replace("../pages/main.html");
    })
    .catch(() => {
      document.getElementsByClassName("fail")[0].style.display = "block";
    });
}
