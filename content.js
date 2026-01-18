let lastClick = 0;
let streak = 0;

document.addEventListener("click", (e) => {
  chrome.storage.sync.get(
    ["sound", "random", "volume"],
    (data) => {

      const sounds = ["meow1", "meow2", "angry", "kitten"];

      // Website-based sound
      const siteMap = {
        "youtube.com": "angry",
        "leetcode.com": "meow2",
        "google.com": "kitten"
      };

      let hostname = location.hostname;
      let siteSound = Object.keys(siteMap)
        .find(site => hostname.includes(site));

      let selectedSound =
        siteSound ||
        (data.random
          ? sounds[Math.floor(Math.random() * sounds.length)]
          : data.sound || "meow1");

      // Click streak logic
      const now = Date.now();
      streak = (now - lastClick < 600) ? streak + 1 : 1;
      lastClick = now;

      if (streak >= 10) {
        selectedSound = "special";
        streak = 0;
      }

      const audio = new Audio(
        chrome.runtime.getURL(`sounds/${selectedSound}.mp3`)
      );
      audio.volume = data.volume ?? 0.7;
      audio.play();
    }
  );

  // 🐾 Paw animation
  const paw = document.createElement("div");
  paw.className = "paw-print";
  paw.style.left = e.pageX + "px";
  paw.style.top = e.pageY + "px";
  document.body.appendChild(paw);

  setTimeout(() => paw.remove(), 800);
});
