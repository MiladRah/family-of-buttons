/* A Family of Buttons: home page (CPSC 581, Group Project 1) */

const PEOPLE = [
  { id:"p1", name:"Annas", icon:"star", url:"annas/index.html",
    traits:["Football", "Gaming", "Driving", "Art", "Working", "Gym", "Lego & making things", "Walks", "Time with loved ones", "Sudoku", "Social media", "Movies", "Trying new food", "Disliking coding", "Drawing", "Tech", "Nature"] },
  { id:"p2", name:"Hafiz", icon:"moon", url:"hafiz/index.html",
    traits:["Football", "Travelling", "Driving", "Working", "Hiking", "Helping each other", "Leading a team", "Music", "Biking", "Public speaking", "Time with loved ones", "Social media", "Pranks", "Trying new food", "Disliking coding"] },
  { id:"p3", name:"MO", icon:"dots", url:"mo/index.html",
    traits:["Football", "Travelling", "Gaming", "Cooking", "Driving", "Working", "Hiking", "Helping each other", "Gym", "Walks", "Leading a team", "Music", "Biking", "Swimming", "Public speaking", "Time with loved ones", "Rock climbing", "Sudoku", "Social media", "Pranks", "Movies", "Trying new food", "Disliking coding", "Nature"] },
  { id:"p4", name:"Milad", icon:"waves", url:"milad/index.html",
    traits:["Football", "Travelling", "Gaming", "Cooking", "Driving", "Art", "Hiking", "Helping each other", "Gym", "Lego & making things", "Walks", "Music", "Swimming", "Time with loved ones", "Rock climbing", "Sudoku", "Chess", "Movies", "Trying new food", "Disliking coding", "Drawing", "Tech", "Nature"] },
];
const START = [null, null];   // who is in the box when the page opens

/* ---------- icons ---------- */
const ICONS = {
  star:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M24 9 L32.8 36.1 L9.7 19.4 H38.3 L15.2 36.1 Z"/></svg>`,
  moon:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M28 9.5 A15 15 0 1 0 38.5 31 A12 12 0 0 1 28 9.5 Z"/></svg>`,
  dots:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="17" cy="17" r="3.6"/><circle cx="31" cy="17" r="3.6"/><circle cx="17" cy="31" r="3.6"/><circle cx="31" cy="31" r="3.6"/></svg>`,
  waves:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M15 10 q4 3.5 0 7 t0 7 t0 7 t0 7"/><path d="M24 10 q4 3.5 0 7 t0 7 t0 7 t0 7"/><path d="M33 10 q4 3.5 0 7 t0 7 t0 7 t0 7"/></svg>`,
};
const ARROW_R = `<svg class="arrow" viewBox="0 0 72 18" aria-hidden="true"><path d="M2 9 H68 M60 3 L68 9 L60 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW_L = `<svg class="arrow" viewBox="0 0 72 18" aria-hidden="true"><path d="M70 9 H4 M12 3 L4 9 L12 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const byId = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
const state = { slots: START.map(id => (id && byId[id]) ? id : null) };
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function buttonHTML(p, extra = ""){
  const href = p.url ? esc(p.url) : "#";
  const tgt = ""; // same tab; use ` target="_blank"` here to open pages in a new tab
  return `<a class="pbtn" ${extra} data-id="${p.id}" href="${href}"${tgt} draggable="false"
    style="--c:var(--${p.id});--on:var(--${p.id}-on, #fff)"
    aria-label="${esc(p.name)}: open personal site. Press Space to add to the comparison box.">${ICONS[p.icon] || ""}</a>`;
}

/* ---------- build the bottom row once ---------- */
const row = $("#row");
row.innerHTML = PEOPLE.map(p => `<li class="person">${buttonHTML(p)}<span class="plabel">${esc(p.name)}</span></li>`).join("");
row.querySelectorAll(".pbtn").forEach(wireButton);

const ph = PEOPLE.filter(p => p.placeholder).map(p => p.name);
if (ph.length){
  const n = $("#placeholderNote");
  n.textContent = `${ph.join(" and ")}: traits are placeholders for now.`;
  n.hidden = false;
}

