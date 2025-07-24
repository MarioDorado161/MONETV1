const searchInput = document.getElementById("searchInput");
const docList = document.getElementById("docList");
const sidebar = document.getElementById("sidebar");
const navItems = document.querySelectorAll(".nav-item");



// Estado actual
let currentSection = "general";
let docData = allDocData[currentSection];

// Sidebar dinámico
function createSidebar(data) {
  sidebar.innerHTML = '';
  data.forEach(section => {
    const category = document.createElement("div");
    category.className = "category";
    category.textContent = section.title;

    const ul = document.createElement("ul");
    section.items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = item.name;
      a.onclick = () => renderContent(section.title, item.name);
      li.appendChild(a);
      ul.appendChild(li);
    });

    category.onclick = () => ul.classList.toggle("visible");

    sidebar.appendChild(category);
    sidebar.appendChild(ul);
  });
}

// Mostrar contenido dinámico
function renderContent(category, title) {
  docList.innerHTML = '';
  const article = document.createElement("div");
  article.className = "article";
  article.innerHTML = `<h2>${title}</h2><p>Contenido de "${title}" en la categoría "${category}".</p>`;
  docList.appendChild(article);
}

// Filtrar en TODAS las secciones
function filterDocs(query) {
  const lowerQuery = query.toLowerCase();

  // Si no hay query, vuelve a la sección actual
  if (query === '') {
    docData = allDocData[currentSection];
    createSidebar(docData);
    docList.innerHTML = '<p>Selecciona un tema desde la barra lateral o filtra por buscador</p>';
    return;
  }

  // Recorre TODO el contenido
  const filtered = Object.values(allDocData)
    .flat()
    .map(section => ({
      title: section.title,
      items: section.items.filter(item =>
        item.name.toLowerCase().includes(lowerQuery)
      ),
    }))
    .filter(section => section.items.length > 0);

  // Mostrar sidebar solo con resultados
  createSidebar(filtered);

  // Mostrar resultados
  docList.innerHTML = '';

  filtered.forEach(section => {
    section.items.forEach(item => {
      const article = document.createElement("div");
      article.className = "article";
      article.style.cursor = "pointer";
      article.innerHTML = `<h2>${item.name}</h2><p>Contenido de "${item.name}" en la categoría "${section.title}".</p>`;
      article.onclick = () => {
        // Cambiar de sección activa
        switchTab(item.section);
        // Mostrar tema en sidebar
        renderContent(section.title, item.name);
      };
      docList.appendChild(article);
    });
  });
}

// Cambiar de sección
function switchTab(tabName) {
  currentSection = tabName;
  docData = allDocData[currentSection];
  createSidebar(docData);

  navItems.forEach(item => item.classList.remove("active"));
  document.querySelector(`.nav-item[onclick="switchTab('${tabName}')"]`).classList.add("active");
}

// Eventos
searchInput.addEventListener("input", e => {
  filterDocs(e.target.value);
});

// Inicializar
createSidebar(docData);
docList.innerHTML = '<p>Selecciona un tema desde la barra lateral o filtra desde el buscador.</p>';
