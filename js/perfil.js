const fileInput = document.getElementById('fileInput');
const userPhoto = document.getElementById('userPhoto');
const DEFAULT_IMAGE = './assets/logo.png';

window.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  const profileImage = usuarioLogado.profileImage || localStorage.getItem('profileImage');
  userPhoto.src = profileImage || DEFAULT_IMAGE;

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
  userPhoto.src = 'default-profile.png';
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
}

function goBack() {
  window.location.href = 'tmdb.html';
}

window.addEventListener("DOMContentLoaded", () => {

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) return;
const usuario = usuarios.find(u => u.email === usuarioLogado.email);


  document.getElementById("userId").textContent        = usuario.id;
  document.getElementById("userName").textContent      = usuario.nome;
  document.getElementById("userEmail").textContent     = usuario.email;
});
