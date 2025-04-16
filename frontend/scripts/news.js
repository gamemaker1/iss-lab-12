const rssConverter = "https://api.rss2json.com/v1/api.json?rss_url=";
const feeds = [
  { name: "bbc", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "guardian", url: "https://www.theguardian.com/international/rss" }
];
let allArticles = [];

async function loadNews(searchTerm = "", source = "all", reset = false) {
  const list = document.getElementById("newsList");
  const loading = document.getElementById("loading");
  // const initialMessage = document.getElementById("initialMessage"); removed this line as redundant and not used anywhere else
  
  if (reset) {
    allArticles = [];
  }
  
  list.innerHTML = "";
  
  loading.style.display = "block";
  
  try {
    const selectedFeeds = source === "all" ? feeds : feeds.filter(f => f.name === source);
    
    if (reset || allArticles.length === 0) {
      for (const feed of selectedFeeds) {
        const res = await fetch(`${rssConverter}${encodeURIComponent(feed.url)}`);
        if (!res.ok) throw new Error(`Failed to fetch ${feed.name}`);
        
        const data = await res.json();
        const articles = (data.items || []).map(item => ({
          title: item.title || "No title",
          description: item.description || "No description",
          url: item.link || "#",
          source: feed.name.toUpperCase(),
          pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Unknown"
        }));
        
        allArticles.push(...articles);
      }
    }
    
    const filteredArticles = searchTerm
      ? allArticles.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allArticles;
    
    document.getElementById("articleCount").textContent = `Total articles: ${filteredArticles.length}`;
    
    if (filteredArticles.length === 0) {
      list.innerHTML = "<p>No articles found matching your criteria.</p>";
    } else {
      filteredArticles.forEach(article => {
        const div = document.createElement("div");
        div.className = "news-item";
        div.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
          <p><strong>Source:</strong> ${article.source} | 
          <strong>Date:</strong> ${article.pubDate}</p>
          <p>${article.description}</p>
        `;
        list.appendChild(div);
      });
    }
  } catch (err) {
    list.innerHTML = `<p style="color: red;">Error loading news: ${err.message}</p>`;
    console.error("News feed error:", err);
  } finally {
    loading.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  loadNews();
  
  const searchInput = document.getElementById("search");
  let searchTimeout;
  searchInput.addEventListener("input", function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadNews(this.value, document.getElementById("source").value, false);
    }, 500); 
  });
  
  const sourceSelect = document.getElementById("source");
  sourceSelect.addEventListener("change", function() {
    loadNews(document.getElementById("search").value, this.value, true);
  });
});