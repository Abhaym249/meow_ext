let lastClickTime = 0;
let clickCount = 0;

document.addEventListener("click", (event) => {
  chrome.storage.sync.get(
    ["sound", "random", "volume"],
    (data) => {

      const sounds = ["meow1", "meow2", "angry", "kitten"];

      const siteMap = {
        "youtube.com": "angry",
        "leetcode.com": "meow2",
        "google.com": "kitten"
      };

      const hostname = location.hostname;

      let siteSound = null;
      for (const site in siteMap) {
        if (hostname.includes(site)) {
          siteSound = siteMap[site];
          break;
        }
      }

      let selectedSound;
      if (siteSound) {
        selectedSound = siteSound;
      } else if (data.random) {
        selectedSound = sounds[Math.floor(Math.random() * sounds.length)];
      } else {
        selectedSound = data.sound || "meow1";
      }

      const now = Date.now();
      if (now - lastClickTime < 300) {
        clickCount++;
      } else {
        clickCount = 1;
      }
      lastClickTime = now;

      if (clickCount === 10) {
        selectedSound = "special";
        clickCount = 0;
      }

      // 🔊 PLAY SOUND (unchanged)
      const audio = new Audio(
        chrome.runtime.getURL(`sounds/${selectedSound}.mp3`)
      );
      audio.volume = data.volume ?? 0.7;
      audio.play();

      // 🐾 EMOJI SPAWN (NEW)
      const emoji = document.createElement("div");
      emoji.className = "meow-emoji";
      emoji.textContent = "🐾"; // change to 😺 if you want

      emoji.style.left = `${event.clientX}px`;
      emoji.style.top = `${event.clientY}px`;

      document.body.appendChild(emoji);

      setTimeout(() => {
        emoji.remove();
      }, 1000);
    }
  );
});
