const elements = {
  word: document.getElementById("word"),
  pos: document.getElementById("pos"),
  meaning: document.getElementById("meaning"),
  note: document.getElementById("note"),
  level: document.getElementById("level"),
  academic: document.getElementById("academic"),
  menuToggle: document.getElementById("menuToggle"),
  headerActions: document.getElementById("headerActions"),
  themeToggle: document.getElementById("themeToggle"),
  drawerToggle: document.getElementById("drawerToggle"),
  drawer: document.getElementById("drawer"),
  drawerClose: document.getElementById("drawerClose"),
  drawerOverlay: document.getElementById("drawerOverlay"),
  drawerTableBody: document.getElementById("drawerTableBody"),
  drawerCount: document.getElementById("drawerCount"),
  prev: document.getElementById("prev"),
  next: document.getElementById("next"),
  shuffle: document.getElementById("shuffle"),
  familiar: document.getElementById("familiar"),
  unfamiliar: document.getElementById("unfamiliar"),
  filterLevel: document.getElementById("filterLevel"),
  filterAcademic: document.getElementById("filterAcademic"),
  filterUnfamiliar: document.getElementById("filterUnfamiliar"),
  autoSkipFamiliar: document.getElementById("autoSkipFamiliar"),
  clearProgress: document.getElementById("clearProgress"),
  totalAllCount: document.getElementById("totalAllCount"),
  totalCount: document.getElementById("totalCount"),
  seenCount: document.getElementById("seenCount"),
  familiarCount: document.getElementById("familiarCount"),
  unfamiliarCount: document.getElementById("unfamiliarCount"),
  status: document.getElementById("status"),
  card: document.getElementById("card"),
  cardBadge: document.getElementById("cardBadge"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  exportBtn: document.getElementById("exportBtn"),
  importFile: document.getElementById("importFile"),
};

const state = {
  items: [],
  allItems: [],
  index: 0,
  seen: new Set(),
  familiar: new Set(),
  unfamiliar: new Set(),
  randomPool: [],
  filterOnlyUnfamiliar: false,
  autoSkipFamiliar: false,
  theme: "light",
};

const headerRow = "字彙,詞類,中文,註解,級數,學術字彙";

function parseCsv(text) {
  const lines = text.split(/\r?\n/);
  const results = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line === headerRow) continue;

    const columns = line.split(",");
    if (columns.length < 3) continue;

    const word = (columns[0] || "").trim();
    const pos = (columns[1] || "").trim();
    const meaning = (columns[2] || "").trim();
    const note = (columns[3] || "").trim();
    const level = (columns[4] || "").trim();
    const academic = (columns[5] || "").trim();

    if (!word) continue;

    results.push({ word, pos, meaning, note, level, academic });
  }

  return results;
}

function updateStats() {
  elements.totalAllCount.textContent = state.allItems.length.toString();
  elements.totalCount.textContent = state.items.length.toString();
  elements.seenCount.textContent = state.seen.size.toString();
  elements.familiarCount.textContent = state.familiar.size.toString();
  elements.unfamiliarCount.textContent = state.unfamiliar.size.toString();

  const total = state.items.length;
  const marked = state.familiar.size + state.unfamiliar.size;
  const percent = total > 0 ? (marked / total) * 100 : 0;
  elements.progressBar.style.width = `${percent}%`;
  elements.progressText.textContent = `${marked} / ${total}`;
}

function setStatus(text) {
  elements.status.textContent = text;
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  elements.themeToggle.textContent =
    state.theme === "dark" ? "淺色模式" : "深色模式";
}

function openDrawer() {
  elements.drawer.classList.add("active");
  elements.drawerOverlay.classList.add("active");
  elements.drawer.setAttribute("aria-hidden", "false");
  elements.drawerOverlay.setAttribute("aria-hidden", "false");
  renderDrawerList();
}

function closeDrawer() {
  elements.drawer.classList.remove("active");
  elements.drawerOverlay.classList.remove("active");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.drawerOverlay.setAttribute("aria-hidden", "true");
}

function renderDrawerList() {
  const rows = state.items;
  elements.drawerCount.textContent = rows.length.toString();
  elements.drawerTableBody.innerHTML = "";
  const fragment = document.createDocumentFragment();

  rows.forEach((item) => {
    const tr = document.createElement("tr");
    const statusTd = document.createElement("td");
    statusTd.className = "status-cell";
    const badge = document.createElement("span");
    badge.className = "status-badge";
    if (state.familiar.has(item.id)) {
      badge.classList.add("familiar");
      badge.textContent = "熟悉";
    } else if (state.unfamiliar.has(item.id)) {
      badge.classList.add("unfamiliar");
      badge.textContent = "不熟";
    } else {
      badge.textContent = "未標記";
    }
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    const cells = [
      item.word,
      item.pos,
      item.meaning,
      item.note,
      item.level,
      item.academic,
    ];
    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value || "";
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });

  elements.drawerTableBody.appendChild(fragment);
}

