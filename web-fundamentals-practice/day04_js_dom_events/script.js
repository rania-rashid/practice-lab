// Without defer, the script runs before the body, so querySelector returns null and addEventListener throws an error.
const btn = document.querySelector("#theme-btn");
btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});
const buttons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll(".card");

buttons.forEach((b) => {
  b.addEventListener("click", () => {
    const tag = b.dataset.filter;
    console.log(tag);
    cards.forEach((c) => {
      c.hidden = !(tag === "all" || c.dataset.tag === tag);
    });
  });
});

// The first listener toggles the dark class so CSS can swap the theme variables.
// The second listener reads each button's data-filter value to choose visible cards.
// The console log helps me check which filter button was clicked while debugging.