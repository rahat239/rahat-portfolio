(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const css = document.createElement("style");
  css.textContent = `
    .fx-cursor{display:inline-block;margin-left:3px;color:var(--teal,#64ffda);font-weight:300;animation:fx-blink 1s step-end infinite}
    @keyframes fx-blink{50%{opacity:0}}
    .fx-fade{opacity:0;transform:translateY(40px);transition:opacity 1.2s ease-out,transform .6s ease-out}
    .fx-fade.fx-in{opacity:1;transform:none}`;
  document.head.appendChild(css);

  // 1) Typing: "hi, rahat here."
  const h = document.querySelector(".hero-big");
  if (h) {
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const texts = nodes.map((n) => n.textContent);
    h.setAttribute("aria-label", texts.join("").replace(/\s+/g, " ").trim());
    nodes.forEach((n) => (n.textContent = ""));
    const cursor = document.createElement("span");
    cursor.className = "fx-cursor";
    cursor.textContent = "|";
    cursor.setAttribute("aria-hidden", "true");
    h.appendChild(cursor);
    let ni = 0, ci = 0;
    const tick = () => {
      while (ni < nodes.length && ci >= texts[ni].length) { ni++; ci = 0; }
      if (ni >= nodes.length) return;
      const ch = texts[ni][ci];
      nodes[ni].textContent = texts[ni].slice(0, ++ci);
      setTimeout(tick, /\s/.test(ch) ? 0 : 70 + Math.random() * 100);
    };
    setTimeout(tick, 400);
  }

  // 2) Fade-in: hero text + every section on scroll
  if (!("IntersectionObserver" in window)) return;
  const hero = [...document.querySelectorAll(".hero-p, #hero .btn-hi")];
  const targets = [...hero, ...document.querySelectorAll("section:not(#hero)")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("fx-in");
      io.unobserve(e.target);
      setTimeout(() => e.target.classList.remove("fx-fade", "fx-in"), 1500 + (parseFloat(e.target.style.transitionDelay) || 0) * 1000);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  hero.forEach((el, i) => (el.style.transitionDelay = 0.6 + i * 0.15 + "s"));
  targets.forEach((el) => { el.classList.add("fx-fade"); io.observe(el); });
})();
