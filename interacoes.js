/* Capital Contabilidade · interações dos cartões (versão 3) */
(() => {
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Cartões: inclinam com o mouse e a luz segue o cursor */
  document.querySelectorAll(".cartao-fx").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", `${x * 100}%`);
      c.style.setProperty("--my", `${y * 100}%`);
      if (temMouse && !reduzir) {
        c.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
        c.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
      }
    });
    c.addEventListener("pointerleave", () => {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    });
  });

  /* Cascata: itens de uma mesma grade aparecem um depois do outro */
  document.querySelectorAll(".mosaico, .grade-servicos, .grade-areas, .grade-mvv, .linha-tempo, .contadores").forEach((g) => {
    [...g.children].forEach((el, i) => el.style.setProperty("--atraso", `${Math.min(i, 8) * 0.07}s`));
  });

  /* Os cartões que viram também precisam do "visto" para desenhar o ícone */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".vira").forEach((el) => io.observe(el));

  /* Contadores animados */
  const contar = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    contar.unobserve(e.target);
    const fim = Number(e.target.dataset.contar);
    if (reduzir) return;
    const t0 = performance.now(), dur = 1400;
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      e.target.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    };
    e.target.textContent = "0";
    requestAnimationFrame(passo);
  }), { threshold: 0.6 });
  document.querySelectorAll("[data-contar]").forEach((el) => contar.observe(el));

  /* Filtros de profissão */
  const filtros = document.querySelectorAll(".filtro");
  filtros.forEach((b) => b.addEventListener("click", () => {
    filtros.forEach((x) => { x.classList.toggle("ativo", x === b); x.setAttribute("aria-selected", x === b); });
    const f = b.dataset.filtro;
    document.querySelectorAll(".peca").forEach((p) => {
      const grupos = (p.dataset.grupo || "").split(" ");
      p.classList.toggle("apagada", f !== "todos" && !grupos.includes(f));
    });
  }));

  /* Cartões que viram (clique/toque) */
  document.querySelectorAll(".vira").forEach((v) => v.addEventListener("click", () => {
    v.setAttribute("aria-pressed", v.getAttribute("aria-pressed") !== "true");
  }));

  /* Abas dos regimes */
  const abas = [...document.querySelectorAll(".seletor-aba")];
  const paineis = [...document.querySelectorAll(".seletor-painel")];
  abas.forEach((a, i) => a.addEventListener("click", () => {
    abas.forEach((x, j) => { x.classList.toggle("ativo", j === i); x.setAttribute("aria-selected", j === i); });
    paineis.forEach((p, j) => p.classList.toggle("ativo", j === i));
  }));
})();
