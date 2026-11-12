const assignments = [
  { id: 1, course: "JavaScript", title: "Array Methods", weight: 15, deadline: "2026-11-08" },
  { id: 2, course: "Python", title: "Data Cleaning", weight: 20, deadline: "2026-11-18" },
  { id: 3, course: "Databases", title: "SQL Practice", weight: 15, deadline: "2026-11-20" },
  { id: 4, course: "Web Design", title: "Layout Project", weight: 25, deadline: "2026-12-01" },
  { id: 5, course: "Statistics", title: "Probability Quiz", weight: 10, deadline: "2026-11-12" },
  { id: 6, course: "JavaScript", title: "DOM Events", weight: 15, deadline: "2026-11-25" },
];

// Prediction: this prints 0.30000000000000004, not exactly 0.3.
// Decimal numbers cannot always be stored perfectly in binary.
console.log("0.1 + 0.2 =", 0.1 + 0.2);

const tableBody = document.querySelector("#assignment-body");
const emptyMessage = document.querySelector("#empty-message");
const totalWeight = document.querySelector("#total-weight");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const form = document.querySelector("#assignment-form");

function parseDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateStatus(deadline) {
  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const days = Math.round(
    (parseDate(deadline) - todayOnly) / (1000 * 60 * 60 * 24)
  );

  if (days < 0) {
    return `<span class="overdue-badge">Overdue</span> ${Math.abs(days)} days overdue`;
  }
  if (days === 0) {
    return "Due today";
  }
  return `${days} days left`;
}

function renderTable(list) {
  // Prediction: calling this twice replaces the old rows instead of duplicating them.
  tableBody.innerHTML = list
    .map(
      (assignment) => `
        <tr>
          <td>${assignment.course}</td>
          <td>${assignment.title}</td>
          <td>${assignment.weight}%</td>
          <td>${assignment.deadline}</td>
          <td>${dateStatus(assignment.deadline)}</td>
        </tr>
      `
    )
    .join("");

  emptyMessage.hidden = list.length !== 0;

  // Prediction: an empty list totals 0, so 0 is the reduce starting value.
  const total = list.reduce(
    (sum, assignment) => sum + assignment.weight,
    0
  );
  totalWeight.textContent = `Total weight: ${total}%`;
}

function displayAssignments() {
  // Prediction: input fires while typing; change fires after a completed change.
  const search = searchInput.value.trim().toLowerCase();
  const filtered = assignments.filter(
    (assignment) =>
      assignment.course.toLowerCase().includes(search) ||
      assignment.title.toLowerCase().includes(search)
  );

  // Prediction: sort() changes an array, so sort a copy instead.
  const sorted = [...filtered];

  if (sortSelect.value === "course") {
    sorted.sort((a, b) => a.course.localeCompare(b.course));
  } else if (sortSelect.value === "weight") {
    sorted.sort((a, b) => b.weight - a.weight);
  } else {
    sorted.sort((a, b) => parseDate(a.deadline) - parseDate(b.deadline));
  }

  renderTable(sorted);
}

function showError(field, message) {
  document.querySelector(`#${field}-error`).textContent = message;
}

function validDate(dateText) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return false;
  }

  const [year, month, day] = dateText.split("-").map(Number);
  const date = parseDate(dateText);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelectorAll("small").forEach((error) => {
    error.textContent = "";
  });

  const course = document.querySelector("#course").value.trim();
  const title = document.querySelector("#title").value.trim();
  const weightText = document.querySelector("#weight").value.trim();
  const weight = Number(weightText);
  const deadline = document.querySelector("#deadline").value;
  let valid = true;

  if (course === "") {
    showError("course", "Course is required.");
    valid = false;
  }
  if (title === "") {
    showError("title", "Title is required.");
    valid = false;
  }

  // Prediction: Number("") is 0, while Number("12abc") is NaN.
  if (
    weightText === "" ||
    !Number.isInteger(weight) ||
    weight < 1 ||
    weight > 100
  ) {
    showError("weight", "Use a whole number from 1 to 100.");
    valid = false;
  }
  if (!validDate(deadline)) {
    showError("deadline", "Enter a valid date.");
    valid = false;
  }

  if (!valid) {
    return;
  }

  assignments.push({
    id: Date.now(),
    course,
    title,
    weight,
    deadline,
  });
  form.reset();
  displayAssignments();
});

// Prediction: YYYY-MM-DD can be treated as UTC by new Date(string), which
// can show the previous day in some timezones. parseDate creates a local date.
searchInput.addEventListener("input", displayAssignments);
sortSelect.addEventListener("change", displayAssignments);
displayAssignments();
