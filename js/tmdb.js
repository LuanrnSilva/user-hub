const searchInput = document.getElementById('searchInput');
const filmesList = document.getElementById('filmesList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalTrailer = document.getElementById('modalTrailer');
const modalSinopse = document.getElementById('modalSinopse');
const closeModal = document.getElementById('closeModal');
const paginacaoDiv = document.getElementById('paginacao');
const usernameSpan = document.getElementById('username');
const userIcon = document.querySelector('.user-icon');
const dropdown = document.querySelector('.dropdown-content');
const logoutBtn = document.getElementById('sair');
const perfilBtn = document.getElementById('perfil');
const listaUsuariosBtn = document.getElementById('listaUsuarios');

const apiKey = '185fa5d6f93e082e1c3b92a59382e618';
const baseImgUrl = 'https://image.tmdb.org/t/p/w500';
let currentPage = 1;
let totalPages = 1;
let isSearching = false;
let currentQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  let nomeUsuario = usuarioLogado.nome || usuarioLogado.email.split('@')[0];

  nomeUsuario = nomeUsuario
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
  usernameSpan.textContent = nomeUsuario;

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  });

  perfilBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert(`Perfil de ${usuarioLogado.nome || usuarioLogado.email}`);
  });

  listaUsuariosBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'listagem.html';
  });
});

if (userIcon && dropdown) {
  userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !userIcon.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

async function carregarPopulares(page = 1) {
  isSearching = false;
  currentPage = page;
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`);
  const data = await response.json();
  totalPages = data.total_pages > 500 ? 500 : data.total_pages;
  mostrarFilmes(data.results.slice(0, 18));
  criarPaginacao(page);
}

window.addEventListener('load', () => carregarPopulares(1));

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  currentQuery = query;
  
  if (query.length > 0) {
    isSearching = true;
    buscarFilmes(query, 1);
  } else {
    carregarPopulares(1);
  }
});

async function buscarFilmes(query, page = 1) {
  currentPage = page;
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR&page=${page}`);
  const data = await response.json();
  totalPages = data.total_pages > 500 ? 500 : data.total_pages;
  mostrarFilmes(data.results.slice(0, 18));
  criarPaginacao(page);
}

function mostrarFilmes(filmes) {
  filmesList.innerHTML = '';

  if (!filmes || filmes.length === 0) {
    filmesList.innerHTML = '<p class="sem-resultados">Nenhum filme encontrado.</p>';
    paginacaoDiv.innerHTML = '';
    return;
  }

  filmes.forEach(filme => {
    if (!filme.poster_path) return;
    
    const filmeCard = document.createElement('div');
    filmeCard.classList.add('filme-card');
    filmeCard.innerHTML = `
      <img src="${baseImgUrl}${filme.poster_path}" alt="${filme.title}" onerror="this.src='https://via.placeholder.com/500x750?text=Poster+Não+Disponível'">
      <h3>${filme.title}</h3>
    `;
    filmeCard.addEventListener('click', () => abrirModal(filme.id));
    filmesList.appendChild(filmeCard);
  });
}

function criarPaginacao(currentPage) {
  paginacaoDiv.innerHTML = '';
  
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '«';
    prevBtn.classList.add('pagina-btn');
    prevBtn.addEventListener('click', () => {
      if (isSearching) {
        buscarFilmes(currentQuery, currentPage - 1);
      } else {
        carregarPopulares(currentPage - 1);
      }
    });
    paginacaoDiv.appendChild(prevBtn);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.add('pagina-btn');
    if (i === currentPage) {
      pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () => {
      if (isSearching) {
        buscarFilmes(currentQuery, i);
      } else {
        carregarPopulares(i);
      }
    });
    paginacaoDiv.appendChild(pageBtn);
  }
  
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '»';
    nextBtn.classList.add('pagina-btn');
    nextBtn.addEventListener('click', () => {
      if (isSearching) {
        buscarFilmes(currentQuery, currentPage + 1);
      } else {
        carregarPopulares(currentPage + 1);
      }
    });
    paginacaoDiv.appendChild(nextBtn);
  }
}

async function abrirModal(filmeId) {
  const responseDetalhes = await fetch(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`);
  const detalhes = await responseDetalhes.json();

  const responseVideos = await fetch(`https://api.themoviedb.org/3/movie/${filmeId}/videos?api_key=${apiKey}&language=pt-BR`);
  const videos = await responseVideos.json();
  const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  modalTitle.textContent = detalhes.title;
  modalSinopse.innerHTML = `<strong>Sinopse:</strong> ${detalhes.overview || 'Sinopse indisponível.'}`;
  modalTrailer.src = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  modalTrailer.src = '';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modalTrailer.src = '';
  }
});