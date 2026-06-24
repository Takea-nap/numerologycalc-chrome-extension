const $ = (sel) => document.querySelector(sel);

const monthSelect = $("#month-select");
const daySelect = $("#day-select");
const yearSelect = $("#year-select");
const calcLifePathBtn = $("#calc-lifepath-btn");
const nameInput = $("#name-input");
const yVowelToggle = $("#y-vowel-toggle");
const calcNameBtn = $("#calc-name-btn");
const resultsSection = $("#results");
const resultsList = $("#results-list");
const recentSection = $("#recent");
const recentList = $("#recent-list");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

const RECENT_KEY = "recentCalcs";
const MAX_RECENT = 4;
const BASE_URL = "https://numerologycalc.org";
const UTM_RESULT = "utm_source=chrome-extension&utm_medium=extension&utm_campaign=result";

let currentTab = "lifepath";

async function init() {
  populateDaySelect();
  populateYearSelect();
  await renderRecent();
  bindEvents();
}

function populateDaySelect() {
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = String(d);
    opt.textContent = String(d);
    daySelect.appendChild(opt);
  }
}

function populateYearSelect() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1920; y--) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }
}

function bindEvents() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  [monthSelect, daySelect, yearSelect].forEach((el) => {
    el.addEventListener("change", updateLifePathBtnState);
  });

  nameInput.addEventListener("input", updateNameBtnState);
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !calcNameBtn.disabled) onCalcName();
  });

  calcLifePathBtn.addEventListener("click", onCalcLifePath);
  calcNameBtn.addEventListener("click", onCalcName);
}

function switchTab(name) {
  currentTab = name;
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === name;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  panels.forEach((panel) => {
    const isActive = panel.id === `panel-${name}`;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  });
  resultsSection.hidden = true;
}

function updateLifePathBtnState() {
  calcLifePathBtn.disabled = !(monthSelect.value && daySelect.value && yearSelect.value);
}

function updateNameBtnState() {
  calcNameBtn.disabled = nameInput.value.trim().length < 2;
}

async function onCalcLifePath() {
  const month = parseInt(monthSelect.value, 10);
  const day = parseInt(daySelect.value, 10);
  const year = parseInt(yearSelect.value, 10);

  if (!month || !day || !year) return;

  const lifePath = calcLifePathNumber(month, day, year);
  const birthday = calcBirthdayNumber(day);

  const items = [
    {
      type: "lifePath",
      label: "Life Path Number",
      value: lifePath,
      displayLabel: formatDate(month, day, year),
      displayValue: `Life Path ${lifePath}`,
    },
    {
      type: "birthday",
      label: "Birthday Number",
      value: birthday,
      displayLabel: formatDate(month, day, year),
      displayValue: `Birthday ${birthday}`,
    },
  ];

  renderResults(items);
  await saveRecent({
    type: "lifepath",
    displayLabel: formatDate(month, day, year),
    displayValue: `LP ${lifePath} / BD ${birthday}`,
    params: { month, day, year },
  });
}

async function onCalcName() {
  const rawName = nameInput.value.trim();
  if (rawName.length < 2) return;
  const yAsVowel = yVowelToggle.checked;

  const result = calculateNumerology(rawName, 1, 1, 2000, yAsVowel);

  const items = [];
  if (result.expression !== null) {
    items.push({
      type: "expression",
      label: "Expression Number",
      value: result.expression,
      displayLabel: rawName,
      displayValue: `Expression ${result.expression}`,
    });
  }
  if (result.soulUrge !== null) {
    items.push({
      type: "soulUrge",
      label: "Soul Urge Number",
      value: result.soulUrge,
      displayLabel: rawName,
      displayValue: `Soul Urge ${result.soulUrge}`,
    });
  }
  if (result.personality !== null) {
    items.push({
      type: "personality",
      label: "Personality Number",
      value: result.personality,
      displayLabel: rawName,
      displayValue: `Personality ${result.personality}`,
    });
  }

  if (!items.length) {
    resultsList.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "result-desc";
    empty.textContent = "This name has no letters to calculate.";
    resultsList.appendChild(empty);
    resultsSection.hidden = false;
    return;
  }

  renderResults(items);
  await saveRecent({
    type: "name",
    displayLabel: rawName,
    displayValue: items.map((i) => `${shortType(i.type)} ${i.value}`).join(" / "),
    params: { name: rawName, yAsVowel },
  });
}

