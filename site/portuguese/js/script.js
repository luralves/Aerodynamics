document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     ELEMENTOS
  ============================== */

  const drawer = document.getElementById("drawer");
  const openBtn = document.getElementById("openDrawerBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");
  const overlay = document.getElementById("overlay");
  const drawerMenu = document.querySelector(".drawer-menu");
  const content = document.querySelector(".page");

  if (!drawer || !openBtn || !closeBtn || !overlay || !drawerMenu || !content) {
    console.error("Erro: elementos essenciais não encontrados.");
    return;
  }

  /* ==============================
     CONTROLE DO DRAWER
  ============================== */

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("show");
    openBtn.classList.add("hidden");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    openBtn.classList.remove("hidden");
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openDrawer();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
  });

  overlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  /* ==============================
     CARREGAMENTO DE CAPÍTULOS
  ============================== */

  async function loadChaptersList() {
    try {
      const response = await fetch("chapters.json");
      const chapters = await response.json();

      drawerMenu.innerHTML = "";

      for (const file of chapters) {
        const title = await getChapterTitle(file);
        addChapterToMenu(file, title);
      }

      // Abrir automaticamente o primeiro capítulo
      if (chapters.length > 0) {
        loadChapter("chapters/" + chapters[0]);
      }

    } catch (error) {
      console.error("Erro ao carregar chapters.json:", error);
    }
  }

  async function getChapterTitle(file) {
    try {
      const response = await fetch("chapters/" + file);
      const text = await response.text();

      const temp = document.createElement("div");
      temp.innerHTML = text;

      const h1 = temp.querySelector("h1");
      return h1 ? h1.innerText : file;

    } catch (error) {
      console.error("Erro ao ler título do capítulo:", error);
      return file;
    }
  }

  function addChapterToMenu(file, title) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = "#";
    a.textContent = title;

    a.addEventListener("click", async (e) => {
      e.preventDefault();
      await loadChapter("chapters/" + file);
      setActiveLink(a);
      closeDrawer();
    });

    li.appendChild(a);
    drawerMenu.appendChild(li);
  }

  function setActiveLink(activeLink) {
    const links = drawerMenu.querySelectorAll("a");
    links.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
  }

  async function loadChapter(path) {
    try {
      const response = await fetch(path);
      const html = await response.text();

      // 1️⃣ Limpar completamente estado MathJax
      if (window.MathJax?.startup?.document) {
        MathJax.startup.document.clear();   // limpa matemática processada
        MathJax.texReset();                 // reseta labels e contadores
      }

      // 2️⃣ Inserir novo conteúdo
      content.innerHTML = html;

      // 3️⃣ Renderizar novamente apenas o container
      if (window.MathJax?.typesetPromise) {
        await MathJax.typesetPromise([content]);
      }

    } catch (error) {
      console.error("Erro ao carregar capítulo:", error);
    }
  }

  /* ==============================
     INICIALIZAÇÃO
  ============================== */

  loadChaptersList();

  console.log("Sistema inicializado com sucesso.");

});