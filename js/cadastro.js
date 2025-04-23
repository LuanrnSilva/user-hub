document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerform");
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const erro = document.getElementById("cadastroErro");
    const sucesso = document.getElementById("cadastroSucesso");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const senha = senhaInput.value;
  
      if (!validarEmail(email)) {
        erro.textContent = "E-mail inválido.";
        sucesso.textContent = "";
        return;
      }
  
      if (!senhaForte(senha)) {
        erro.textContent = "A senha deve ter no mínimo 6 caracteres.";
        sucesso.textContent = "";
        return;
      }
  
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
      const emailExiste = usuarios.some((user) => user.email === email);
  
      if (emailExiste) {
        erro.textContent = "E-mail já cadastrado.";
        sucesso.textContent = "";
        return;
      }
  
      const novoUsuario = { nome, email, senha };
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
      erro.textContent = "";
      sucesso.textContent = "Cadastro realizado com sucesso!";
  
      form.reset();
    });
  
    function validarEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }
  
    function senhaForte(senha) {
      return senha.length >= 6;
    }
  });
  