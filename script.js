// Simple points calculator logic.
// NOTE: Adjust the points to match official Chancenkarte rules if needed.

function calculateScore() {
  const education = Number(document.getElementById("education").value);
  const language = Number(document.getElementById("language").value);

  // Experience
  const expButtons = document.querySelectorAll("#experience-group .btn-chip");
  let experience = 0;
  expButtons.forEach((btn) => {
    if (btn.classList.contains("btn-chip-active")) {
      experience = Number(btn.dataset.points);
    }
  });

  // Age
  const ageInput = document.getElementById("age");
  const age = Number(ageInput.value);
  let agePoints = 0;
  if (age < 35) agePoints = 2;
  else if (age <= 40) agePoints = 1;

  // Bonus
  const livedGermany = document.getElementById("lived-germany").checked ? 1 : 0;
  const spouse = document.getElementById("spouse-qualifies").checked ? 1 : 0;

  const total = education + language + experience + agePoints + livedGermany + spouse;

  const scoreValue = document.getElementById("score-value");
  const scoreMessage = document.getElementById("score-message");

  scoreValue.textContent = total;

  if (total >= 6) {
    scoreMessage.textContent =
      "Great news! Based on your inputs, you are likely to meet the 6-point requirement for the Opportunity Card (Path 2).";
  } else {
    scoreMessage.textContent =
      "You are currently below 6 points. Consider improving your language level, gaining more work experience, or exploring recognition of your degree.";
  }
}

function resetCalculator() {
  document.getElementById("education").value = "0";
  document.getElementById("language").value = "1";

  const expButtons = document.querySelectorAll("#experience-group .btn-chip");
  expButtons.forEach((btn, idx) => {
    btn.classList.toggle("btn-chip-active", idx === 0);
  });

  const ageInput = document.getElementById("age");
  ageInput.value = 30;
  document.getElementById("age-label").textContent = "30";

  document.getElementById("lived-germany").checked = false;
  document.getElementById("spouse-qualifies").checked = false;

  document.getElementById("score-value").textContent = "0";
  document.getElementById("score-message").textContent =
    "Select your options to see if you qualify for the Opportunity Card.";
}

document.addEventListener("DOMContentLoaded", () => {
  // Experience chip toggles
  const expButtons = document.querySelectorAll("#experience-group .btn-chip");
  expButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      expButtons.forEach((b) => b.classList.remove("btn-chip-active"));
      btn.classList.add("btn-chip-active");
      calculateScore();
    });
  });

  // Age slider
  const ageInput = document.getElementById("age");
  const ageLabel = document.getElementById("age-label");
  ageInput.addEventListener("input", () => {
    ageLabel.textContent = ageInput.value;
  });
  ageInput.addEventListener("change", calculateScore);

  // Select fields
  document.getElementById("education").addEventListener("change", calculateScore);
  document.getElementById("language").addEventListener("change", calculateScore);

  // Checkboxes
  document.getElementById("lived-germany").addEventListener("change", calculateScore);
  document.getElementById("spouse-qualifies").addEventListener("change", calculateScore);

  // Buttons
  document
    .getElementById("check-eligibility")
    .addEventListener("click", calculateScore);

  document.getElementById("reset-form").addEventListener("click", resetCalculator);

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initial state
  resetCalculator();
});
