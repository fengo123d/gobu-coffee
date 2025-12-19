// Pilihan grind (kasar/halus/sedang)
const grindButtons = document.querySelectorAll(".grind-btn");

grindButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        grindButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// Tombol beli
document.getElementById("buyNow").addEventListener("click", () => {
    window.location.href = "https://shopee.co.id/gobucoffee";
});
