let users = JSON.parse(localStorage.getItem('usuarios')) || [];

users = users.map((user, index) => ({
  id: user.id || index + 1,
  nome: user.nome,
  email: user.email,
  data: user.data || new Date().toLocaleDateString('pt-BR'),
  senha: user.senha || ""
}));

function saveUsers() {
  localStorage.setItem('usuarios', JSON.stringify(users));
}

function renderUsers(filter = "") {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = "";

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(filter.toLowerCase())
  );

  filteredUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td>${user.data}</td>
      <td>
        <button class="edit-btn" onclick="editUser(${user.id})">EDITAR</button>
        <button class="delete-btn" onclick="deleteUser(${user.id})">EXCLUIR</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('userCount').innerText = filteredUsers.length;
}

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  const newName = prompt("Editar nome:", user.nome);
  const newEmail = prompt("Editar e-mail:", user.email);
  const newDate = prompt("Editar data:", user.data);

  if (newName && newEmail && newDate) {
    user.nome = newName;
    user.email = newEmail;
    user.data = newDate;
    saveUsers();
    renderUsers();
  }
}

function deleteUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index > -1) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      users.splice(index, 1);
      saveUsers();
      renderUsers();
    }
  }
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderUsers(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => renderUsers());