/* ---------- render ---------- */
const norm = t => t.trim().toLowerCase();

function render(){
  const [a, b] = state.slots.map(id => id ? byId[id] : null);
  const cmp = $("#compare");
  cmp.style.setProperty("--a", a ? `var(--${a.id})` : "var(--line)");
  cmp.style.setProperty("--b", b ? `var(--${b.id})` : "var(--line)");

  // placed state on the bottom row
  row.querySelectorAll(".pbtn").forEach(el => el.classList.toggle("is-placed", state.slots.includes(el.dataset.id)));

  // slots in the box
  document.querySelectorAll(".slot").forEach(slot => {
    const i = +slot.dataset.slot, p = state.slots[i] ? byId[state.slots[i]] : null;
    slot.innerHTML = p
      ? `<div class="slot-ring">${buttonHTML(p, `data-from="${i}"`)}</div>
         <span class="slot-name">${esc(p.name)}</span>
         <button class="remove" type="button" data-remove="${i}" aria-label="Remove ${esc(p.name)} from the box">×</button>`
      : `<div class="slot-ring" aria-hidden="true"></div><span class="slot-name empty">empty</span>`;
    const btn = slot.querySelector(".pbtn"); if (btn) wireButton(btn);
    const rm = slot.querySelector(".remove"); if (rm) rm.onclick = () => { state.slots[i] = null; render(); };
  });

  // traits
  let shared = [], onlyA = a ? a.traits.slice() : [], onlyB = b ? b.traits.slice() : [];
  if (a && b){
    const setB = new Set(b.traits.map(norm)), setA = new Set(a.traits.map(norm));
    shared = a.traits.filter(t => setB.has(norm(t)));
    onlyA = a.traits.filter(t => !setB.has(norm(t)));
    onlyB = b.traits.filter(t => !setA.has(norm(t)));
  }
  $("#sideA").innerHTML = sideHTML(a, onlyA, "a", !!b);
  $("#sideB").innerHTML = sideHTML(b, onlyB, "b", !!a);

  const sh = $("#shared");
  if (a && b){
    const total = shared.length + onlyA.length + onlyB.length || 1;
    sh.innerHTML = `
      <p class="shared-label">In common</p>
      ${shared.length
        ? `<ul class="shared-list">${shared.map((t,i) => `<li style="animation-delay:${i*70}ms">${esc(t)}</li>`).join("")}</ul>`
        : `<p class="shared-none">nothing in common… yet</p>`}
      <div class="overlap">
        <div class="bar" aria-hidden="true">
          <span class="ba" style="flex-basis:${onlyA.length/total*100}%"></span>
          <span class="bs" style="flex-basis:${shared.length/total*100}%"></span>
          <span class="bb" style="flex-basis:${onlyB.length/total*100}%"></span>
        </div>
        <p class="overlap-text"><strong>${shared.length}</strong> shared · <strong>${onlyA.length + onlyB.length}</strong> different</p>
      </div>`;
    $("#live").textContent = `${a.name} and ${b.name} share ${shared.length} trait${shared.length===1?"":"s"}${shared.length?": "+shared.join(", "):""}.`;
  } else {
    sh.innerHTML = `<p class="shared-label">In common</p><p class="shared-none">${a||b ? "add one more button" : "drop two buttons in the box"}</p>`;
  }
  $("#trayNote").textContent = (a && b) ? "swap anyone in" : "drag and drop";
  $("#clearBtn").hidden = !(a || b);
}

