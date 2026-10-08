// Plain HTML / CSS / JS. Choose an intention, then move from lively scenes to nature.
const $ = id => document.getElementById(id);
const video = $("video");
const stage = $("stage");
const dialog = $("reflection");
const modeButtons = [...document.querySelectorAll(".mode")];
const responses = [...document.querySelectorAll(".response")];
const reasonInputs = [...document.querySelectorAll(".reason-input")];
const reasons = { moments: "A spare moment", rest: "Rest and relaxation", habit: "Boredom or habit", bedtime: "Before bed or low energy" };

// Authored sequence: visually busy scenes, everyday moments, then quiet nature.
// This is a design choice, not a measured stimulation or wellbeing score.
const clips = [
  { file: "light", id: 4231, slug: "pedestrian-walk-in-tokyo", phase: "Lively scenes", title: "A busy city street", description: "Bright signs, people and movement" },
  { file: "market", id: 992, slug: "market-shoppers", phase: "Lively scenes", title: "A walk around the market", description: "People, stalls and a shared space" },
  { file: "workshop", id: 40022, slug: "two-girls-in-a-pottery-workshop-making-clay-vases", phase: "Everyday moments", title: "Make something together", description: "Hands shaping clay in a pottery workshop" },
  { file: "friends", id: 43247, slug: "friends-talking-in-the-cafe", phase: "Everyday moments", title: "Time for a catch-up", description: "Friends talking over coffee", fit: "contain" },
  { file: "coffee", id: 3578, slug: "coffee-maker-making-coffee", phase: "Everyday moments", title: "A little café moment", description: "A familiar ritual, a slower moment" },
  { file: "ocean", id: 2091, slug: "turquoise-ocean-background-with-foaming-waves", phase: "Nature", title: "A view of the sea", description: "Moving water and open space" },
  { file: "flow", id: 41574, slug: "walking-a-path-that-crosses-a-dense-forest", phase: "Nature", title: "A short walk through the trees", description: "A quiet path outdoors" },
  { file: "shore", id: 44482, slug: "waves-of-the-sea-arriving-at-a-beach", phase: "Nature", title: "A quiet place by the water", description: "A moment on the shore" },
  { file: "horizon", id: 34363, slug: "defocused-view-of-the-sunset-reflection-in-the-sea", phase: "Nature", title: "The light at the end of the day", description: "Sunset on the water. A place to pause." }
];
const effects = Object.fromEntries(["slow", "space", "colour", "dim"].map(name => [name, { on: false, level: 0 }]));
const playlist = clips;
let clipIndex = 0;
let selectedReason = "";
let endedWithSequence = false;
let active = false;
let playing = false;
let wantedPlay = false;
let budget = 300;
let elapsed = 0;
let lastTick = performance.now();
let usingRemote = false;
let loadVersion = 0;
let touchStart = null;
let lastSwipe = -1000;
let wheelAmount = 0;

