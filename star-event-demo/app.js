const storageKey = "starEventReminderDemoEvents";

const demoEvents = [
  {
    id: "demo-roadshow",
    title: "AI Agent 作品集路演",
    startDate: "2026-07-08",
    endDate: "2026-07-08",
    time: "14:30",
    location: "线上会议",
    importance: 5,
    status: "preparing",
    notes: "准备 3 分钟项目介绍，重点讲清楚用户痛点、Agent 工作流、Demo 边界和下一步迭代。",
    links: ["https://kkky-ai.github.io/agent-portfolio/"],
    imageUrls: [],
    checklist: ["确认作品集链接", "准备演示顺序", "测试手机日历导出"],
    reminders: [
      { value: 7, unit: "days" },
      { value: 1, unit: "days" },
      { value: 2, unit: "hours" }
    ],
    notified: {},
    createdAt: "2026-07-02T10:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z"
  },
  {
    id: "demo-interview",
    title: "AI 产品经理面试",
    startDate: "2026-07-13",
    endDate: "2026-07-13",
    time: "10:00",
    location: "公司会议室",
    importance: 5,
    status: "not_started",
    notes: "围绕真实需求、产品判断、Agent 能力边界、落地成本和数据安全展开。",
    links: ["https://github.com/kkky-ai"],
    imageUrls: [],
    checklist: ["复盘三个代表项目", "准备 STAR 案例", "检查作品链接可访问"],
    reminders: [
      { value: 3, unit: "days" },
      { value: 1, unit: "days" }
    ],
    notified: {},
    createdAt: "2026-07-02T10:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z"
  }
];

const state = {
  events: loadStoredEvents(),
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  selectedDate: toDateInput(new Date()),
  editingId: "",
  importance: 3,
  reminders: []
};

const els = {
  grid: document.querySelector("#calendarGrid"),
  monthTitle: document.querySelector("#monthTitle"),
  monthSubtitle: document.querySelector("#monthSubtitle"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  todayBtn: document.querySelector("#todayBtn"),
  exportCalendarBtn: document.querySelector("#exportCalendarBtn"),
  newEventBtn: document.querySelector("#newEventBtn"),
  form: document.querySelector("#eventForm"),
  detail: document.querySelector("#eventDetail"),
  panel: document.querySelector(".editor-panel"),
  panelTitle: document.querySelector("#panelTitle"),
  panelHint: document.querySelector("#panelHint"),
  closeEditor: document.querySelector("#closeEditor"),
  deleteEvent: document.querySelector("#deleteEvent"),
  stars: document.querySelector("#stars"),
  addReminder: document.querySelector("#addReminder"),
  reminderRows: document.querySelector("#reminderRows"),
  pasteLinks: document.querySelector("#pasteLinks"),
  pasteImageOrLink: document.querySelector("#pasteImageOrLink"),
  imageUpload: document.querySelector("#imageUpload"),
  imageDropZone: document.querySelector("#imageDropZone"),
  imagePreview: document.querySelector("#imagePreview"),
  todayAgenda: document.querySelector("#todayAgenda"),
  weekAgenda: document.querySelector("#weekAgenda"),
  todayCount: document.querySelector("#todayCount"),
  weekCount: document.querySelector("#weekCount"),
  fiveStarCount: document.querySelector("#fiveStarCount"),
  todayLabel: document.querySelector("#todayLabel")
};

const fields = ["eventId", "title", "startDate", "endDate", "time", "location", "status", "checklist", "notes", "links", "imageUrls"]
  .reduce((acc, id) => ({ ...acc, [id]: document.querySelector(`#${id}`) }), {});

function loadStoredEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    return Array.isArray(stored) ? stored : demoEvents;
  } catch (_error) {
    return demoEvents;
  }
}

function saveStoredEvents() {
  localStorage.setItem(storageKey, JSON.stringify(state.events));
}

function toDateInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDate(a, b) {
  return toDateInput(a) === toDateInput(b);
}

