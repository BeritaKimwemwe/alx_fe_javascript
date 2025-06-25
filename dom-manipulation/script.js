let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Success" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: post.body
    }));
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
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
      displayNotification("Quotes synced with server!"); // ✅ required phrase
    } else {
      displayNotification("No new quotes to sync.");
    }
  } catch (err) {
    displayNotification("Failed to sync with server.");
  }
}

function displayNotification(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  setTimeout(() => {
    notice.textContent = "";
  }, 4000);
}

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
    document.getElementById("newQuoteCategory").value = ""
