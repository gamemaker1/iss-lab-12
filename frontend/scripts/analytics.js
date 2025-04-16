const baseURL = "http://localhost:8000";

async function loadAnalytics() {
  try {
    const res = await fetch(`${baseURL}/analytics`);
    if (!res.ok) {
      console.error("Failed to fetch analytics data");
      return;
    }

    const data = await res.json();
  
    document.getElementById("itemCount").textContent = data.stats.item_count || 0;
    document.getElementById("userCount").textContent = data.stats.user_count || 0;
    document.getElementById("avgItemName").textContent = data.stats.avg_item_name_length.toFixed(2) || 0;
    document.getElementById("avgUserName").textContent = data.stats.avg_user_username_length.toFixed(2) || 0;
    document.getElementById("maxItemName").textContent = data.stats.max_item_name_length || 0;
    document.getElementById("maxUserName").textContent = data.stats.max_user_username_length || 0;

    if (data.plot) {
      document.getElementById("plot").src = data.plot;
    }
  } 
  catch (error) {
    console.error("Error loading analytics:", error);
  }
}

loadAnalytics();