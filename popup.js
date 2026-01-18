const sound = document.getElementById("sound");
const random = document.getElementById("random");
const volume = document.getElementById("volume");
const body = document.body;

chrome.storage.sync.get(
  ["sound", "random", "volume", "theme"],
  (data) => {
    sound.value = data.sound || "meow1";
    random.checked = data.random || false;
    volume.value = data.volume ?? 0.7;
    body.className = data.theme || "light";
  }
);

sound.onchange = () =>
  chrome.storage.sync.set({ sound: sound.value });

random.onchange = () =>
  chrome.storage.sync.set({ random: random.checked });

volume.oninput = () =>
  chrome.storage.sync.set({ volume: volume.value });

document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.onclick = () => {
    body.className = btn.dataset.theme;
    chrome.storage.sync.set({ theme: btn.dataset.theme });
  };
});
