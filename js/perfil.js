const fileInput = document.getElementById('fileInput');
const userPhoto = document.getElementById('userPhoto');
const DEFAULT_IMAGE = './assets/logo.png';

window.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  // Foto de perfil
  const profileImage = usuarioLogado.profileImage || localStorage.getItem('profileImage');
  userPhoto.src = profileImage || DEFAULT_IMAGE;

  // Informações do usuário
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === usuarioLogado.email);

  if (usuario) {
    document.getElementById('userId').textContent = usuario.id;
    document.getElementById('userName').textContent = usuario.nome;
    document.getElementById('userEmail').textContent = usuario.email;
  }
});

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      userPhoto.src = imageData;

      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      if (usuarioLogado) {
        usuarioLogado.profileImage = imageData;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      }

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const userIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
      if (userIndex !== -1) {
        usuarios[userIndex].profileImage = imageData;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }

      localStorage.setItem('profileImage', imageData);
    };
    reader.readAsDataURL(file);
  }
});

function removePhoto() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const userIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
  if (userIndex !== -1) {
    delete usuarios[userIndex].profileImage;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    delete usuarioLogado.profileImage;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
  }

  localStorage.removeItem('profileImage');

  userPhoto.src = DEFAULT_IMAGE;
  setTimeout(() => {
    location.reload();
  }, 100);
}

function goBack() {
  window.location.href = 'tmdb.html';
}
