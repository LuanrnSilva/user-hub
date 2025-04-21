document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const errorMsg = document.getElementById("loginError");
  
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const email = emailInput.value.trim();
      const senha = senhaInput.value;
  
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
      const usuarioEncontrado = usuarios.find(
        (user) => user.email === email && user.senha === senha
      );
  
      if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        window.location.href = "listagem.html";
      } else {
        errorMsg.textContent = "E-mail ou senha inválidos.";
      }
    });
  });
  