function shortType(type) {
  if (type === "expression") return "Exp";
  if (type === "soulUrge") return "SU";
  if (type === "personality") return "Pers";
  return type;
}

function formatDate(month, day, year) {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${m}/${d}/${year}`;
}

function numberUrl(type, num) {
  const isMaster = MASTER_NUMBERS.has(num);
  let base;
  if (isMaster) {
    base = `/master-number-${num}`;
  } else if (type === "lifePath" || type === "birthday") {
    base = `/life-path-number-${num}`;
  } else if (type === "expression") {
    base = `/expression-number-${num}`;
  } else if (type === "soulUrge") {
    base = `/soul-urge-number-${num}`;
  } else if (type === "personality") {
    base = `/personality-number-${num}`;
  } else {
    base = `/life-path-number-${num}`;
  }
  return `${BASE_URL}${base}?${UTM_RESULT}`;
}

function renderResults(items) {
  resultsList.innerHTML = "";
  items.forEach((item) => {
    const meaning = getMeaning(item.value);
    const card = document.createElement("div");
    card.className = "result-card";

    const row = document.createElement("div");
    row.className = "result-row";
    const label = document.createElement("span");
    label.className = "result-label";
    label.textContent = item.label;
    const num = document.createElement("span");
    num.className = "result-number";
    if (meaning && meaning.isMaster) num.classList.add("master");
    num.textContent = String(item.value);
    row.appendChild(label);
    row.appendChild(num);
    card.appendChild(row);

    if (meaning) {
      const title = document.createElement("div");
      title.className = "result-title";
      title.textContent = meaning.title;
      card.appendChild(title);

      const desc = document.createElement("p");
      desc.className = "result-desc";
      desc.textContent = meaning.shortDescription;
      card.appendChild(desc);
    }

    const link = document.createElement("a");
    link.className = "result-link";
    link.href = numberUrl(item.type, item.value);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Read more on numerologycalc.org →";
    card.appendChild(link);

    resultsList.appendChild(card);
  });
  resultsSection.hidden = false;
}

async function saveRecent(entry) {
  const { recentCalcs = [] } = await chrome.storage.local.get(RECENT_KEY);
  const dedupKey = JSON.stringify(entry.params);
  const filtered = recentCalcs.filter((e) => JSON.stringify(e.params) !== dedupKey);
  const updated = [{ ...entry, ts: Date.now() }, ...filtered].slice(0, MAX_RECENT);
  await chrome.storage.local.set({ [RECENT_KEY]: updated });
  await renderRecent();
}

async function renderRecent() {
  const { recentCalcs = [] } = await chrome.storage.local.get(RECENT_KEY);
  recentList.innerHTML = "";
  if (!recentCalcs.length) {
    recentSection.hidden = true;
    return;
  }
  recentSection.hidden = false;
  recentCalcs.forEach((entry) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "recent-btn";
    const label = document.createElement("span");
    label.className = "recent-label";
    label.textContent = entry.displayLabel;
    label.title = entry.displayLabel;
    const value = document.createElement("span");
    value.className = "recent-value";
    value.textContent = entry.displayValue;
    btn.appendChild(label);
    btn.appendChild(value);
    btn.addEventListener("click", () => restoreRecent(entry));
    li.appendChild(btn);
    recentList.appendChild(li);
  });
}

async function restoreRecent(entry) {
  if (entry.type === "lifepath") {
    switchTab("lifepath");
    monthSelect.value = String(entry.params.month);
    daySelect.value = String(entry.params.day);
    yearSelect.value = String(entry.params.year);
    updateLifePathBtnState();
    await onCalcLifePath();
  } else if (entry.type === "name") {
    switchTab("name");
    nameInput.value = entry.params.name;
    yVowelToggle.checked = !!entry.params.yAsVowel;
    updateNameBtnState();
    await onCalcName();
  }
}

init();
