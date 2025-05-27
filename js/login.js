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
    
        const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);
    
        if (usuarioEncontrado) {
            const usuarioParaLogar = {
                ...usuarioEncontrado,
                profileImage: usuarioEncontrado.profileImage || null
            };
            
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioParaLogar));
            
            if (usuarioParaLogar.profileImage) {
                localStorage.setItem("profileImage", usuarioParaLogar.profileImage);
            } else {
                localStorage.removeItem("profileImage");
            }
            
            window.location.href = "tmdb.html";
        } else {
            errorMsg.textContent = "E-mail ou senha inválidos.";
            errorMsg.style.display = "block";
        }
    });

    emailInput.addEventListener("input", () => errorMsg.style.display = "none");
    senhaInput.addEventListener("input", () => errorMsg.style.display = "none");
});