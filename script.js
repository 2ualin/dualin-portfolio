// =======================
// 카드 스르륵 등장 효과
// =======================

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

cards.forEach(card => {
  observer.observe(card);
});


// =======================
// Hero 구간 검은 배경 복귀
// =======================

const body = document.body;
const hero = document.getElementById("hero");

if (hero) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        body.style.backgroundColor = "#0a0a0a";
      }
    });
  }, {
    threshold: 0.5
  });

  heroObserver.observe(hero);
}


// =======================
// 대표색 추출 배경 효과
// =======================

const cardObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (!entry.isIntersecting) return;

    const img = entry.target.querySelector("img");

    if (!img || !img.complete) return;

    try {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const pixels = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      const colorMap = {};

      // 샘플링 (속도 최적화)
      for (let i = 0; i < pixels.length; i += 40) {

        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];

        // 흰색 제외
        if (r > 240 && g > 240 && b > 240) {
          continue;
        }

        // 비슷한 색끼리 묶기
        r = Math.round(r / 32) * 32;
        g = Math.round(g / 32) * 32;
        b = Math.round(b / 32) * 32;

        const key = `${r},${g},${b}`;

        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      let dominant = "10,10,10";
      let max = 0;

      for (const key in colorMap) {

        if (colorMap[key] > max) {
          max = colorMap[key];
          dominant = key;
        }
      }

      let [r, g, b] = dominant.split(",");

      // 50% 어둡게
      r = Math.floor(r * 0.5);
      g = Math.floor(g * 0.5);
      b = Math.floor(b * 0.5);

      body.style.backgroundColor =
        `rgb(${r}, ${g}, ${b})`;

    } catch (e) {

      console.log("대표색 추출 실패", e);

    }

  });

}, {
  threshold: 0.5
});

cards.forEach(card => {
  cardObserver.observe(card);
});
