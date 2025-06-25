// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote based on selected category
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

  // Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add a new quote
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

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategoryDropdown();
      }
    } catch {
      alert('Invalid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Dynamically create input form and category filter
function createAddQuoteForm() {
  const body = document.body;

  // Dropdown
  const select = document.createElement("select");
  select.id = "quoteCategoryFilter";
  body.insertBefore(select, document.getElementById("newQuote"));

  // Add All option first
  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.innerText = "All Categories";
  select.appendChild(allOption);
  populateCategoryDropdown();

  select.addEventListener("change", showRandomQuote);

  // Inputs
  const input1 = document.createElement("input");
  input1.id = "newQuoteText";
  input1.placeholder = "Enter a new quote";

  const input2 = document.createElement("input");
  input2.id = "newQuoteCategory";
  input2.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.innerText = "Add Quote";
  addBtn.onclick = addQuote;

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.onchange = importFromJsonFile;

  const exportBtn = document.createElement("button");
  exportBtn.innerText = "Export Quotes";
  exportBtn.onclick = exportToJsonFile;

  body.appendChild(document.createElement("br"));
  body.appendChild(input1);
  body.appendChild(input2);
  body.appendChild(addBtn);
  body.appendChild(document.createElement("br"));
  body.appendChild(importInput);
  body.appendChild(exportBtn);
}

// Populate category dropdown (rebuilds from quotes array)
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

// Event listener for Show New Quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Build everything on page load
createAddQuoteForm();

// Auto-display last viewed quote if in sessionStorage
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — ${quote.category}`;
}
