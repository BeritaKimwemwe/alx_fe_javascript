let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote from the selected category
function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote and update UI
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Update category filter dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map(q => q.category));

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    dropdown.value = saved;
    filterQuotes();
  }
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully.");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Sync with server (simulated)
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const simulatedQuotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: post.body
      }));

      let updated = false;

      simulatedQuotes.forEach(serverQuote => {
        const exists = quotes.some(q => q.text === serverQuote.text);
        if (!exists) {
          quotes.push(serverQuote);
          updated = true;
        }
      });

      if (updated) {
        saveQuotes();
        populateCategories();
        document.getElementById("syncNotice").textContent = "Quotes synced with server.";
        setTimeout(() => {
          document.getElementById("syncNotice").textContent = "";
        }, 5000);
      }
    })
    .catch(() => {
      document.getElementById("syncNotice").textContent = "Failed to sync with server.";
    });
}

// On page load
window.onload = function () {
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" — ${q.category}`;
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  setInterval(syncWithServer, 30000); // auto sync every 30s
};
