// =========================================
// 1. BAGIAN LOGIKA KERANJANG & CHECKOUT
// =========================================

// --- CEK DATA & TAMPILKAN POPUP KONFIRMASI ---
function handleCheckout() {
    const nama = document.getElementById('nama').value;
    const nohp = document.getElementById('nohp').value;
    const alamat = document.getElementById('alamat').value;
    const paymentOption = document.querySelector('input[name="payment_method"]:checked');
    
    if (nama === "" || nohp === "" || alamat === "") {
        alert("Mohon lengkapi Nama, No HP, dan Alamat Anda.");
        return;
    }
    if (!paymentOption) {
        alert("Mohon pilih metode pembayaran.");
        return;
    }

    const savedCart = localStorage.getItem('gobuCart');
    let rincianProduk = "";
    let grandTotal = 0;

    if (savedCart) {
        const cartArray = JSON.parse(savedCart);
        cartArray.forEach((item, index) => {
            grandTotal += item.subTotal;
            rincianProduk += `${index + 1}. ${item.name} (${item.grind})\n    Qty: ${item.qty} x Rp ${item.price.toLocaleString('id-ID')}\n`;
        });
    }

    const confirmMessage = 
`KONFIRMASI PESANAN
------------------------------------------------
DATA PENERIMA:
Nama   : ${nama}
No. HP : ${nohp}
Alamat : ${alamat}

METODE PEMBAYARAN:
${paymentOption.value.toUpperCase()}

RINCIAN PRODUK:
${rincianProduk}
------------------------------------------------
TOTAL BAYAR: Rp ${grandTotal.toLocaleString('id-ID')}
------------------------------------------------
Sudah benar?`;

    if (confirm(confirmMessage)) {
        clearCart();
    }
}

// --- COUNTER PRODUK ---
function changeQty100(qty100Id, change, price, total100Id) {
    let qtyElement = document.getElementById(qty100Id);
    let totalElement = document.getElementById(total100Id);
    
    let qty1 = parseInt(qtyElement.innerText);
    qty1 += change;
    if (qty1 < 0) qty1 = 0; 
    
    qtyElement.innerText = qty1;
    totalElement.innerText = (qty1 * price).toLocaleString("id-ID");
}

function changeQty250(qty250Id, change, price, total250Id) {
    let qtyElement = document.getElementById(qty250Id);
    let totalElement = document.getElementById(total250Id);
    
    let qty2 = parseInt(qtyElement.innerText);
    qty2 += change;
    if (qty2 < 0) qty2 = 0; 
    
    qtyElement.innerText = qty2;
    totalElement.innerText = (qty2 * price).toLocaleString("id-ID");
}

// --- TAMBAH KE KERANJANG ---
function addToCart(productName, qtyId, price, grindGroupId) {
    const qtyElement = document.getElementById(qtyId);
    const qty = parseInt(qtyElement.innerText);
    
    if (qty <= 0) {
        alert("Isi jumlah dulu sebelum beli ya!");
        return; 
    }

    const grindContainer = document.querySelector(grindGroupId);
    let selectedGrind = "KASAR";
    if (grindContainer) {
        const activeBtn = grindContainer.querySelector('.grind-btn.active');
        if (activeBtn) selectedGrind = activeBtn.innerText;
    }

    const subTotal = qty * price;
    const newItem = {
        name: productName,
        qty: qty,
        grind: selectedGrind,
        price: price,
        subTotal: subTotal
    };

    let currentCart = localStorage.getItem('gobuCart');
    let cartArray = currentCart ? JSON.parse(currentCart) : [];
    cartArray.push(newItem);
    
    localStorage.setItem('gobuCart', JSON.stringify(cartArray));

    if (confirm(`✔ ${qty}x ${productName} (${selectedGrind}) masuk ke keranjang.\n\nOK = Checkout sekarang\nCancel = Belanja lagi`)) {
        window.location.href = 'payment.html';
    } else {
        qtyElement.innerText = "0"; 
        let totalId = qtyId === 'qty100' ? 'total100' : qtyId === 'qty250' ? 'total250' : "";
        if (totalId) document.getElementById(totalId).innerText = "0";
    }
}

