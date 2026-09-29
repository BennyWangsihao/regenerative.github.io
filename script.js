// 原生 JavaScript。四个模式独立工作，不需要安装任何库。
const $ = id => document.getElementById(id);
const video = $("video");
const stage = $("stage");
const dialog = $("reflection");
const modeButtons = [...document.querySelectorAll(".mode")];
const responseButtons = [...document.querySelectorAll(".response")];
const clips = [
  { file: "ocean", id: 2091, title: "A moment by the sea", slug: "turquoise-ocean-background-with-foaming-waves" },
  { file: "coffee", id: 3578, title: "A small coffee break", slug: "coffee-maker-making-coffee" },
  { file: "shore", id: 44482, title: "Waves on the shore", slug: "waves-of-the-sea-arriving-at-a-beach" },
  { file: "light", id: 4231, title: "A walk through the city", slug: "pedestrian-walk-in-tokyo" },
  { file: "flow", id: 41574, title: "A quiet forest path", slug: "walking-a-path-that-crosses-a-dense-forest" },
  { file: "horizon", id: 34363, title: "Light on the water", slug: "defocused-view-of-the-sunset-reflection-in-the-sea" }
];
const modes = Object.fromEntries(["shrink", "quiet", "colour"].map(name => [name, { on: false, level: 0 }]));
let pauseAtEnd = false;
let clipIndex = 0;
let active = false;
let playing = false;
let wantedPlay = false;
let budget = Number($("duration").value);
let elapsed = 0;
let lastTick = performance.now();
let timer;
let usingRemote = false;
let loadVersion = 0;
let lastSwipe = -1000;
let touchStart = null;
let wheelAmount = 0;

