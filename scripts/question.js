document.addEventListener("DOMContentLoaded", () => {
  let questionContainer = document.getElementsByClassName("question")[0];
  questionContainer.innerHTML = localStorage.getItem("question");

  let prompt = JSON.parse(localStorage.getItem("prompt"));
  document.getElementsByClassName("code-input")[0].textContent = prompt.input;
  document.getElementsByClassName("code-expected")[0].textContent =
    prompt.expected;

  let questionInfo = JSON.parse(localStorage.getItem("question-info"));
  document
    .getElementsByClassName("submit-button")[0]
    .addEventListener("click", () => {
      fetch(
        "http://localhost:8080/solve/" +
          (parseInt(questionInfo.week) - 1).toString() +
          "/" +
          questionInfo.question,
        {
          method: "POST",
          body: JSON.stringify({
            solution: document.getElementsByTagName("textarea")[0].value,
            token: localStorage.getItem("token"),
            username: localStorage.getItem("user"),
          }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            window.location.replace("./week.html");
          } else {
            document.getElementsByClassName("code-input")[0].textContent =
              json.input;
            document.getElementsByClassName("code-output")[0].textContent =
              json.output;
            document.getElementsByClassName("code-expected")[0].textContent =
              json.expected;
          }
        });
    });
});