// --- BERSIHKAN KERANJANG ---
function clearCart() {
    alert('Terima kasih! Pesananmu sudah kami terima.');
    localStorage.removeItem('gobuCart'); 
    window.location.href = 'page1.html'; 
}


// =========================================
// 2. MAIN LOGIC (SAAT HALAMAN LOAD)
// =========================================
document.addEventListener('DOMContentLoaded', function() {

    // A. Animasi Loading Halaman (Body Fade In)
    setTimeout(() => document.body.classList.add('loaded'), 10);

    // B. Logika Halaman Pembayaran (Payment Page)
    if (window.location.pathname.includes('payment.html')) {
        const savedCart = localStorage.getItem('gobuCart');
        const container = document.getElementById('order-summary');
        const grandTotalElement = document.getElementById('grand-total');

        const inputHP = document.getElementById('nohp');
        if (inputHP) {
            inputHP.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }

        if (savedCart) {
            const cartArray = JSON.parse(savedCart);
            let grandTotal = 0;
            container.innerHTML = ""; 

            cartArray.forEach((item) => {
                grandTotal += item.subTotal;
                container.innerHTML += `
                    <div class="item-row">
                        <div class="item-info">
                            <span class="item-name">${item.name}</span>
                            <div style="display:flex; gap:10px;">
                                <span class="item-detail">Qty: ${item.qty}</span>
                                <span class="item-detail">| ${item.grind}</span>
                            </div>
                        </div>
                        <span class="item-price">Rp ${item.subTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #ccc; margin-bottom: 20px;">
                `;
            });

            grandTotalElement.innerText = "Rp " + grandTotal.toLocaleString('id-ID');
        } else {
            container.innerHTML = "<p>Keranjang kosong.</p>";
            grandTotalElement.innerText = "Rp 0";
        }

        const btnPesan = document.querySelector('.btn-pesan');
        if (btnPesan) btnPesan.onclick = handleCheckout;
    }

    // C. Transisi Navbar (Pindah Halaman Smooth)
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            if (!targetUrl) return;

            e.preventDefault(); 
            document.querySelector('.navbar a.active')?.classList.replace('active', 'tes');
            this.classList.replace('tes', 'active');

            document.body.classList.remove('loaded');
            setTimeout(() => window.location.href = targetUrl, 500);
        });
    });

    // D. Tombol Pilihan Grind (Kasar/Halus)
    document.querySelectorAll('.grind-options, .grind-options2').forEach(group => {
        group.querySelectorAll('.grind-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                group.querySelectorAll('.grind-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    // E. Tombol Beli (Page Produk)
    const btnBuyAtas = document.querySelector('.product-section-100g .buy-btn');
    if (btnBuyAtas) {
        btnBuyAtas.onclick = () => {
            addToCart('GOBU Robusta 100G', 'qty100', 12000, '.product-section-100g .grind-options');
        };
    }

    const btnBuyBawah = document.querySelector('.product-section-250g .buy-btn');
    if (btnBuyBawah) {
        btnBuyBawah.onclick = () => {
            addToCart('GOBU Robusta 250G', 'qty250', 21000, '.product-section-250g .grind-options2');
        };
    }

    // =========================================
    // 3. ANIMASI SCROLL (Replay Logic)
    // =========================================
    
    const observerOptions = {
        root: null,
        threshold: 0.3 // Mulai saat 30% elemen terlihat
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Masuk layar -> Mainkan Animasi
                entry.target.classList.add("active");
            } else {
                // Keluar layar -> Reset Animasi (Biar bisa main lagi)
                entry.target.classList.remove("active");
            }
        });
    }, observerOptions);

    // Cari elemen yg punya class 'fade-up' atau 'rotate-enter'
    const animatedElements = document.querySelectorAll('.fade-up, .rotate-enter');
    animatedElements.forEach(el => observer.observe(el));

});