function formatTime(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
function renderTime() {
  $("remaining").textContent = formatTime(budget - elapsed);
  const progress = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
  $("clip-progress").style.width = Math.min(100, progress * 100) + "%";
}
function tick() {
  const now = performance.now();
  if (active && playing && !document.hidden && !dialog.open) elapsed = Math.min(budget, elapsed + (now - lastTick) / 1000);
  lastTick = now;
  renderTime();
  if (active && elapsed >= budget) endSession("time");
}
function stopCounting() { tick(); playing = false; }
function setPlayLabel(isPlaying) { $("play").textContent = isPlaying ? "Pause" : "Play"; }
function level(name) { return effects[name].on ? effects[name].level : 0; }

function renderEffects() {
  // Effects change the video only. Captions and controls stay readable.
  video.playbackRate = Number((1 - .35 * level("slow")).toFixed(2));
  video.style.transform = `scale(${(1 - .3 * level("space")).toFixed(3)})`;
  video.style.filter = `saturate(${(1 - level("colour")).toFixed(3)}) brightness(${(1 - .6 * level("dim")).toFixed(3)})`;
  stage.classList.toggle("space-on", effects.space.on);
  modeButtons.forEach(button => {
    const on = effects[button.dataset.mode].on;
    button.setAttribute("aria-pressed", String(on));
    const percentage = Math.round(level(button.dataset.mode) * 100);
    $(button.dataset.mode + "-level").textContent = percentage + "%";
  });
}
function restoreEffects() {
  Object.values(effects).forEach(effect => { effect.on = false; effect.level = 0; });
  renderEffects();
}
function advanceEffects() {
  Object.values(effects).forEach(effect => {
    if (effect.on) effect.level = Math.min(1, Math.round((effect.level + .18) * 100) / 100);
  });
  renderEffects();
}
async function playVideo() {
  if (!active || dialog.open) return;
  wantedPlay = true;
  const version = loadVersion;
  try { await video.play(); }
  catch (error) {
    if (version !== loadVersion || error.name === "AbortError") return;
    wantedPlay = false;
    setPlayLabel(false);
    $("status").textContent = error.name === "NotAllowedError" ? "Press Play to start." : "This clip could not play. Try Next.";
  }
}
function pauseVideo() {
  stopCounting();
  wantedPlay = false;
  video.pause();
  setPlayLabel(false);
}
function loadClip(index, shouldPlay) {
  stopCounting();
  video.pause();
  loadVersion++;
  clipIndex = Math.max(0, Math.min(index, playlist.length - 1));
  const clip = playlist[clipIndex];
  usingRemote = false;
  wantedPlay = shouldPlay;
  $("clip-topic").textContent = clip.phase;
  $("clip-title").textContent = clip.title;
  $("clip-description").textContent = clip.description;
  $("source").href = `https://mixkit.co/free-stock-video/${clip.slug}-${clip.id}/`;
  video.style.objectFit = clip.fit || "cover";
  video.loop = clipIndex < playlist.length - 1;
  video.poster = `media/${clip.file}.jpg`;
  video.src = `media/${clip.file}.mp4`;
  $("previous").disabled = clipIndex === 0;
  $("next").textContent = clipIndex === playlist.length - 1 ? "Finish" : "Next";
  renderEffects();
  setPlayLabel(false);
  if (shouldPlay && active) playVideo();
}
function startSession() {
  const choice = reasonInputs.find(input => input.checked);
  if (!choice || !reasons[choice.value]) return;
  active = false;
  pauseVideo();
  if (dialog.open) dialog.close();
  selectedReason = choice.value;
  endedWithSequence = false;
  budget = Number($("duration").value);
  elapsed = 0;
  lastTick = performance.now();
  active = true;
  restoreEffects();
  $("cover").hidden = true;
  $("feed").hidden = false;
  $("feed-reason").textContent = "Here for: " + reasons[selectedReason];
  renderTime();
  loadClip(0, true);
  $("status").textContent = "Turn on an effect on the right. It grows stronger as you change videos.";
  $("play").focus({ preventScroll: true });
}
function navigate(direction) {
  if (!active || dialog.open) return;
  tick();
  if (!active) return;
  if (clipIndex + direction < 0) return;
  if (clipIndex + direction >= playlist.length) { endSession("sequence"); return; }
  advanceEffects();
  loadClip(clipIndex + direction, wantedPlay);
  $("status").textContent = Object.values(effects).some(effect => effect.on)
    ? "Your selected effects grew a little stronger. Restore is always here."
    : "From lively scenes to quieter moments. Watch at your own pace.";
}
function returnToCover() {
  pauseVideo();
  active = false;
  if (dialog.open) dialog.close();
  restoreEffects();
  $("feed").hidden = true;
  $("cover").hidden = false;
  $("enter").focus({ preventScroll: true });
}
function endSession(reason) {
  if (!active) return;
  active = false;
  playing = false;
  wantedPlay = false;
  video.pause();
  setPlayLabel(false);
  endedWithSequence = reason === "sequence";
  const message = { time: "Your chosen time is up.", choice: "You chose to pause.", sequence: "You reached the end of this feed." };
  $("reflection-title").textContent = endedWithSequence ? "A natural place to pause." : "A moment to pause.";
  $("reflection-summary").textContent = `${message[reason]} You watched for ${formatTime(elapsed)}.`;
  $("continue").textContent = reason === "time" ? "Restore & continue 1 min" : endedWithSequence ? "Restore & replay nature" : "Restore & continue";
  responses.forEach(button => button.setAttribute("aria-pressed", "false"));
  $("reflection-note").textContent = "Your answer is not saved or sent.";
  dialog.showModal();
}

function renderReasonChoice() {
  reasonInputs.forEach(input => $("choice-" + input.value).classList.toggle("is-selected", input.checked));
  $("enter").disabled = !reasonInputs.some(input => input.checked);
}
reasonInputs.forEach(input => input.addEventListener("change", renderReasonChoice));

modeButtons.forEach(button => button.addEventListener("click", () => {
  if (!active) return;
  const name = button.dataset.mode;
  const effect = effects[name];
  effect.on = !effect.on;
  effect.level = effect.on ? .1 : 0;
  renderEffects();
  const descriptions = {
    slow: "Slow is on. Video playback gradually slows with each change.",
    space: "Space is on. The picture gets smaller and leaves more blank space.",
    colour: "Colour is on. Saturation fades towards black and white.",
    dim: "Dim is on. The video gradually becomes less bright."
  };
  $("status").textContent = effect.on ? descriptions[name] : "Effect off. Your other choices stay as they are.";
}));
$("enter").addEventListener("click", startSession);
$("back").addEventListener("click", returnToCover);
$("previous").addEventListener("click", () => navigate(-1));
$("next").addEventListener("click", () => navigate(1));
$("play").addEventListener("click", () => {
  if (!active) {
    dialog.showModal();
    return;
  }
  if (wantedPlay) { pauseVideo(); $("status").textContent = "Video and viewing time paused."; }
  else playVideo();
});
$("restore").addEventListener("click", () => {
  restoreEffects();
  $("status").textContent = "Restored: normal speed, full size, full colour and normal brightness.";
});
$("take-break").addEventListener("click", () => { tick(); if (active) endSession("choice"); else dialog.showModal(); });
$("duration").addEventListener("change", () => { $("duration-label").textContent = $("duration").selectedOptions[0].textContent; });
$("finish").addEventListener("click", returnToCover);
$("continue").addEventListener("click", () => {
  dialog.close();
  restoreEffects();
  if (elapsed >= budget) budget = elapsed + 60;
  if (endedWithSequence || video.ended) video.currentTime = 0;
  endedWithSequence = false;
  active = true;
  playing = false;
  lastTick = performance.now();
  playVideo();
  $("status").textContent = "The feed is restored. Continue at your own pace.";
});
// Closing the reflection also ends the session; playback does not resume automatically.
dialog.addEventListener("cancel", event => { event.preventDefault(); returnToCover(); });
responses.forEach(button => button.addEventListener("click", () => {
  responses.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  $("reflection-note").textContent = "Thanks for checking in. Your answer is not saved or sent.";
}));

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
video.addEventListener("playing", () => {
  if (!active || !wantedPlay || document.hidden || dialog.open) { video.pause(); return; }
  lastTick = performance.now();
  playing = true;
  setPlayLabel(true);
});
video.addEventListener("pause", () => { stopCounting(); setPlayLabel(false); });
video.addEventListener("waiting", stopCounting);
video.addEventListener("loadedmetadata", renderEffects);
video.addEventListener("ended", () => {
  tick();
  if (active && clipIndex === playlist.length - 1) endSession("sequence");
});
video.addEventListener("error", () => {
  stopCounting();
  if (!usingRemote) {
    usingRemote = true;
    loadVersion++;
    const clip = playlist[clipIndex];
    video.poster = `https://assets.mixkit.co/videos/${clip.id}/${clip.id}-thumb-720-0.jpg`;
    video.src = `https://assets.mixkit.co/videos/${clip.id}/${clip.id}-720.mp4`;
    if (active && wantedPlay) playVideo();
  } else {
    wantedPlay = false;
    setPlayLabel(false);
    $("status").textContent = "This clip could not load. Try Next or open the package with its included videos.";
  }
});
let coverFallback = false;
$("cover-photo").addEventListener("error", () => {
  if (coverFallback) return;
  coverFallback = true;
  $("cover-photo").src = "https://assets.mixkit.co/videos/41574/41574-thumb-720-0.jpg";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && active) {
    pauseVideo();
    $("status").textContent = "Paused while you were away. Press Play when you return.";
  }
});
window.addEventListener("pagehide", pauseVideo);
setInterval(tick, 200);
renderTime();
renderEffects();
renderReasonChoice();