function monthLabel(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function dateLabel(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function eventOnDate(event, dateValue) {
  return event.startDate <= dateValue && event.endDate >= dateValue;
}

function eventSort(a, b) {
  const at = a.time || "99:99";
  const bt = b.time || "99:99";
  if (at !== bt) return at.localeCompare(bt);
  return b.importance - a.importance;
}

function linesToArray(value) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function appendLines(field, lines) {
  const next = [...linesToArray(field.value), ...lines.map((line) => line.trim()).filter(Boolean)];
  field.value = [...new Set(next)].join("\n");
  field.dispatchEvent(new Event("input"));
}

function extractUrls(text) {
  return String(text || "").match(/https?:\/\/[^\s<>"']+/g) || [];
}

function arrayToLines(value) {
  return (value || []).join("\n");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function linkLabel(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "") + parsed.pathname;
  } catch (_error) {
    return url;
  }
}

function formatDateRange(event) {
  const start = dateLabel(parseDate(event.startDate));
  const end = dateLabel(parseDate(event.endDate || event.startDate));
  return event.endDate && event.endDate !== event.startDate ? `${start} - ${end}` : start;
}

function reminderName(item) {
  const unit = item.unit === "hours" ? "小时前" : "天前";
  return `提前 ${item.value} ${unit}`;
}

function statusName(status) {
  return {
    not_started: "未开始",
    preparing: "准备中",
    done: "已完成",
    cancelled: "已取消"
  }[status] || "未开始";
}

function stars(count) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function render() {
  renderCalendar();
  renderStars();
  renderReminders();
  renderSummary();
  renderImages();
}

function renderCalendar() {
  els.monthTitle.textContent = monthLabel(state.month);
  els.monthSubtitle.textContent = "Demo 模式：点击日期新增，点击事项查看详情";
  els.grid.innerHTML = "";

  const first = new Date(state.month.getFullYear(), state.month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -startOffset);
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    const dateValue = toDateInput(date);
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (date.getMonth() !== state.month.getMonth()) cell.classList.add("outside");
    if (sameDate(date, today)) cell.classList.add("today");
    if (dateValue === state.selectedDate) cell.classList.add("selected");
    cell.addEventListener("click", () => newEvent(dateValue));

    const head = document.createElement("div");
    head.className = "day-number";
    head.innerHTML = `<span>${date.getDate()}</span>${sameDate(date, today) ? '<span class="today-pill">今天</span>' : ""}`;
    cell.appendChild(head);

    state.events
      .filter((event) => eventOnDate(event, dateValue))
      .sort(eventSort)
      .forEach((event) => {
        const btn = document.createElement("button");
        btn.className = `event-pill level-${event.importance}`;
        btn.innerHTML = `<strong>${escapeHtml(event.title)}</strong><span class="event-time">${event.time || "全天"} · ${stars(event.importance)}</span>`;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          showEvent(event.id);
        });
        cell.appendChild(btn);
      });

    els.grid.appendChild(cell);
  }
}

function renderSummary() {
  const now = new Date();
  const todayValue = toDateInput(now);
  const weekStart = addDays(now, -((now.getDay() + 6) % 7));
  const weekEnd = addDays(weekStart, 6);
  const weekStartValue = toDateInput(weekStart);
  const weekEndValue = toDateInput(weekEnd);
  const todayEvents = state.events.filter((event) => eventOnDate(event, todayValue)).sort(eventSort);
  const weekEvents = state.events
    .filter((event) => event.endDate >= weekStartValue && event.startDate <= weekEndValue)
    .sort((a, b) => `${a.startDate} ${a.time || "99:99"}`.localeCompare(`${b.startDate} ${b.time || "99:99"}`));

  els.todayCount.textContent = todayEvents.length;
  els.weekCount.textContent = weekEvents.length;
  els.fiveStarCount.textContent = state.events.filter((event) => event.importance === 5 && event.status !== "done").length;
  els.todayLabel.textContent = dateLabel(now);
  els.todayAgenda.innerHTML = agendaHtml(todayEvents, "今天没有大事。");
  els.weekAgenda.innerHTML = agendaHtml(weekEvents, "本周暂时没有大事。", true);
}

function agendaHtml(events, emptyText, showDate = false) {
  if (!events.length) return `<div class="agenda-empty">${emptyText}</div>`;
  return events.map((event) => `
    <button class="agenda-item" onclick="showEvent('${event.id}')">
      <strong>${escapeHtml(event.title)}</strong>
      <div class="agenda-meta">${showDate ? `${formatDateRange(event)} · ` : ""}${event.time || "全天"} · ${stars(event.importance)}</div>
    </button>
  `).join("");
}

function renderStars() {
  els.stars.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `star-btn ${i <= state.importance ? "active" : ""}`;
    btn.textContent = "★";
    btn.title = `${i} 星`;
    btn.addEventListener("click", () => {
      state.importance = i;
      renderStars();
    });
    els.stars.appendChild(btn);
  }
}

