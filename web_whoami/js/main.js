const $$ = (s,r=document)=>r.querySelector(s);
const $$$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

const fmtVND = n => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
const pct = (old, now) => Math.round((1 - (now||old)/old)*100);

function data(){
  // Prefer global PRODUCTS (from data/products.js) to avoid fetch on file://
  if (Array.isArray(window.PRODUCTS)) return Promise.resolve(window.PRODUCTS);
  return fetch('data/products.json').then(r=>r.json()).catch(()=>[]);
}

async function renderGrid(){
  const grid = $$('.grid');
  if(!grid) return;
  const items = await data();
  grid.innerHTML = items.map(p => {
    const off = p.sale_price ? pct(p.price, p.sale_price) : 0;
    return `
    <article class="card">
      <a class="thumb" href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="wish" title="Save">♡</button>
      </a>
      <div class="meta">
        <div class="name"><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></div>
        <div class="price-row">
          <span class="price-new">${fmtVND(p.sale_price || p.price)}</span>
          ${p.sale_price ? `<span class="price-old">${fmtVND(p.price)}</span><span class="badge-off">(-${off}%)</span>` : ""}
        </div>
        <div class="swatches">${(p.colors||[]).map(c=>`<span class="sw" style="background:${c}"></span>`).join('')}</div>
      </div>
    </article>`;
  }).join('');
}

async function renderProduct(){
  const root = $$('#product');
  if(!root) return;
  const q = new URLSearchParams(location.search);
  const id = q.get('id');
  const items = await data();
  const p = items.find(x=>x.id===id) || items[0];
  const off = p.sale_price ? pct(p.price, p.sale_price) : 0;
  root.innerHTML = `
    <div class="product-wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
      <div class="thumb"><img src="${p.image}" alt="${p.name}"></div>
      <div>
        <div class="kicker" style="color:#777;letter-spacing:.12em;text-transform:uppercase;font-size:12px">${p.category||"APPAREL"}</div>
        <h1 class="title" style="margin:6px 0 8px">${p.name}</h1>
        <p class="desc" style="color:#666">${p.description||""}</p>
        <div class="price-row" style="margin:12px 0">
          <span class="price-new" style="font-size:22px;font-weight:700">${fmtVND(p.sale_price || p.price)}</span>
          ${p.sale_price ? `<span class="price-old" style="margin-left:10px">${fmtVND(p.price)}</span><span class="badge-off" style="margin-left:6px">(-${off}%)</span>` : ""}
        </div>
        <div class="swatches" style="margin:10px 0">${(p.colors||[]).map(c=>`<span class="sw" style="width:16px;height:16px;background:${c}"></span>`).join('')}</div>
        <div class="opt-row"><a class="btn" href="index.html" style="display:inline-flex;padding:10px 14px;border:1px solid #ececec;border-radius:10px;background:#fff">Back</a></div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded',()=>{
  renderGrid();
  renderProduct();
});