let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Success" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch quotes from mock API
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data =>
      data.slice(0, 5).map(post => ({
        text: post.title,
        category: post.body
      }))
    );
}

// Post quote to mock API (simulated)
function postQuoteToServer(quote) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => console.log("Posted to server:", data));
}

// Sync quotes with server and resolve conflicts
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      displayNotification("Quotes synced from server.");
    }
  }).catch(() => {
    displayNotification("Failed to sync with server.");
  });
}

// Show notification
function displayNotification(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  setTimeout(() => {
    notice.textContent = "";
  }, 4000);
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes found in this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    populateCategories();
    showRandomQuote();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Populate categories in the dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    dropdown.value = savedFilter;
    filterQuotes();
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes as JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        let updated = false;
        imported.forEach(q => {
          if (!quotes.some(existing => existing.text === q.text)) {
            quotes.push(q);
            updated = true;
          }
        });

        if (updated) {
          saveQuotes();
          populateCategories();
          displayNotification("Quotes imported successfully.");
        }
      }
    } catch {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Initialization
window.onload = function () {
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent = `"${q.text}" — ${q.category}`;
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  setInterval(syncQuotes, 30000); // automatic sync every 30 seconds
};