function renderReminders() {
  els.reminderRows.innerHTML = "";
  if (!state.reminders.length) {
    const empty = document.createElement("div");
    empty.className = "reminder-empty";
    empty.textContent = "暂未设置提醒，点击下方按钮添加。";
    els.reminderRows.appendChild(empty);
    return;
  }
  state.reminders.forEach((reminder, index) => {
    const row = document.createElement("div");
    row.className = "reminder-row";
    row.innerHTML = `
      <span class="reminder-prefix">提前</span>
      <input type="number" min="1" value="${reminder.value}" aria-label="提醒数值" />
      <select aria-label="提醒单位">
        <option value="days" ${reminder.unit === "days" ? "selected" : ""}>天</option>
        <option value="hours" ${reminder.unit === "hours" ? "selected" : ""}>小时</option>
      </select>
      <button type="button" class="row-delete" title="删除提醒">×</button>
    `;
    row.querySelector("input").addEventListener("input", (event) => {
      state.reminders[index].value = Math.max(1, Number(event.target.value || 1));
    });
    row.querySelector("select").addEventListener("change", (event) => {
      state.reminders[index].unit = event.target.value;
    });
    row.querySelector("button").addEventListener("click", () => {
      state.reminders.splice(index, 1);
      renderReminders();
    });
    els.reminderRows.appendChild(row);
  });
}

function renderImages() {
  const urls = linesToArray(fields.imageUrls.value);
  els.imagePreview.innerHTML = urls.map((url) => `
    <figure>
      <img src="${escapeHtml(url)}" alt="事项图片预览" />
      <button type="button" data-remove-image="${escapeHtml(url)}">移除</button>
    </figure>
  `).join("");
  els.imagePreview.querySelectorAll("[data-remove-image]").forEach((btn) => {
    btn.addEventListener("click", () => {
      fields.imageUrls.value = linesToArray(fields.imageUrls.value).filter((url) => url !== btn.dataset.removeImage).join("\n");
      renderImages();
    });
  });
}

async function uploadImageFiles(files) {
  const urls = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    urls.push(await fileToDataUrl(file));
  }
  appendLines(fields.imageUrls, urls);
  renderImages();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      image.onload = () => {
        const aspect = image.height / Math.max(image.width, 1);
        const isLongImage = aspect >= 2.2;
        const maxWidth = isLongImage ? 1280 : 2200;
        const maxHeight = isLongImage ? 18000 : 2200;
        const maxPixels = isLongImage ? 16_000_000 : 8_000_000;
        const pixelScale = Math.sqrt(maxPixels / Math.max(image.width * image.height, 1));
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height, pixelScale);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        const webp = canvas.toDataURL("image/webp", 0.92);
        resolve(webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.92));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function pasteClipboard(target) {
  if (!navigator.clipboard) {
    alert("当前浏览器不支持读取剪贴板，请用 Ctrl+V 直接粘贴。");
    return;
  }
  try {
    const text = await navigator.clipboard.readText();
    const urls = extractUrls(text);
    if (urls.length) appendLines(target, urls);
    else if (text.trim()) appendLines(target, [text.trim()]);
  } catch (_error) {
    alert("浏览器没有允许读取剪贴板，请点输入框后用 Ctrl+V 粘贴。");
  }
}

async function pasteImageOrLink() {
  try {
    if (navigator.clipboard?.read) {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          await uploadImageFiles([new File([blob], "clipboard-image.png", { type: imageType })]);
          return;
        }
      }
    }
  } catch (_error) {
    // Fall back to text clipboard below.
  }
  await pasteClipboard(fields.imageUrls);
}

function openEditor() {
  els.panel.classList.add("open");
}

function closeEditor() {
  els.panel.classList.remove("open");
}

function showForm() {
  els.panel.classList.add("form-mode");
  els.panel.classList.remove("detail-mode");
  els.form.hidden = false;
  els.detail.hidden = true;
}

