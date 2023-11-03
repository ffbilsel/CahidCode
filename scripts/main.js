let json = document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/weeks", {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
      username: localStorage.getItem("user"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((weeks) => {
      weeks.forEach((week, index) => {
        let weekDiv = document.createElement("div");
        weekDiv.className = "week-div";
        weekDiv.onclick = () => {
          fetch("http://localhost:8080/weeks/" + (parseInt(index) + 1), {
            method: "POST",
            body: JSON.stringify({
              token: localStorage.getItem("token"),
              username: localStorage.getItem("user"),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              localStorage.setItem("questions", JSON.stringify(json));
              localStorage.setItem("week", JSON.stringify(parseInt(index + 1)));
              window.location.replace("./week.html");
            });
        };

        let textDiv = document.createElement("div");
        textDiv.textContent = parseInt(index) + 1 + ". Hafta";
        textDiv.className = "text-div";
        textDiv.style.backgroundColor =
          week.nofQuestions === week.completed ? "green" : "red";
        weekDiv.appendChild(textDiv);

        let ratioCircle = document.createElement("div");
        let circleCss =
          "width: 50px; height:50px; border-radius: 50%; background-color: red; margin-right: 3rem;";
        let deg = Math.trunc(
          (week.completed / week.nofQuestions) * 360 + 90
        ).toString();
        circleCss +=
          "background-image: linear-gradient(" +
          deg +
          "deg, transparent 50%, green 50%), linear-gradient(90deg, green 50%, transparent 50%);";
        ratioCircle.style = circleCss;
        weekDiv.appendChild(ratioCircle);

        let ratioText = document.createElement("div");
        ratioText.textContent = week.completed + " / " + week.nofQuestions;
        weekDiv.appendChild(ratioText);

        document.getElementsByClassName("weeks")[0].appendChild(weekDiv);
      });
    });
});
