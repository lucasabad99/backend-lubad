const socket = io();

const productsList = document.getElementById('productsList');
const productForm = document.getElementById('productForm');

function renderProducts(products){
  productsList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong> - ${p.description} - $${p.price} (id: ${p.id}) <button data-id="${p.id}" class="del">Delete</button>`;
    productsList.appendChild(li);
  });
  document.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      socket.emit('deleteProduct', Number(id));
    });
  });
}

socket.on('products', (products) => {
  renderProducts(products || []);
});

socket.on('connect', () => {
  console.log('connected socket', socket.id);
});

socket.on('error', (err) => {
  console.error('server error', err);
});

productForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const payload = Object.fromEntries(formData.entries());
  // coerce numeric fields
  if (payload.price) payload.price = Number(payload.price);
  if (payload.stock) payload.stock = Number(payload.stock);
  socket.emit('newProduct', payload);
  productForm.reset();
});
