
const EMAIL = "jaymarkloyola@gmail.com";

const skills = ["UI/UX design", "Figma", "HTML & CSS", "JavaScript", "React", "Webflow", "Brand identity", "Design systems", "Prototyping", "User research"];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}

const shapes = $("#shapes");
if (shapes) {
  [
    [62, -6, 110, 35, 6], [70, 8, 90, 50, 7], [52, 14, 120, 25, 5.5],
    [40, 34, 150, -20, 6.5], [58, 40, 70, 60, 8], [28, 52, 140, -30, 7],
    [16, 66, 110, 40, 6], [4, 78, 130, -15, 7.5], [44, 60, 60, 70, 5]
  ].forEach(([x, y, w, r, d]) => {
    const el = document.createElement("span");
    el.className = "disc";
    el.style.cssText = `left:${x}%;top:${y}%;--w:${w}px;--r:${r}deg;--d:${d}s;--delay:${-d * Math.random()}s`;
    shapes.appendChild(el);
  });
}

function setAccent(name) {
  document.body.dataset.accent = name;
  $$("#swatches button").forEach(b => b.classList.toggle("on", b.dataset.accent === name));
  try { localStorage.setItem("accent", name); } catch {}
}
let savedAccent = "lime";
try { savedAccent = localStorage.getItem("accent") || "lime"; } catch {}
setAccent(savedAccent);

const accentBtn = $("#accentBtn"), accentPop = $("#accentPop");
accentBtn.addEventListener("click", e => {
  e.stopPropagation();
  accentPop.hidden = !accentPop.hidden;
  accentBtn.setAttribute("aria-expanded", !accentPop.hidden);
});
accentPop.addEventListener("click", e => {
  e.stopPropagation();
  const b = e.target.closest("button[data-accent]");
  if (b) setAccent(b.dataset.accent);
});
function closePopover() {
  accentPop.hidden = true;
  accentBtn.setAttribute("aria-expanded", "false");
}
document.addEventListener("click", closePopover);
document.addEventListener("keydown", e => { if (e.key === "Escape") closePopover(); });

$("#menuToggle").addEventListener("click", () => {
  const open = $(".nav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", open);
});

const photo = $("#photo");
if (photo) {
  const img = $("img", photo);
  const empty = () => photo.classList.add("is-empty");
  img.addEventListener("error", empty);
  if (img.complete && img.naturalWidth === 0) empty();
}

const skillList = $("#skills");
if (skillList) skillList.innerHTML = skills.map(s => `<li>${s}</li>`).join("");

const copyEmail = $("#copyEmail");
if (copyEmail) {
  copyEmail.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(EMAIL); toast("Email address copied"); }
    catch { toast(EMAIL); }
  });
}

const form = $("#contactForm");
if (form) {
  let budget = "$2k–$8k";
  $("#budgetChips").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#budgetChips button").forEach(x => x.classList.toggle("on", x === b));
    budget = b.dataset.v;
  });

  form.addEventListener("input", e => e.target.closest("label")?.classList.remove("invalid"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    ["name", "email", "message"].forEach(n => {
      const field = form.elements[n];
      const valid = field.value.trim() && (n !== "email" || /^\S+@\S+\.\S+$/.test(field.value));
      field.closest("label").classList.toggle("invalid", !valid);
      if (!valid && ok) { field.focus(); ok = false; }
    });
    if (!ok) return;

    const name = form.elements.name.value.trim();
    const subject = `New project from ${name}`;
    const body =
      `Name: ${name}\nEmail: ${form.elements.email.value.trim()}\nBudget: ${budget}\n\n${form.elements.message.value.trim()}`;
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("Opening your email app…");
  });
}
