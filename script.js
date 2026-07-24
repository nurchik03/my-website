// script.js
(function () {
  const products = [
    {
      id: 1,
      name: "Пельмени",
      category: "polufabrikaty",
      price: 350,
      description: "Домашние пельмени с сочной начинкой",
      composition: "говядина, свинина, лук, тесто",
      img: "🥟",
    },
    {
      id: 2,
      name: "Манты",
      category: "polufabrikaty",
      price: 420,
      description: "Классические манты с тыквой и мясом",
      composition: "баранина, тыква, лук, тесто",
      img: "🥟",
    },
    {
      id: 3,
      name: "Вареники",
      category: "polufabrikaty",
      price: 280,
      description: "Вареники с картофелем и луком",
      composition: "картофель, лук, тесто, специи",
      img: "🥟",
    },
    {
      id: 4,
      name: "Котлеты",
      category: "polufabrikaty",
      price: 390,
      description: "Нежные котлеты из куриного филе",
      composition: "курица, лук, яйцо, панировка",
      img: "🍔",
    },
    {
      id: 5,
      name: "Фрикадельки",
      category: "polufabrikaty",
      price: 310,
      description: "Маленькие фрикадельки для супа",
      composition: "свинина, рис, лук, специи",
      img: "🍡",
    },
    {
      id: 6,
      name: "Тефтели",
      category: "polufabrikaty",
      price: 340,
      description: "Тефтели в томатном соусе",
      composition: "говядина, рис, лук, томат",
      img: "🍲",
    },
    {
      id: 7,
      name: "Самса",
      category: "polufabrikaty",
      price: 250,
      description: "Самса с бараниной и луком",
      composition: "баранина, лук, слоеное тесто",
      img: "🥐",
    },
    {
      id: 8,
      name: "Каттама",
      category: "polufabrikaty",
      price: 220,
      description: "Сладкая каттама с начинкой",
      composition: "мука, масло, сахар, орехи",
      img: "🥮",
    },
    {
      id: 9,
      name: "Медовик",
      category: "torty",
      price: 1200,
      description: "Нежный торт со сметанным кремом",
      composition: "мед, сметана, мука, масло",
      img: "🍰",
    },
    {
      id: 10,
      name: "Красный бархат",
      category: "torty",
      price: 1400,
      description: "Бархатный бисквит с крем-чизом",
      composition: "какао, творожный сыр, сливки",
      img: "🍰",
    },
    {
      id: 11,
      name: "Наполеон",
      category: "torty",
      price: 1300,
      description: "Хрустящий Наполеон с заварным кремом",
      composition: "слоеное тесто, заварной крем",
      img: "🍰",
    },
    {
      id: 12,
      name: "Шоколадный",
      category: "torty",
      price: 1500,
      description: "Шоколадный торт с ганашем",
      composition: "темный шоколад, сливки, какао",
      img: "🍫",
    },
    {
      id: 13,
      name: "Чизкейк",
      category: "torty",
      price: 1100,
      description: "Классический чизкейк с ягодами",
      composition: "сливочный сыр, печенье, ягоды",
      img: "🧀",
    },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentCategory = "all";
  let searchQuery = "";

  const productGrid = document.getElementById("productGrid");
  const cartCountSpan = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotalPrice = document.getElementById("cartTotalPrice");
  const cartTotalItems = document.getElementById("cartTotalItems");
  const cartToggle = document.getElementById("cartToggle");
  const cartModalClose = document.getElementById("cartModalClose");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mainNav = document.getElementById("mainNav");

  // Toast элементы
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.getElementById("toastClose");
  let toastTimer = null;

  // Футер категории
  const footerCategoryLinks = document.querySelectorAll(
    ".footer__links-column a[data-category]",
  );
  footerCategoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.dataset.category;
      const targetBtn = document.querySelector(
        `.category-btn[data-category="${category}"]`,
      );
      if (targetBtn) {
        targetBtn.click();
        document
          .querySelector("#catalog")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  function showToast(productName) {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    toastMessage.textContent = productName;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toastTimer = null;
    }, 2000);
  }

  toastClose.addEventListener("click", function () {
    toast.classList.remove("show");
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
  });

  toast.addEventListener("click", function (e) {
    if (e.target === toast) {
      toast.classList.remove("show");
      if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }
    }
  });

  function renderProducts() {
    const filtered = products.filter((p) => {
      const matchCategory =
        currentCategory === "all" || p.category === currentCategory;
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      productGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color: var(--gray-600);">
                    <div style="font-size:3rem; margin-bottom:12px;">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить запрос или выберите другую категорию</p>
                </div>
            `;
      return;
    }

    productGrid.innerHTML = filtered
      .map(
        (p) => `
            <div class="product-card" data-id="${p.id}">
                <div class="product-image">${p.img}</div>
                <span class="category-tag">${p.category === "polufabrikaty" ? "Полуфабрикат" : "Торт"}</span>
                <h3>${p.name}</h3>
                <div class="price">${p.price} сом</div>
                <div class="description">${p.description}</div>
                <div class="composition">${p.composition}</div>
                <button class="btn add-to-cart" data-id="${p.id}">Добавить в корзину</button>
            </div>
        `,
      )
      .join("");

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        const product = products.find((p) => p.id === id);
        addToCart(id);
        showToast(product.name);
      });
    });
  }

  function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      const product = products.find((p) => p.id === id);
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    animateCartCount();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartUI();
    renderCartModal();
  }

  function changeQuantity(id, delta) {
    const item = cart.find((el) => el.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
    updateCartUI();
    renderCartModal();
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
    cartCountSpan.textContent = totalItems;
    if (cartModal.classList.contains("open")) {
      renderCartModal();
    }
  }

  function animateCartCount() {
    cartCountSpan.style.transform = "scale(1.5)";
    setTimeout(() => (cartCountSpan.style.transform = "scale(1)"), 250);
  }

  function renderCartModal() {
    if (!cartItemsDiv) return;
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
                <div style="text-align:center; padding:30px 0; color: var(--gray-600);">
                    <div style="font-size:3rem; margin-bottom:8px;">🛒</div>
                    <p>Корзина пуста</p>
                </div>
            `;
      cartTotalPrice.textContent = "0 сом";
      cartTotalItems.textContent = "0";
      return;
    }

    let html = "";
    let total = 0;
    let totalQty = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalQty += item.quantity;
      html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} сом</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-decr" data-id="${item.id}">−</button>
                        <span>${item.quantity}</span>
                        <button class="cart-incr" data-id="${item.id}">+</button>
                        <button class="cart-remove" data-id="${item.id}">✕</button>
                    </div>
                </div>
            `;
    });

    cartItemsDiv.innerHTML = html;
    cartTotalPrice.textContent = total + " сом";
    cartTotalItems.textContent = totalQty;

    document.querySelectorAll(".cart-incr").forEach((btn) => {
      btn.addEventListener("click", function () {
        changeQuantity(parseInt(this.dataset.id), 1);
      });
    });
    document.querySelectorAll(".cart-decr").forEach((btn) => {
      btn.addEventListener("click", function () {
        changeQuantity(parseInt(this.dataset.id), -1);
      });
    });
    document.querySelectorAll(".cart-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        removeFromCart(parseInt(this.dataset.id));
      });
    });
  }

  function openCartModal() {
    renderCartModal();
    cartModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCartModal() {
    cartModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function sendWhatsApp() {
    if (cart.length === 0) {
      alert("Корзина пуста. Добавьте товары.");
      return;
    }
    const phone = "996XXXXXXXXX";
    let message = "Здравствуйте!%0AХочу оформить заказ.%0A%0AМой заказ:%0A";
    let total = 0;
    cart.forEach((item, index) => {
      const sum = item.price * item.quantity;
      total += sum;
      message += `${index + 1}. ${item.name}%0AКоличество: ${item.quantity}%0AЦена: ${sum} сом%0A%0A`;
    });
    message += `----------------------%0AИтого: ${total} сом%0A%0AСпасибо!`;

    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  }

  function filterByCategory(category) {
    currentCategory = category;
    categoryBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });
    renderProducts();
  }

  function handleSearch() {
    searchQuery = searchInput.value.trim();
    renderProducts();
  }

  function init() {
    renderProducts();
    updateCartUI();

    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterByCategory(this.dataset.category);
      });
    });

    searchInput.addEventListener("input", handleSearch);
    searchBtn.addEventListener("click", handleSearch);

    cartToggle.addEventListener("click", function (e) {
      e.preventDefault();
      openCartModal();
    });

    cartModalClose.addEventListener("click", closeCartModal);
    cartModal.addEventListener("click", function (e) {
      if (e.target === this) closeCartModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCartModal();
    });

    checkoutBtn.addEventListener("click", sendWhatsApp);

    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      mainNav.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        mainNav.classList.remove("open");
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      });
    });

    renderCartModal();
  }

  init();
})();
