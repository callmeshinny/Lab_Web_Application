// Click an image to play sound; shortcut keys: W A S D J K L (optional)
const KEY_TO_PITCH = { w:"C4", a:"D4", s:"E4", d:"F4", j:"G4", k:"A4", l:"B4" };

// preload audio
const cache = {};
["C4","D4","E4","F4","G4","A4","B4"].forEach(p=>{
  const a = new Audio(`sounds/${p}.mp3`);
  a.preload = "auto";
  cache[p] = a;
});

function play(p){
  const a = cache[p];
  if(!a) return;
  try{ a.currentTime = 0; }catch{}
  a.play().catch(()=>{});
  const img = document.querySelector(`.note[data-pitch="${p}"]`);
  if(img){
    img.classList.add("playing");
    clearTimeout(img._t);
    img._t = setTimeout(()=>img.classList.remove("playing"), 160);
  }
}

// click image
document.querySelectorAll(".note").forEach(img=>{
  img.addEventListener("click", ()=> play(img.dataset.pitch));
});

// keyboard shortcut (no text shown)
window.addEventListener("keydown", e=>{
  const p = KEY_TO_PITCH[e.key.toLowerCase()];
  if(p) play(p);
});

// iOS/Safari unlock
document.addEventListener("click", ()=>{}, { once:true });
