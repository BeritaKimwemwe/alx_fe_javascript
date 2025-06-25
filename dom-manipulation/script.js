// ✅ Quotes array with text and category
let quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// ✅ Function to select and display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// ✅ Function to add a new quote to the array and update the DOM
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    displayRandomQuote(); // Optionally show the new quote
  }
}

// ✅ Event listener for the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