function showDetailPanel(event) {
  els.panel.classList.add("detail-mode");
  els.panel.classList.remove("form-mode");
  els.form.hidden = true;
  els.detail.hidden = false;
  els.panelTitle.textContent = event.title || "大事详情";
  els.panelHint.textContent = `${formatDateRange(event)} · ${event.time || "全天"}`;

  const links = event.links || [];
  const images = event.imageUrls || [];
  const checklist = event.checklist || [];
  const reminders = event.reminders || [];

  els.detail.innerHTML = `
    <div class="detail-hero">
      <div class="detail-title-row">
        <span class="detail-color-dot"></span>
        <div>
          <h3>${escapeHtml(event.title)}</h3>
          <p class="detail-meta-line">${formatDateRange(event)} · ${event.time || "全天"}${event.location ? ` · ${escapeHtml(event.location)}` : ""}</p>
          <div class="detail-stars">${stars(event.importance)}</div>
        </div>
      </div>
    </div>
    <div class="detail-actions">
      <button type="button" class="primary-btn" data-edit-event>编辑</button>
    </div>
    <div class="detail-list">
      <section class="detail-section">
        <div class="detail-icon">◷</div>
        <div><h4>提醒</h4><p>${reminders.length ? reminders.map(reminderName).join(" / ") : "未设置提醒"}</p></div>
      </section>
      <section class="detail-section">
        <div class="detail-icon">◌</div>
        <div><h4>状态</h4><p>${statusName(event.status)}</p></div>
      </section>
      ${event.notes ? `<section class="detail-section"><div class="detail-icon">✎</div><div><h4>备注</h4><p>${escapeHtml(event.notes).replaceAll("\n", "<br>")}</p></div></section>` : ""}
      ${checklist.length ? `<section class="detail-section"><div class="detail-icon">☑</div><div><h4>准备清单</h4><ul>${checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>` : ""}
      ${links.length ? `<section class="detail-section"><div class="detail-icon">↗</div><div><h4>链接</h4><div class="detail-links">${links.map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(linkLabel(url))}</a>`).join("")}</div></div></section>` : ""}
      ${images.length ? `<section class="detail-section"><div class="detail-icon">▧</div><div><h4>图片</h4><div class="detail-images">${images.map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(url)}" alt="事项图片" /></a>`).join("")}</div></div></section>` : ""}
    </div>
  `;
  els.detail.querySelector("[data-edit-event]")?.addEventListener("click", () => editEvent(event.id));
  openEditor();
}

function showEvent(id) {
  const event = state.events.find((item) => item.id === id);
  if (!event) return;
  state.editingId = id;
  state.selectedDate = event.startDate;
  renderCalendar();
  renderSummary();
  showDetailPanel(event);
}

function newEvent(dateValue = state.selectedDate) {
  showForm();
  state.selectedDate = dateValue;
  state.editingId = "";
  state.importance = 3;
  state.reminders = [{ value: 7, unit: "days" }, { value: 1, unit: "days" }];
  fields.eventId.value = "";
  fields.title.value = "";
  fields.startDate.value = dateValue;
  fields.endDate.value = dateValue;
  fields.time.value = "";
  fields.location.value = "";
  fields.status.value = "not_started";
  fields.checklist.value = "";
  fields.notes.value = "";
  fields.links.value = "";
  fields.imageUrls.value = "";
  els.panelTitle.textContent = "新增大事";
  els.panelHint.textContent = `${dateValue} 的重要事项`;
  els.deleteEvent.style.visibility = "hidden";
  render();
  openEditor();
}

function editEvent(id) {
  const event = state.events.find((item) => item.id === id);
  if (!event) return;
  showForm();
  state.editingId = id;
  state.importance = event.importance;
  state.reminders = (event.reminders || []).map((item) => ({ ...item }));
  fields.eventId.value = event.id;
  fields.title.value = event.title;
  fields.startDate.value = event.startDate;
  fields.endDate.value = event.endDate;
  fields.time.value = event.time || "";
  fields.location.value = event.location || "";
  fields.status.value = event.status || "not_started";
  fields.checklist.value = arrayToLines(event.checklist);
  fields.notes.value = event.notes || "";
  fields.links.value = arrayToLines(event.links);
  fields.imageUrls.value = arrayToLines(event.imageUrls);
  els.panelTitle.textContent = "编辑大事";
  els.panelHint.textContent = `${event.startDate}${event.endDate !== event.startDate ? ` 至 ${event.endDate}` : ""}`;
  els.deleteEvent.style.visibility = "visible";
  render();
  openEditor();
}

window.editEvent = editEvent;
window.showEvent = showEvent;