function loadTheme() {
  const stored = localStorage.getItem("geptTheme");
  if (stored === "light" || stored === "dark") {
    state.theme = stored;
    return;
  }
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  state.theme = prefersDark ? "dark" : "light";
}

function saveTheme() {
  localStorage.setItem("geptTheme", state.theme);
}

function applyCardFade() {
  elements.card.classList.add("fade");
  window.setTimeout(() => elements.card.classList.remove("fade"), 220);
}

function renderCard() {
  if (!state.items.length) return;
  const item = state.items[state.index];

  elements.word.textContent = item.word;
  elements.pos.textContent = item.pos || "詞類";
  elements.meaning.textContent = item.meaning || "";
  elements.note.textContent = item.note ? `註解：${item.note}` : "";
  elements.level.textContent = item.level || "級數";
  elements.academic.textContent = item.academic ? `學術字彙：${item.academic}` : "";

  elements.card.classList.remove("familiar", "unfamiliar");
  elements.cardBadge.classList.remove("visible", "familiar", "unfamiliar");
  if (state.familiar.has(item.id)) {
    elements.card.classList.add("familiar");
    elements.cardBadge.textContent = "熟悉";
    elements.cardBadge.classList.add("visible", "familiar");
  } else if (state.unfamiliar.has(item.id)) {
    elements.card.classList.add("unfamiliar");
    elements.cardBadge.textContent = "不熟";
    elements.cardBadge.classList.add("visible", "unfamiliar");
  }

  state.seen.add(item.id);
  updateStats();
  applyCardFade();
}

function nextCard() {
  if (!state.items.length) return;
  moveIndex(1);
}

function prevCard() {
  if (!state.items.length) return;
  moveIndex(-1);
}

function shuffleCard() {
  if (!state.items.length) return;
  if (!state.randomPool.length) {
    state.randomPool = state.items.map((_, index) => index);
  }
  const nextIndex = Math.floor(Math.random() * state.randomPool.length);
  state.index = state.randomPool.splice(nextIndex, 1)[0];
  ensureAutoSkipThenRender();
}

function moveIndex(step) {
  state.index = (state.index + step + state.items.length) % state.items.length;
  ensureAutoSkipThenRender();
}

function ensureAutoSkipThenRender() {
  if (!state.items.length) return;
  if (!state.autoSkipFamiliar) {
    renderCard();
    return;
  }
  const visited = new Set();
  while (visited.size < state.items.length) {
    const current = state.items[state.index];
    if (!state.familiar.has(current.id)) {
      renderCard();
      return;
    }
    visited.add(state.index);
    state.index = (state.index + 1) % state.items.length;
  }
  renderCard();
}

function markFamiliar() {
  if (!state.items.length) return;
  const item = state.items[state.index];
  state.familiar.add(item.id);
  state.unfamiliar.delete(item.id);
  saveProgress();
  updateStats();
  nextCard();
}

function markUnfamiliar() {
  if (!state.items.length) return;
  const item = state.items[state.index];
  state.unfamiliar.add(item.id);
  state.familiar.delete(item.id);
  saveProgress();
  updateStats();
  nextCard();
}

function buildSelectOptions(select, items, placeholder) {
  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  select.appendChild(defaultOption);

  items.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function applyFilters() {
  const levelValue = elements.filterLevel.value;
  const academicValue = elements.filterAcademic.value;
  const onlyUnfamiliar = state.filterOnlyUnfamiliar;

  state.items = state.allItems.filter((item) => {
    const levelMatch = levelValue ? item.level === levelValue : true;
    const academicMatch = academicValue ? item.academic === academicValue : true;
    const unfamiliarMatch = onlyUnfamiliar ? state.unfamiliar.has(item.id) : true;
    return levelMatch && academicMatch && unfamiliarMatch;
  });

  state.index = 0;
  state.randomPool = [];
  state.seen = new Set();
  if (state.items.length) {
    ensureAutoSkipThenRender();
  } else {
    elements.word.textContent = "沒有符合的單字";
    elements.pos.textContent = "";
    elements.meaning.textContent = "";
    elements.note.textContent = "";
    elements.level.textContent = "";
    elements.academic.textContent = "";
  }
  renderDrawerList();
  updateStats();
}

function loadProgress() {
  const raw = localStorage.getItem("geptProgress");
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.familiar = new Set(data.familiar || []);
    state.unfamiliar = new Set(data.unfamiliar || []);
    state.filterOnlyUnfamiliar = Boolean(data.filterOnlyUnfamiliar);
    state.autoSkipFamiliar = Boolean(data.autoSkipFamiliar);
  } catch (error) {
    state.familiar = new Set();
    state.unfamiliar = new Set();
    state.filterOnlyUnfamiliar = false;
    state.autoSkipFamiliar = false;
  }
}

