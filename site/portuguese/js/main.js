async function loadChapter(path) {
  const content = document.getElementById("content");
  const html = await fetch(path).then(r => r.text());

  // 1) Remova o conteúdo anterior primeiro
  content.innerHTML = "";

  // 2) Reset MathJax (labels/numeração + estado do documento)
  if (window.MathJax?.startup?.document) {
    MathJax.startup.document.state(0); // volta ao "antes de typesetar"
    MathJax.texReset();                // limpa labels e contadores TeX
    MathJax.typesetClear();            // esquece matemática anterior
  }

  // 3) Insira o novo conteúdo
  content.innerHTML = html;

  // 4) Typesetar só o container (não a página inteira)
  if (window.MathJax?.typesetPromise) {
    await MathJax.typesetPromise([content]);
  }
}

document.getElementById("toggle-btn").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden");
});