function sideHTML(p, list, side, paired){
  if (!p){
    return `<div class="side-head">${side==="b" ? ARROW_L : ""}<p class="side-name empty">?</p>${side==="a" ? ARROW_R : ""}</div>
            <p class="hint-empty">drop a button in the box</p>`;
  }
  const arrow = side === "a" ? ARROW_R : ARROW_L;
  return `<div class="side-head">
            ${side==="b" ? arrow : ""}<p class="side-name">${esc(p.name)}</p>${side==="a" ? arrow : ""}
          </div>
          <p class="side-sub">${paired ? "Just " + esc(p.name) : "All traits"}</p>
          <ul class="traits">${list.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
}

/* ---------- placing ---------- */
function place(id, slotIdx){
  const cur = state.slots.indexOf(id);
  if (slotIdx == null){
    if (cur !== -1) return;
    slotIdx = state.slots[0] == null ? 0 : state.slots[1] == null ? 1 : 1;
  }
  if (cur !== -1 && cur !== slotIdx) state.slots[cur] = state.slots[slotIdx]; // swap
  state.slots[slotIdx] = id;
  render();
}

/* ---------- drag vs. click ---------- */
let drag = null, suppressClick = false;
const tray = $("#tray");

function wireButton(el){
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", e => {
    if (e.key === " " || e.code === "Space"){
      e.preventDefault();
      const id = el.dataset.id;
      if (el.dataset.from != null){ state.slots[+el.dataset.from] = null; render(); announce(`${byId[id].name} removed from the box`); }
      else if (!state.slots.includes(id)){ place(id); announce(`${byId[id].name} added to the box`); }
    }
  });
}

function onClick(e){
  const el = e.currentTarget;
  if (suppressClick){ e.preventDefault(); suppressClick = false; return; }
  const p = byId[el.dataset.id];
  if (!p.url){
    e.preventDefault();
    toast(`${p.name}'s page isn't linked yet. Add it to "url" in script.js.`);
  }
}

function onDown(e){
  if (e.button !== 0) return;
  const el = e.currentTarget;
  drag = { el, id: el.dataset.id, from: el.dataset.from != null ? +el.dataset.from : null,
           x0: e.clientX, y0: e.clientY, started: false, pid: e.pointerId, ghost: null, target: null };
  el.setPointerCapture(e.pointerId);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onCancel);
}

function onMove(e){
  if (!drag || e.pointerId !== drag.pid) return;
  const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
  if (!drag.started){
    if (Math.hypot(dx, dy) < 6) return;
    drag.started = true;
    const r = drag.el.getBoundingClientRect();
    drag.offX = drag.x0 - r.left; drag.offY = drag.y0 - r.top;
    const g = document.createElement("div");
    g.className = "ghost";
    g.innerHTML = buttonHTML(byId[drag.id]);
    g.firstElementChild.style.setProperty("--size", r.width + "px");
    document.body.appendChild(g);
    drag.ghost = g;
    drag.el.classList.add("is-lifted");
  }
  drag.ghost.style.transform = `translate(${e.clientX - drag.offX}px, ${e.clientY - drag.offY}px)`;

  const hit = document.elementFromPoint(e.clientX, e.clientY);
  const slot = hit && hit.closest(".slot");
  const inTray = hit && hit.closest("#tray");
  document.querySelectorAll(".slot").forEach(s => s.classList.toggle("is-over", s === slot));
  tray.classList.toggle("is-over", !!inTray);
  drag.target = slot ? +slot.dataset.slot : inTray ? "tray" : null;
}

function endDrag(commit){
  const d = drag; drag = null;
  d.el.removeEventListener("pointermove", onMove);
  d.el.removeEventListener("pointerup", onUp);
  d.el.removeEventListener("pointercancel", onCancel);
  if (!d.started) return;
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
  d.ghost && d.ghost.remove();
  d.el.classList.remove("is-lifted");
  tray.classList.remove("is-over");
  document.querySelectorAll(".slot").forEach(s => s.classList.remove("is-over"));
  if (!commit) return;
  if (d.target === "tray") place(d.id, d.from != null ? d.from : null);
  else if (typeof d.target === "number") place(d.id, d.target);
  else if (d.from != null){ state.slots[d.from] = null; render(); }   // dragged out of the box
}
function onUp(e){ if (drag && e.pointerId === drag.pid) endDrag(true); }
function onCancel(e){ if (drag && e.pointerId === drag.pid) endDrag(false); }

$("#clearBtn").addEventListener("click", () => { state.slots = [null, null]; render(); });

/* ---------- feedback ---------- */
let toastTimer;
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3400);
}
function announce(msg){ $("#live").textContent = msg; }

render();