function timeLabel(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function renderTime() {
  $("remaining").textContent = timeLabel(budget - elapsed);
  $("bubble").style.setProperty("--size", 0.35 + 0.65 * elapsed / budget);
  const progress = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
  $("clip-progress").style.width = Math.min(100, progress * 100) + "%";
}

// 只计算真实播放时间。暂停、缓冲、离开标签页时停止计时。
function tick() {
  const now = performance.now();
  if (active && playing) elapsed = Math.min(budget, elapsed + (now - lastTick) / 1000);
  lastTick = now;
  renderTime();
  if (active && elapsed >= budget) endSession("time");
}

function stopCounting() { tick(); playing = false; }
function runTimer() {
  clearInterval(timer);
  lastTick = performance.now();
  timer = setInterval(tick, 200);
}
function level(name) { return modes[name].on ? modes[name].level : 0; }

function updateModes() {
  modeButtons.forEach(button => {
    const name = button.dataset.mode;
    const on = name === "pause" ? pauseAtEnd : modes[name].on;
    button.setAttribute("aria-pressed", String(on));
    $(name + "-level").textContent = !on ? "Off" : name === "pause" ? "On" : Math.round(level(name) * 100) + "%";
  });
  // 只有视频缩小与褪色，顶部 Bubble 和控制按钮不会受影响。
  video.style.transform = `scale(${1 - 0.3 * level("shrink")})`;
  video.style.filter = `grayscale(${level("colour")})`;
  $("social-cues").style.opacity = String(1 - level("quiet"));
  $("social-cues").setAttribute("aria-hidden", String(level("quiet") >= 0.95));
  video.loop = !pauseAtEnd;
}

function restoreModes() {
  Object.values(modes).forEach(mode => { mode.on = false; mode.level = 0; });
  pauseAtEnd = false;
  updateModes();
}
function advanceModes() {
  Object.values(modes).forEach(mode => {
    if (mode.on) mode.level = Math.min(1, Math.round((mode.level + 0.18) * 100) / 100);
  });
  updateModes();
}

function setPlayLabel(isPlaying) {
  $("play").textContent = isPlaying ? "Pause video" : "Play";
}
async function playVideo() {
  wantedPlay = true;
  const version = loadVersion;
  try { await video.play(); }
  catch (error) {
    if (version !== loadVersion || error.name === "AbortError") return;
    if (active && error.name === "NotAllowedError") {
      wantedPlay = false;
      setPlayLabel(false);
      $("status").textContent = "Press Play to start the video.";
    }
  }
}

function loadClip(index, shouldPlay) {
  stopCounting();
  loadVersion++;
  clipIndex = (index + clips.length) % clips.length;
  const clip = clips[clipIndex];
  usingRemote = false;
  wantedPlay = shouldPlay;
  $("clip-title").textContent = clip.title;
  $("source").href = `https://mixkit.co/free-stock-video/${clip.slug}-${clip.id}/`;
  video.poster = `media/${clip.file}.jpg`;
  video.src = `media/${clip.file}.mp4`;
  if (shouldPlay && active) playVideo();
}

function startSession() {
  if (dialog.open) dialog.close();
  restoreModes();
  budget = Number($("duration").value);
  elapsed = 0;
  active = true;
  playing = false;
  $("duration").disabled = true;
  $("start-layer").hidden = true;
  $("bubble-note").hidden = true;
  $("bubble-button").setAttribute("aria-expanded", "false");
  renderTime();
  runTimer();
  loadClip(0, true);
  $("status").textContent = "Choose a mode on the right. Shrink, Quiet and Colour grow with each swipe.";
}

function navigate(direction) {
  if (!active || dialog.open) return;
  tick();
  if (!active) return;
  const shouldPlay = wantedPlay;
  advanceModes();
  loadClip(clipIndex + direction, shouldPlay);
  const hasProgressiveMode = Object.values(modes).some(mode => mode.on);
  $("status").textContent = hasProgressiveMode ? "Your selected modes grew stronger. Restore is always available." : "Swipe at your own pace. You can take a break whenever you choose.";
}

function endSession(reason) {
  if (!active) return;
  active = false;
  playing = false;
  wantedPlay = false;
  clearInterval(timer);
  video.pause();
  setPlayLabel(false);
  $("duration").disabled = false;
  $("start-layer").hidden = false;
  $("start-note").textContent = "Return when you choose.";
  $("start").textContent = "Start a new break";
  const openings = { time: "Your chosen time is up.", clip: "This clip has ended. A natural place to pause.", choice: "You chose to take a break." };
  $("reflection-summary").textContent = openings[reason] + " You watched for " + timeLabel(elapsed) + ".";
  $("continue").textContent = reason === "time" ? "Restore & continue 1 min" : "Restore & continue";
  responseButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
  $("reflection-note").textContent = "Your reflection is not saved or sent.";
  dialog.showModal();
}

modeButtons.forEach(button => button.addEventListener("click", () => {
  if (!active) { $("status").textContent = "Start your break first, then choose a mode."; return; }
  const name = button.dataset.mode;
  if (name === "pause") {
    pauseAtEnd = !pauseAtEnd;
    $("status").textContent = pauseAtEnd ? "Pause is on. This clip will finish before your check-in appears." : "End-of-clip pause is off.";
  } else {
    const mode = modes[name];
    mode.on = !mode.on;
    mode.level = mode.on ? 0.1 : 0;
    const descriptions = { shrink: "The video will gradually shrink as you swipe.", quiet: "Sample likes and comments will fade as you swipe.", colour: "The video will gradually change from colour to black and white." };
    $("status").textContent = mode.on ? descriptions[name] : "Mode off. The other modes stay as you chose them.";
  }
  updateModes();
}));

$("start").addEventListener("click", startSession);
$("previous").addEventListener("click", () => navigate(-1));
$("next").addEventListener("click", () => navigate(1));
$("play").addEventListener("click", () => {
  if (!active) return startSession();
  if (wantedPlay) {
    wantedPlay = false;
    stopCounting();
    video.pause();
    setPlayLabel(false);
    $("status").textContent = "Playback and your break timer are paused.";
  } else playVideo();
});
$("restore").addEventListener("click", () => {
  restoreModes();
  $("status").textContent = "Restored: full size, full colour, visible sample reactions, and no end-of-clip pause.";
});
$("take-break").addEventListener("click", () => {
  if (!active) { $("status").textContent = "You are already paused. Take your time."; return; }
  tick();
  if (active) endSession("choice");
});
$("duration").addEventListener("change", () => {
  if (active) return;
  budget = Number($("duration").value);
  elapsed = 0;
  renderTime();
});
$("bubble-button").addEventListener("click", () => {
  const note = $("bubble-note");
  note.hidden = !note.hidden;
  $("bubble-button").setAttribute("aria-expanded", String(!note.hidden));
  note.textContent = "Watched " + timeLabel(elapsed) + " · " + timeLabel(budget - elapsed) + " remaining. This is a time cue, not an attention score.";
});
$("finish").addEventListener("click", () => {
  restoreModes();
  dialog.close();
  $("status").textContent = "A good place to stop. Look away, stretch, or return to your day.";
  $("start").focus();
});
$("continue").addEventListener("click", () => {
  dialog.close();
  const clipEnded = video.ended;
  restoreModes();
  if (elapsed >= budget) budget = elapsed + 60;
  active = true;
  playing = false;
  $("duration").disabled = true;
  $("start-layer").hidden = true;
  renderTime();
  runTimer();
  if (clipEnded) loadClip(clipIndex + 1, true);
  else playVideo();
  $("status").textContent = "The feed is restored. Continue at your own pace.";
});
responseButtons.forEach(button => button.addEventListener("click", () => {
  responseButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  $("reflection-note").textContent = "Thanks for checking in. Your reflection is not saved or sent.";
}));

// 支持滑动、滚轮、方向键和 Next / Previous 按钮。
function swipe(direction) {
  const now = performance.now();
  if (now - lastSwipe < 650) return;
  lastSwipe = now;
  navigate(direction);
}
stage.addEventListener("wheel", event => {
  if (!active || dialog.open) return;
  event.preventDefault();
  wheelAmount += event.deltaY;
  if (Math.abs(wheelAmount) > 60) { swipe(wheelAmount > 0 ? 1 : -1); wheelAmount = 0; }
}, { passive: false });
stage.addEventListener("pointerdown", event => {
  if (!event.target.closest("button, a")) touchStart = event.clientY;
});
stage.addEventListener("pointerup", event => {
  if (touchStart === null) return;
  const distance = touchStart - event.clientY;
  touchStart = null;
  if (Math.abs(distance) > 45) swipe(distance > 0 ? 1 : -1);
});
stage.addEventListener("pointercancel", () => { touchStart = null; });
stage.addEventListener("keydown", event => {
  if (event.target !== stage) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); swipe(event.key === "ArrowDown" ? 1 : -1); }
});

