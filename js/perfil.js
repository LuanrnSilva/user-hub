const fileInput = document.getElementById('fileInput');
const userPhoto = document.getElementById('userPhoto');

// vai carregar imagem salva
window.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    userPhoto.src = savedImage;
  }
});

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      userPhoto.src = imageData;
      localStorage.setItem('profileImage', imageData); // esse vai salvar no localstorage
    };
    reader.readAsDataURL(file);
  }
});

function removePhoto() {
  userPhoto.src = 'default-profile.png';
  localStorage.removeItem('profileImage'); // esse vai remover do localstorage
}

function goBack() {
  window.location.href = 'tmdb.html';
}

window.addEventListener("DOMContentLoaded", () => {

  // dados dos usuários
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) return;
const usuario = usuarios.find(u => u.email === usuarioLogado.email);


  document.getElementById("userId").textContent        = usuario.id;
  document.getElementById("userName").textContent      = usuario.nome;
  document.getElementById("userEmail").textContent     = usuario.email;
  document.getElementById("userDate").textContent      = usuario.dataCadastro;
});
