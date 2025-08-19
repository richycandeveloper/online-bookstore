/* public/script.js
   Works with:
   - GET    /api/books
   - GET    /api/books/:id
   - POST   /api/admin/add
   - GET    /api/cart/:userId
   - POST   /api/cart
   - DELETE /api/cart/:id
*/

// --------- Helpers ----------
const API = {
  books: "/api/books",
  adminAdd: "/api/admin/add",
  cart: "/api/cart",
};
const DEMO_USER_ID = 1; // matches the schema you created

function $(sel, parent = document) {
  return parent.querySelector(sel);
}
function $all(sel, parent = document) {
  return [...parent.querySelectorAll(sel)];
}
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function money(n) {
  return Number(n).toFixed(2);
}

// Detect page by presence of elements
document.addEventListener("DOMContentLoaded", () => {
  if ($("#book-list")) initHome();
  if ($("#cart-items")) initCart();
  if ($("#add-book-form")) initAdmin();
});

// --------- HOME (index.html) ----------
async function initHome() {
  const grid = $("#book-list");

  try {
    const books = await fetchJSON(API.books);
    if (!books.length) {
      grid.innerHTML = `<p style="opacity:.7">No books yet. Ask admin to add some.</p>`;
      return;
    }

    grid.innerHTML = books
      .map(
        (b) => `
      <div class="book">
        <img src="${b.image_url || "https://via.placeholder.com/400x600?text=No+Image"}" alt="${escapeHtml(
          b.title
        )}">
        <h3>${escapeHtml(b.title)}</h3>
        <p>by ${escapeHtml(b.author)}</p>
        <p><strong>$${money(b.price)}</strong></p>
        <button class="add-btn" data-id="${b.id}">Add to Cart</button>
      </div>`
      )
      .join("");

    grid.addEventListener("click", async (e) => {
      const btn = e.target.closest(".add-btn");
      if (!btn) return;
      const bookId = Number(btn.dataset.id);
      btn.disabled = true;
      const original = btn.textContent;
      try {
        await fetchJSON(API.cart, {
          method: "POST",
          body: JSON.stringify({ userId: DEMO_USER_ID, bookId, quantity: 1 }),
        });
        btn.textContent = "Added ✅";
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 900);
      } catch (err) {
        alert("Failed to add to cart: " + err.message);
        btn.disabled = false;
      }
    });
  } catch (err) {
    grid.innerHTML = `<p style="color:#b00020">Error loading books: ${err.message}</p>`;
  }
}

// --------- CART (cart.html) ----------
async function initCart() {
  const container = $("#cart-items");
  const checkoutBtn = $("#checkout-btn");

  async function loadCart() {
    container.innerHTML = `<p>Loading…</p>`;
    try {
      const items = await fetchJSON(`${API.cart}/${DEMO_USER_ID}`);
      if (!items.length) {
        container.innerHTML = `<p style="opacity:.7">Your cart is empty.</p>`;
        if (checkoutBtn) checkoutBtn.style.display = "none";
        return;
      }
      if (checkoutBtn) checkoutBtn.style.display = "inline-block";

      let total = 0;
      container.innerHTML = items
        .map((it) => {
          const subtotal = Number(it.price) * Number(it.quantity || 1);
          total += subtotal;
          return `
          <div class="book" style="text-align:left">
            <h3 style="margin-bottom:6px">${escapeHtml(it.title)}</h3>
            <p style="margin-bottom:6px">by ${escapeHtml(it.author)}</p>
            <p style="margin-bottom:10px">$${money(it.price)} × ${it.quantity || 1} = <strong>$${money(
            subtotal
          )}</strong></p>
            <div style="display:flex; gap:10px">
              <button class="remove-btn" data-id="${it.id}">Remove</button>
            </div>
          </div>
        `;
        })
        .join("");

      const summary = document.createElement("div");
      summary.className = "book";
      summary.innerHTML = `<h3>Cart Total: $${money(total)}</h3>`;
      container.appendChild(summary);
    } catch (err) {
      container.innerHTML = `<p style="color:#b00020">Error loading cart: ${err.message}</p>`;
    }
  }

  container.addEventListener("click", async (e) => {
    const removeBtn = e.target.closest(".remove-btn");
    if (!removeBtn) return;
    const id = Number(removeBtn.dataset.id);
    removeBtn.disabled = true;
    try {
      await fetchJSON(`${API.cart}/${id}`, { method: "DELETE" });
      await loadCart();
    } catch (err) {
      alert("Failed to remove: " + err.message);
      removeBtn.disabled = false;
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert(
        "Checkout is a demo. Integrate a payment gateway (e.g., Stripe/Paystack) and create orders table later."
      );
    });
  }

  loadCart();
}

// --------- ADMIN (admin.html) ----------
function initAdmin() {
  const form = $("#add-book-form");
  const msg = $("#admin-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const payload = {
      title: $("#title").value.trim(),
      author: $("#author").value.trim(),
      price: parseFloat($("#price").value || "0"),
      image_url: $("#image").value.trim(),
      description: "", // optional
    };

    if (!payload.title || !payload.author || !payload.price) {
      msg.style.color = "#b00020";
      msg.textContent = "Please fill in title, author, and price.";
      return;
    }

    try {
      await fetchJSON(API.adminAdd, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      msg.style.color = "green";
      msg.textContent = "Book added successfully! ✅";
      form.reset();
    } catch (err) {
      msg.style.color = "#b00020";
      msg.textContent = "Failed to add book: " + err.message;
    }
  });
}

// --------- Security: simple HTML escaper for text nodes ----------
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