video.addEventListener("playing", () => {
  if (!active || !wantedPlay || document.hidden) { video.pause(); return; }
  lastTick = performance.now();
  playing = true;
  setPlayLabel(true);
});
video.addEventListener("pause", () => { stopCounting(); setPlayLabel(false); });
video.addEventListener("waiting", stopCounting);
video.addEventListener("ended", () => {
  stopCounting();
  if (active && pauseAtEnd) endSession("clip");
});

// 整包自带素材；只复制三份源码时，缺少本地文件会改为尝试在线样片。
video.addEventListener("error", () => {
  stopCounting();
  if (!usingRemote) {
    usingRemote = true;
    loadVersion++;
    const clip = clips[clipIndex];
    video.poster = `https://assets.mixkit.co/videos/${clip.id}/${clip.id}-thumb-720-0.jpg`;
    video.src = `https://assets.mixkit.co/videos/${clip.id}/${clip.id}-720.mp4`;
    if (active && wantedPlay) playVideo();
  } else {
    wantedPlay = false;
    setPlayLabel(false);
    $("status").textContent = "This sample could not load. Try Next, or use the package with included videos.";
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && active) {
    stopCounting();
    wantedPlay = false;
    video.pause();
    setPlayLabel(false);
    $("status").textContent = "Paused while you were away. Press Play when you choose to return.";
  }
});

loadClip(0, false);
updateModes();
renderTime();
