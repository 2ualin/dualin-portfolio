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

    canvas.width = 1;
    canvas.height = 1;

    ctx.drawImage(img, 0, 0, 1, 1);

    const pixel = ctx.getImageData(0, 0, 1, 1).data;

    const r = Math.floor(pixel[0] * 0.5);
    const g = Math.floor(pixel[1] * 0.5);
    const b = Math.floor(pixel[2] * 0.5);

    document.body.style.backgroundColor =
      `rgb(${r}, ${g}, ${b})`;
  });
}, {
  threshold: 0.5
});

document.querySelectorAll(".card").forEach(card => {
  bgObserver.observe(card);
});
