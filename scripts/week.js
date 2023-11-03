document.addEventListener("DOMContentLoaded", () => {
  let questions = JSON.parse(localStorage.getItem("questions"));
  let questionContainer = document.getElementsByClassName("inner-container")[0];

  questions.forEach((question) => {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = question.html;
    tempDiv.style.border =
      "3px solid " + (question.type === "class" ? "yellow" : "green");
    tempDiv.style.backgroundColor = question.solved
      ? "rgba(0, 255, 0, 0.2)"
      : "white";
    tempDiv.className = "question";
    tempDiv.onclick = () => {
      localStorage.setItem("question", question.html);
      localStorage.setItem(
        "prompt",
        JSON.stringify({ input: question.input, expected: question.expected })
      );
      window.location.replace("./question.html");
    };
    questionContainer.appendChild(tempDiv);
  });

  document.getElementsByClassName(
    "week-info"
  )[0].innerHTML = `${localStorage.getItem(
    "week"
  )}. Hafta<span style="margin-left: 2rem;">
        ${questions.filter((q) => q.solved).length}/${questions.length}</span>`;
});
