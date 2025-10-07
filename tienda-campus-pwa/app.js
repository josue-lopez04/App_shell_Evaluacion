// Carga productos desde JSON. Si no hay red, usa un arreglo local de respaldo.
// También filtra por categoría cuando se hace clic en el menú.

const $products = document.getElementById('products');
const $navBtns = document.querySelectorAll('.nav-btn');

// Respaldo local (por si falla la red) que es lo que se descarga
const fallbackProducts = [
  { id: 1, name: 'Cuaderno Profesional', price: 45, category: 'papeleria' },
  { id: 2, name: 'Memoria USB 32GB', price: 129, category: 'electronica' },
  { id: 3, name: 'Barra de Granola', price: 18, category: 'snacks' }
];

/*
  ¿Por qué el App Shell ayuda sin conexión?
  - El usuario obtiene de inmediato la UI (header/menú/pie) desde la caché.
  - La app "abre" rápido y es usable, incluso si la red está caída.
  Diferencia:
  - Shell: archivos estáticos cacheados (index.html, styles.css, app.js, icons).
  - Dinámico: datos que cambian (products.json); se intentan pedir a la red.
*/

let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch('data/products.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Network error');
    allProducts = await res.json();
  } catch (err) {
    // Sin conexión o error: usamos respaldo local
    allProducts = fallbackProducts;
  }
  renderProducts(allProducts);
}

function renderProducts(list) {
  if (!list || list.length === 0) {
    $products.innerHTML = `<p>No hay productos para mostrar.</p>`;
    return;
  }
  $products.innerHTML = list.map(p => `
    <article class="card" aria-label="${p.name}">
      <span class="badge">${capitalize(p.category)}</span>
      <h3>${p.name}</h3>
      <div class="price">$${p.price}.00</div>
    </article>
  `).join('');
}

function filterByCategory(cat) {
  if (!cat) return renderProducts(allProducts);
  renderProducts(allProducts.filter(p => p.category === cat));
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

$navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    $navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterByCategory(btn.dataset.category);
  });
});

// Carga inicial
loadProducts();
