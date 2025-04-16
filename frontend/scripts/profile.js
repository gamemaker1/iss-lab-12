const baseURL = "http://localhost:8000"; // baseURL was not added previously but used in the code later
async function loadUsers(query = "") {
  const loading = document.getElementById('loading');
  loading.style.display = "block";
  const res = await fetch(`${baseURL}/users/`); //wrong url again
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";
  
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  )
  document.getElementById("userCount").textContent = `Total users: ${filteredUsers.length}`;
  filteredUsers.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.username}: ${user.bio}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" });
      loadUsers(document.getElementById('search').value);
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
  loading.style.display = "none";
}

document.getElementById("search").addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();
  const res = await fetch(`${baseURL}/users/`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";

  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(term));
  document.getElementById("userCount").textContent = `Total users: ${filteredUsers.length}`;

  filteredUsers.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.username}: ${user.bio}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" }); // wrong fetch url
      loadUsers(document.getElementById('search').value);
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
});

loadUsers();

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const bio = document.getElementById("bio").value;
  await fetch(`${baseURL}/users/`, { //again wrong url
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, bio })
  });
  e.target.reset();
  loadUsers(document.getElementById('search').value);
  return;
});