function eventPayload() {
  const title = fields.title.value.trim();
  if (!title) throw new Error("事情名称不能为空");
  const startDate = fields.startDate.value;
  const endDate = fields.endDate.value || startDate;
  if (endDate < startDate) throw new Error("结束日期不能早于开始日期");
  return {
    id: fields.eventId.value || crypto.randomUUID(),
    title,
    startDate,
    endDate,
    time: fields.time.value,
    location: fields.location.value.trim(),
    importance: state.importance,
    status: fields.status.value,
    notes: fields.notes.value.trim(),
    links: linesToArray(fields.links.value),
    imageUrls: linesToArray(fields.imageUrls.value),
    checklist: linesToArray(fields.checklist.value),
    reminders: state.reminders.length ? state.reminders : [{ value: 1, unit: "days" }],
    notified: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

async function saveEvent(event) {
  event.preventDefault();
  try {
    const payload = eventPayload();
    const index = state.events.findIndex((item) => item.id === payload.id);
    if (index >= 0) state.events[index] = { ...state.events[index], ...payload, createdAt: state.events[index].createdAt };
    else state.events.push(payload);
    saveStoredEvents();
    render();
    showEvent(payload.id);
  } catch (error) {
    alert(error.message);
  }
}

async function deleteEvent() {
  const id = fields.eventId.value || state.editingId;
  if (!id) return;
  if (!confirm("确定删除这个大事吗？")) return;
  state.events = state.events.filter((event) => event.id !== id);
  saveStoredEvents();
  closeEditor();
  render();
}

function escapeIcsText(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function compactDate(dateValue) {
  return String(dateValue || "").replaceAll("-", "");
}

function compactDateTime(dateValue, timeValue) {
  return `${compactDate(dateValue)}T${String(timeValue || "09:00").replace(":", "")}00`;
}

function reminderTrigger(reminder) {
  return reminder.unit === "hours" ? `-PT${reminder.value}H` : `-P${reminder.value}D`;
}

function buildCalendar() {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Star Event Reminder Demo//CN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:星标大事提醒 Demo"];
  state.events.filter((event) => event.status !== "cancelled").forEach((event) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@star-event-demo`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    if (event.time) {
      lines.push(`DTSTART;TZID=Asia/Shanghai:${compactDateTime(event.startDate, event.time)}`);
      lines.push(`DTEND;TZID=Asia/Shanghai:${compactDateTime(event.endDate || event.startDate, event.time)}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${compactDate(event.startDate)}`);
      lines.push(`DTEND;VALUE=DATE:${compactDate(toDateInput(addDays(parseDate(event.endDate || event.startDate), 1)))}`);
    }
    if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    const description = [event.notes, ...(event.links || []), ...(event.checklist || [])].filter(Boolean).join("\n");
    if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    (event.reminders || []).forEach((reminder) => {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${escapeIcsText(event.title)}`);
      lines.push(`TRIGGER:${reminderTrigger(reminder)}`);
      lines.push("END:VALARM");
    });
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function downloadCalendar() {
  const blob = new Blob([buildCalendar()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "star-event-demo.ics";
  link.click();
  URL.revokeObjectURL(url);
}

els.prevMonth.addEventListener("click", () => {
  state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
  renderCalendar();
});
els.nextMonth.addEventListener("click", () => {
  state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
  renderCalendar();
});
els.todayBtn.addEventListener("click", () => {
  state.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  state.selectedDate = toDateInput(new Date());
  render();
});
els.newEventBtn.addEventListener("click", () => newEvent(state.selectedDate));
els.exportCalendarBtn.addEventListener("click", downloadCalendar);
els.closeEditor.addEventListener("click", closeEditor);
els.form.addEventListener("submit", saveEvent);
els.deleteEvent.addEventListener("click", deleteEvent);
els.addReminder.addEventListener("click", () => {
  state.reminders.push({ value: 1, unit: "days" });
  renderReminders();
});
els.pasteLinks.addEventListener("click", () => pasteClipboard(fields.links));
els.pasteImageOrLink.addEventListener("click", pasteImageOrLink);
els.imageUpload.addEventListener("change", async (event) => {
  try {
    await uploadImageFiles([...event.target.files]);
    els.imageUpload.value = "";
  } catch (error) {
    alert(error.message);
  }
});
document.addEventListener("paste", async (event) => {
  const files = [...(event.clipboardData?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (files.length) {
    event.preventDefault();
    try {
      await uploadImageFiles(files);
    } catch (error) {
      alert(error.message);
    }
    return;
  }
  const text = event.clipboardData?.getData("text") || "";
  if (text && document.activeElement === fields.links) {
    event.preventDefault();
    appendLines(fields.links, extractUrls(text).length ? extractUrls(text) : [text]);
  }
});
fields.imageUrls.addEventListener("input", renderImages);

if (window.matchMedia("(min-width: 761px)").matches) {
  newEvent(state.selectedDate);
} else {
  showForm();
  closeEditor();
  render();
}
