// ✅ Initial quotes array
let quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// ✅ Create dropdown and form dynamically
function createAddQuoteForm() {
  const body = document.body;

  // Category filter dropdown
  const categorySelect = document.createElement("select");
  categorySelect.id = "quoteCategoryFilter";
  const defaultOption = document.createElement("option");
  defaultOption.value = "All";
  defaultOption.innerText = "All Categories";
  categorySelect.appendChild(defaultOption);
  body.insertBefore(categorySelect, document.getElementById("newQuote"));

  // Listen to dropdown changes
  categorySelect.addEventListener("change", showRandomQuote);

  // Inputs for new quote
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.onclick = addQuote;

  // Append inputs to the body
  body.appendChild(document.createElement("br"));
  body.appendChild(inputText);
  body.appendChild(inputCategory);
  body.appendChild(addButton);
}

// ✅ Function to show a random quote based on selected category
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
}

// ✅ Function to add a new quote and update category dropdown
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  const select = document.getElementById("quoteCategoryFilter");

  if (text !== "" && category !== "") {
    quotes.push({ text, category });

    // Add new category to dropdown if not already present
    let exists = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.toLowerCase() === category.toLowerCase()) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const newOption = document.createElement("option");
      newOption.value = category;
      newOption.innerText = category;
      select.appendChild(newOption);
    }

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
  }
}

// ✅ Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ Build the dynamic form on page load
createAddQuoteForm();
