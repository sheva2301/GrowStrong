let lastNama = '';
let lastKontak = '';
let lastMetode = '';

const cart = [];

function addToCart(productName, button) {
  const quantityDisplay = button.previousElementSibling.querySelector('.quantity-display');
  const quantity = parseInt(quantityDisplay.textContent);

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ name: productName, qty: quantity });
  }

  updateCart();
}



function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.qty * 100000;
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.qty} - Rp${subtotal.toLocaleString('id-ID')}`;
    cartItems.appendChild(li);
    total += subtotal;
  });

  totalPrice.textContent = 'Rp' + total.toLocaleString('id-ID');
}

function changeQuantity(button, delta) {
  const display = button.parentElement.querySelector('.quantity-display');
  let current = parseInt(display.textContent);
  current = Math.max(1, current + delta);
  display.textContent = current;
}

function checkout() {
  if (cart.length === 0) {
    alert('Keranjang kosong!');
    return;
  }

  const nama = prompt("Masukkan nama Anda:");
  const kontak = prompt("Masukkan nomor WhatsApp:");
  const metodeInput = prompt("Pilih metode pembayaran:\n1. Transfer Bank\n2. QRIS\n3. COD\n(Ketik angka 1/2/3)");
  const metode = metodeInput ? metodeInput.trim() : ''; 
  
  if (!nama || !kontak || !metode) {
    alert("Data tidak lengkap. Mohon isi semua informasi.");
    return;
  }

  let metodeText = '';
  if (metode === '1') metodeText = 'Transfer Bank';
  else if (metode === '2') metodeText = 'QRIS';
  else if (metode === '3') metodeText = 'COD';
  else metodeText = 'Tidak diketahui';

  printReceipt(nama, kontak, metodeText);

  alert(`Terima kasih, ${nama}!\nPesanan Anda akan diproses.\nKontak: ${kontak}\nMetode Pembayaran: ${metodeText}`);

  lastNama = nama;
  lastKontak = kontak;
  lastMetode = metodeText;

document.getElementById('print-btn').style.display = 'inline-block';  
  cart.length = 0;
  updateCart();
}


function printReceipt(nama, kontak, metode) {
  const win = window.open('', 'Struk Pembelian', 'width=700,height=600');

  win.document.write(`
    <html>
      <head>
        <title>Struk Pembelian</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 30px;
            background: #f9f9f9;
            color: #333;
          }
          h2 {
            margin-top: 0;
            color: #2d3748;
          }
          .info {
            margin-bottom: 20px;
          }
          .info p {
            margin: 4px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #e2e8f0;
          }
          tfoot td {
            font-weight: bold;
            background-color: #edf2f7;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <h2>Grow Strong And Hard</h2>
        <div class="info">
          <p><strong>Nama:</strong> ${nama}</p>
          <p><strong>Kontak:</strong> ${kontak}</p>
          <p><strong>Metode Pembayaran:</strong> ${metode}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
  `);

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.qty * 100000;
    total += subtotal;
    win.document.write(`
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>Rp100.000</td>
        <td>Rp${subtotal.toLocaleString('id-ID')}</td>
      </tr>
    `);
  });

  win.document.write(`
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td>Rp${total.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>
        <div class="footer">
          Terima kasih telah berbelanja bersama kami! 🌿
        </div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
}


