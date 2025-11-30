function parsePrice(priceText) {
  return parseInt(priceText.replace(/[$,]/g, ""));
}

function parseDuration(dateText) {
  // Example: "15 Oct - 25 Oct 2023"
  const parts = dateText.split("-");
  const start = parts[0].trim() + " " + dateText.split(" ").pop(); // add year
  const end = parts[1].trim();

  const startDate = new Date(start);
  const endDate = new Date(end);

  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

const container = document.querySelector(".trips-row");
const cards = Array.from(container.querySelectorAll(".trip-col"));

// ⭐ Save original order index
cards.forEach((card, index) => {
  card.dataset.originalIndex = index;
});

document.getElementById("tripSort").addEventListener("change", function () {
  const option = this.value;

  // create a copy for sorting
  const sortedCards = [...cards];

  sortedCards.sort((a, b) => {
    const priceA = parsePrice(a.querySelector(".trip-price-badge").innerText);
    const priceB = parsePrice(b.querySelector(".trip-price-badge").innerText);

    const durationA = parseDuration(
      a.querySelector(".trip-date-badge").innerText
    );
    const durationB = parseDuration(
      b.querySelector(".trip-date-badge").innerText
    );

    if (option === "price-asc") return priceA - priceB;
    if (option === "price-desc") return priceB - priceA;
    if (option === "duration-asc") return durationA - durationB;
    if (option === "duration-desc") return durationB - durationA;

    // ⭐ Default: return to original order
    if (option === "") return a.dataset.originalIndex - b.dataset.originalIndex;

    return 0;
  });

  sortedCards.forEach((card) => container.appendChild(card));
});
