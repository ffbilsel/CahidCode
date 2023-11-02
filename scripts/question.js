document.addEventListener("DOMContentLoaded", () => {
  let questionContainer = document.getElementsByClassName("question")[0];
  questionContainer.innerHTML = localStorage.getItem("question");

  document
    .getElementsByClassName("submit-button")[0]
    .addEventListener("click", () => {
      fetch(
        "../scripts/question1_b.json"
        // {
        //   method: "POST",
        //   body: JSON.stringify(document.getElementsByTagName("textarea")[0].value),
        // }
      )
        .then((res) => res.json())
        .then((json) => {
          document.getElementsByClassName("code-input")[0].textContent =
            json.input;
          document.getElementsByClassName("code-output")[0].textContent =
            json.output;
          document.getElementsByClassName("code-expected")[0].textContent =
            json.expected;
        });
    });
});
