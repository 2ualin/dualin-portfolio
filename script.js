const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{
  threshold:0.2
});

cards.forEach(card=>{
  observer.observe(card);
});

const images = document.querySelectorAll(".card img");

images.forEach((img) => {
  img.crossOrigin = "anonymous";

  img.addEventListener("load", () => {
    img.dataset.loaded = "true";
  });
});

const bgObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const img = entry.target.querySelector("img");
    if (!img || img.dataset.loaded !== "true") return;

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

let r = 0;
let g = 0;
let b = 0;
let count = 0;

for (let i = 0; i < pixels.length; i += 40) {

  const pr = pixels[i];
  const pg = pixels[i + 1];
  const pb = pixels[i + 2];

  // 거의 흰색은 제외
  if (pr > 240 && pg > 240 && pb > 240) {
    continue;
  }

  r += pr;
  g += pg;
  b += pb;

  count++;
}

if (count > 0) {
  r = Math.floor((r / count) * 0.5);
  g = Math.floor((g / count) * 0.5);
  b = Math.floor((b / count) * 0.5);

  document.body.style.backgroundColor =
    `rgb(${r}, ${g}, ${b})`;
}
  });
}, {
  threshold: 0.5
});

document.querySelectorAll(".card").forEach(card => {
  bgObserver.observe(card);
});
