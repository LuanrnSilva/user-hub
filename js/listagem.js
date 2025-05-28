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

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado && usuarioLogado.email === users[index].email) {
      usuarioLogado.nome = nome;
      usuarioLogado.email = email;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      window.location.reload();
    } else {
      renderUsers();
    }

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
    const userToDelete = users[index];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const isSameUser = usuarioLogado && usuarioLogado.email === userToDelete.email;

    users.splice(index, 1);
    saveUsers();
    renderUsers();
    closeDeleteModal();

    if (isSameUser) {
      localStorage.removeItem('usuarioLogado');
      window.location.href = "login.html";
    }
  }
}

function closeDeleteModal() {
  document.getElementById('confirmDeleteModal').style.display = 'none';
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderUsers(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
  renderUsers();

  const userIconImg = document.getElementById('userIconImg');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usernameSpan = document.getElementById('username');

  if (!usuarioLogado) {
    window.location.href = 'login.html';
  } else {
    const profileImage = usuarioLogado.profileImage || localStorage.getItem('profileImage');
    userIconImg.src = profileImage || './assets/logo.png';

    userIconImg.style.width = '32px';
    userIconImg.style.height = '32px';

    if (profileImage) {
      userIconImg.style.borderRadius = '50%';
      userIconImg.style.objectFit = 'cover';
    } else {
      userIconImg.style.borderRadius = '0';
      userIconImg.style.objectFit = 'contain';
    }

    const nomeFormatado = formatarNome(usuarioLogado.nome || usuarioLogado.email.split('@')[0]);
    usernameSpan.textContent = nomeFormatado;
  }
});

function formatarNome(nome) {
  return nome
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}