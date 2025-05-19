let users = JSON.parse(localStorage.getItem('usuarios')) || [];

let lastId = 0;
users = users.map(user => {
  if (!user.id) {
    lastId++;
    user.id = lastId;
  } else {
    if (user.id > lastId) {
      lastId = user.id;
    }
  }

  user.data = user.data || new Date().toLocaleDateString('pt-BR');
  user.senha = user.senha || "";
  return user;
});

saveUsers();

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

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editNome').value = user.nome;
  document.getElementById('editEmail').value = user.email;

  document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveUserEdit() {
  const id = parseInt(document.getElementById('editUserId').value);
  const nome = document.getElementById('editNome').value;
  const email = document.getElementById('editEmail').value;

  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index].nome = nome;
    users[index].email = email;
    saveUsers();
    renderUsers();
    closeEditModal();
  }
}

function deleteUser(id) {
  document.getElementById('deleteUserId').value = id;
  document.getElementById('confirmDeleteModal').style.display = 'flex';
}

function confirmDeleteUser() {
  const id = parseInt(document.getElementById('deleteUserId').value);
  const index = users.findIndex(user => user.id === id);
  if (index > -1) {
    users.splice(index, 1);
    saveUsers();
    renderUsers();
    closeDeleteModal();
  }
}

function closeDeleteModal() {
  document.getElementById('confirmDeleteModal').style.display = 'none';
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderUsers(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => renderUsers());