function saveProgress() {
  const payload = {
    familiar: Array.from(state.familiar),
    unfamiliar: Array.from(state.unfamiliar),
    filterOnlyUnfamiliar: state.filterOnlyUnfamiliar,
    autoSkipFamiliar: state.autoSkipFamiliar,
  };
  localStorage.setItem("geptProgress", JSON.stringify(payload));
}

function clearProgress() {
  state.familiar = new Set();
  state.unfamiliar = new Set();
  state.filterOnlyUnfamiliar = false;
  state.autoSkipFamiliar = false;
  elements.filterUnfamiliar.checked = false;
  elements.autoSkipFamiliar.checked = false;
  saveProgress();
  applyFilters();
}

function exportProgress() {
  const data = {
    familiar: Array.from(state.familiar),
    unfamiliar: Array.from(state.unfamiliar),
    filterOnlyUnfamiliar: state.filterOnlyUnfamiliar,
    autoSkipFamiliar: state.autoSkipFamiliar,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gept-progress-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importProgress(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    state.familiar = new Set(data.familiar || []);
    state.unfamiliar = new Set(data.unfamiliar || []);
    state.filterOnlyUnfamiliar = data.filterOnlyUnfamiliar || false;
    state.autoSkipFamiliar = data.autoSkipFamiliar || false;
    elements.filterUnfamiliar.checked = state.filterOnlyUnfamiliar;
    elements.autoSkipFamiliar.checked = state.autoSkipFamiliar;
    saveProgress();
    applyFilters();
    setStatus("匯入成功");
  } catch (err) {
    setStatus("匯入失敗");
    console.error(err);
  }
  event.target.value = "";
}

function applySavedStatusToStats() {
  if (!state.items.length) return;
  updateStats();
}

function attachEvents() {
  elements.menuToggle.addEventListener("click", () => {
    elements.menuToggle.classList.toggle("active");
    elements.headerActions.classList.toggle("active");
  });

  elements.themeToggle.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveTheme();
    applyTheme();
  });
  elements.drawerToggle.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    openDrawer();
  });
  elements.shuffle.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    shuffleCard();
  });
  elements.drawerClose.addEventListener("click", closeDrawer);
  elements.drawerOverlay.addEventListener("click", closeDrawer);

  elements.next.addEventListener("click", nextCard);
  elements.prev.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    prevCard();
  });
  elements.shuffle.addEventListener("click", shuffleCard);
  elements.familiar.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    markFamiliar();
  });
  elements.unfamiliar.addEventListener("click", () => {
    elements.menuToggle.classList.remove("active");
    elements.headerActions.classList.remove("active");
    markUnfamiliar();
  });
  elements.filterLevel.addEventListener("change", applyFilters);
  elements.filterAcademic.addEventListener("change", applyFilters);
  elements.filterUnfamiliar.addEventListener("change", () => {
    state.filterOnlyUnfamiliar = elements.filterUnfamiliar.checked;
    saveProgress();
    applyFilters();
  });
  elements.autoSkipFamiliar.addEventListener("change", () => {
    state.autoSkipFamiliar = elements.autoSkipFamiliar.checked;
    saveProgress();
    ensureAutoSkipThenRender();
  });
  elements.clearProgress.addEventListener("click", clearProgress);
  elements.exportBtn.addEventListener("click", exportProgress);
  elements.importFile.addEventListener("change", importProgress);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 600 && 
        elements.headerActions.classList.contains("active") &&
        !elements.headerActions.contains(event.target) &&
        !elements.menuToggle.contains(event.target)) {
      elements.menuToggle.classList.remove("active");
      elements.headerActions.classList.remove("active");
    }
  });
}

async function init() {
  setStatus("載入中...");
  try {
    loadTheme();
    applyTheme();
    const response = await fetch("./GEPT_Intermediate.csv");
    if (!response.ok) {
      throw new Error(`讀取失敗 (${response.status})`);
    }
    const text = await response.text();
    const parsed = parseCsv(text);
    state.allItems = parsed.map((item, index) => ({ ...item, id: index }));
    state.items = [...state.allItems];
    state.index = 0;
    loadProgress();

    const levels = Array.from(
      new Set(state.allItems.map((item) => item.level).filter(Boolean))
    ).sort();
    const academics = Array.from(
      new Set(state.allItems.map((item) => item.academic).filter(Boolean))
    ).sort();
    buildSelectOptions(elements.filterLevel, levels, "全部級數");
    buildSelectOptions(elements.filterAcademic, academics, "全部");

    elements.filterUnfamiliar.checked = state.filterOnlyUnfamiliar;
    elements.autoSkipFamiliar.checked = state.autoSkipFamiliar;
    applyFilters();
    setStatus("已載入");
  } catch (error) {
    elements.word.textContent = "無法載入 CSV";
    elements.note.textContent = "請確認使用本機 server 開啟，並且 CSV 檔案在同層目錄。";
    elements.meaning.textContent = "";
    elements.pos.textContent = "";
    elements.level.textContent = "";
    elements.academic.textContent = "";
    setStatus("載入失敗");
  }
}

attachEvents();
loadTheme();
applyTheme();
init();
