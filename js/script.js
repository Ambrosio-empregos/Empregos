const container = document.getElementById("jobsContainer");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");

const PRAZO_EXPIRACAO_DIAS = 30; // MUDE AQUI SE ELE PEDIR 


// Função principal
function renderVagas(lista) {
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
    return;
  }

  const porData = {};

  lista.forEach(vaga => {
    if (!porData[vaga.data]) {
      porData[vaga.data] = [];
    }
    porData[vaga.data].push(vaga);
  });

  Object.keys(porData).sort().reverse().forEach(data => {
    const section = document.createElement("section");
    section.className = "day-section";
    section.innerHTML = `<h2>Vagas de ${formatarData(data)}</h2>`;

    porData[data].slice().reverse().forEach(vaga => {
      const card = document.createElement("div");
      card.className = "job-card";

      card.innerHTML = `
        <div class="job-banner-img" onclick="abrirModalImagem('${vaga.banner}')">
          <img src="${vaga.banner}" alt="Banner ${vaga.empresa}">
        </div>

        <div class="job-info">
          <h3 class="job-title" onclick="abrirModalInfo(
            '${vaga.titulo}',
            '${vaga.empresa}',
            '${vaga.cidade}',
            '${vaga.descricaoModal}',
            '${vaga.banner}'
          )">
            ${vaga.titulo}
          </h3>

          <p><strong>${vaga.cidade} - ${obterEstado(vaga.cidade)}</strong></p>
          <p>${vaga.descricao}</p>

          <div class="buttons">
           <a 
  href="https://wa.me/${vaga.whatsapp.trim().replace(/\D/g, '')}?text=Olá%2C%20vi%20sua%20vaga%20no%20Ambrósio%20Empregos%20Londrina.%20Quero%20enviar%20meu%20currículo%20para%20a%20vaga%20de..."
  target="_blank"
  class="whatsapp"
>
  WhatsApp
</a>
            <a href="mailto:${vaga.email}" class="email">E-mail</a>
          </div>
        </div>
      `;

      section.appendChild(card);
    });

    container.appendChild(section);
  });
}

// Filtro
function filtrar() {
  const texto = searchInput.value.toLowerCase();
  const cidade = cityFilter.value;

  const filtradas = vagasAtivas.filter(vaga => {
    const matchTexto =
      vaga.titulo.toLowerCase().includes(texto) ||
      vaga.empresa.toLowerCase().includes(texto);

    const matchCidade =
      cidade === "" || vaga.cidade === cidade;

    return matchTexto && matchCidade;
  });

  function vagaEhNova(dataVaga) {
  const ultimaVisita = localStorage.getItem("ultimaVisita");
  if (!ultimaVisita) return false;

  const dataPublicacao = new Date(dataVaga + "T00:00:00");
  const dataUltimaVisita = new Date(ultimaVisita);

  return dataPublicacao > dataUltimaVisita;
}

  renderVagas(filtradas);
}

function obterEstado(cidade) {
  if (cidade === "Balneário Camboriú") {
    return "SC";
  }
  return "PR";
}


// Formatar data
function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

//FUNÇÃO VAGA EXPIRADA
function vagaExpirada(dataVaga) {
  const hoje = new Date();
  const dataPublicacao = new Date(dataVaga + "T00:00:00");

  const diferencaMs = hoje - dataPublicacao;
  const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);

  return diferencaDias >= PRAZO_EXPIRACAO_DIAS;
}
const vagasAtivas = vagas.filter(vaga => !vagaExpirada(vaga.data));

// Eventos
searchInput.addEventListener("input", filtrar);
cityFilter.addEventListener("change", filtrar);

// Inicial
filtrar();

// MODAL – INFO
function abrirModalInfo(titulo, empresa, cidade, descricaoModal, banner) {
  document.getElementById("modalTitulo").innerText = titulo;
  document.getElementById("modalEmpresa").innerText = empresa;
  document.getElementById("modalCidade").innerText = cidade;
  document.getElementById("modalDescricao").innerText = descricaoModal;
  document.getElementById("modalBanner").src = banner;

  document.getElementById("vagaModal").style.display = "flex";
}

// MODAL – IMAGEM
function abrirModalImagem(banner) {
  document.getElementById("modalTitulo").innerText = "";
  document.getElementById("modalEmpresa").innerText = "";
  document.getElementById("modalCidade").innerText = "";
  document.getElementById("modalDescricao").innerText = "";
  document.getElementById("modalBanner").src = banner;

  document.getElementById("vagaModal").style.display = "flex";
}

// Fechar modal
function fecharModal() {
  document.getElementById("vagaModal").style.display = "none";
}

const btnTopo = document.getElementById("btnTopo");

if (btnTopo) {
  btnTopo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      btnTopo.style.display = "block";
    } else {
      btnTopo.style.display = "none";
    }
  });
}

// SALVA DATA DA ÚLTIMA VISITA
const agora = new Date().toISOString();
const ultimaVisita = localStorage.getItem("ultimaVisita");

localStorage.setItem("ultimaVisita", agora);