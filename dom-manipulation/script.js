// ✅ Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = document.getElementById("quoteCategoryFilter").value;
  const filteredQuotes = selectedCategory === "All"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;

  // ✅ Store in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ✅ Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  const select = document.getElementById("quoteCategoryFilter");

  if (text !== "" && category !== "") {
    quotes.push({ text, category });
    saveQuotes();

    // Add new category to dropdown if needed
    let exists = [...select.options].some(opt => opt.value.toLowerCase() === category.toLowerCase());
    if (!exists) {
      const newOption = document.createElement("option");
      newOption.value = category;
      newOption.innerText = category;
      select.appendChild(newOption);
    }

    // Clear input
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
  }
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        populateCategoryDropdown();
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Populate category dropdown with unique categories
function populateCategoryDropdown() {
  const select = document.getElementById("quoteCategoryFilter");
  const existing = new Set();

  // Clear all except "All"
  [...select.options].forEach((opt, i) => {
    if (i > 0) select.removeChild(opt);
  });

  quotes.forEach(q => {
    if (!existing.has(q.category)) {
      const opt = document.createElement("option");
      opt.value = q.category;
      opt.innerText = q.category;
      select.appendChild(opt);
      existing.add(q.category);
    }
  });
}

// ✅ Load previous session quote if available
window.onload = function () {
  // Show last viewed quote (from sessionStorage)
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — ${quote.category}`;
  }

  // Initial dropdown population
  populateCategoryDropdown();

  // Attach event listener
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};
