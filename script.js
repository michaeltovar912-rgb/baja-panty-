const bag = [];
const money = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const accountModal = document.querySelector("#account-modal");
const bagModal = document.querySelector("#bag-modal");
const checkoutModal = document.querySelector("#checkout-modal");
const toast = document.querySelector("#toast");



const officialProductImages = {
  "La Vie Est Belle": "https://www.lancome-usa.com/dw/image/v2/AAWR_PRD/on/demandware.static/-/Sites-lancome-master-catalog/default/dw8b4eebeb/images/PDP/LAN29/LAN29-product-LAVIEESTBELLEMAINPRODUCT-600x600.png?sw=600&sh=600&sm=fit&sfrm=png",
  "Dior Sauvage": "https://www.dior.com/on/demandware.static/-/Sites-master_dior/default/dw9507a7bb/Y0685240/Y0685240_F068524009_E01_GHC.jpg",
  "J’adore": "https://www.dior.com/on/demandware.static/-/Sites-master_dior/default/dwcbfbedd5/Y0996612/Y0996612_C099700102_E01_GHC.jpg",
  "Miss Dior": "https://www.dior.com/on/demandware.static/-/Sites-master_dior/default/dwe6c869ac/Y0000393/Y0000393_E000001557_E01_GHC.jpg",
  "212 VIP Rosé": "https://medias.carolinaherrera.com/medias/sys_master/images/h9f/h21/10969209896990/10969209831454/10969209831454.jpg",
  "212 NYC": "https://medias.carolinaherrera.com/medias/sys_master/images/h0e/he5/10969337823262/10969337757726/10969337757726.jpg",
  "212 VIP Men": "https://medias.carolinaherrera.com/medias/sys_master/images/hdc/ha3/10969359974430/10969359908894/10969359908894.jpg",
  Cloud: "https://arianagrandefragrances.com/cdn/shop/files/cloud_1024x1024.webp?v=1749775674",
  "Boss Bottled": "https://images.hugoboss.com/is/image/boss/hbna58000026_999_200?$social_sharing$",
  Nina: "https://cdn.shopify.com/s/files/1/0604/7409/7823/files/FLACON_EDT_FACE_80ml_1_519c1e26-645b-4252-b24d-59b4c988743f_01.jpg",
  Wanted: "https://res.cloudinary.com/azzaro-parfums/image/upload/products/60b88f0387c91_wanted-100ml-jpg.jpeg",
  Chloé: "https://www.chloe.com/on/demandware.static/-/Sites-chloe-master/default/dwb4efb05a/images/all-images/CHCA608500/2R-W6bb8Qf-1KJ_EAYXqqw_81d8f0e6.png",
  Daisy: "https://media.marcjacobs.com/match/Product_Style_Code/31655513027/NRF/000/Sequence/MAIN/",
  Scandal: "https://medias.jeanpaulgaultier.com/cdn-cgi/image/width=500,quality=90,format=avif/medias/sys_master/images/he6/heb/10428916662302/hero-banner-scandal-eau-de-parfum-jean-paul-gaultier/hero-banner-scandal-eau-de-parfum-jean-paul-gaultier.jpg",
  Eros: "https://www.versace.com/on/demandware.static/-/Sites-versace-master-catalog/default/dw2c2b0c2e/original/100_R740010_R100MLS_RNUL_Eros_EDT_100ml.jpg",
  "Y Eau de Parfum": "https://www.yslbeautyus.com/on/demandware.static/-/Sites-ysl-master-catalog/default/dw2700ccaa/Fragrance/YSL_Y/YSL_Y_REC_01_100ml_3614272050354.png",
  Gentleman: "https://www.givenchybeauty.com/dw/image/v2/BBKT_PRD/on/demandware.static/-/Sites-givenchy-master-catalog/default/dw164d3fd9/images/hpc_2020/00000118_2.jpg",
  "Terre d’Hermès": "https://assets.hermes.com/is/image/hermesproduct/V107189V0_1.jpg?fit=constrain,1&wid=500&hei=500",
  "Dylan Blue": "https://www.versace.com/on/demandware.static/-/Sites-versace-master-catalog/default/dw808ca0cb/original/90_Luxury_Fragrances_Dylan_Blue_Pour_Homme_EDT_100ML_SG_8005610266716_F9000.jpg",
  "L’Interdit": "https://www.givenchybeauty.com/on/demandware.static/-/Sites-masterCatalog_GIVENCHY/default/dw06339079/images/hg_large/P069002.png",
  "L’Homme Idéal": "https://www.guerlain.com/on/demandware.static/-/Sites-masterCatalog_GUERLAIN/default/dwae047112/images/homme-ideal-eau-de-toilette-3346470301863_01.jpg",
};

const officialProducts = [
  ...(window.menProducts || []),
  ...(window.womenProducts || []),
];

const productGrid = document.querySelector(".product-grid");
if (productGrid) {
  productGrid.innerHTML = officialProducts.map((product, index) => `
    <article class="product-card" data-gender="${product.gender}">
      <div class="product-art art-${(index % 6) + 1}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" title="${product.name}" data-catalog-image="true" />
      </div>
      <div class="product-details">
        <p class="product-gender">${product.gender === "mujer" ? "Mujer" : "Hombre"} · ${product.type}</p>
        <h3>${product.name}</h3>
        <p class="notes">${product.notes}</p>
        <div class="product-bottom">
          <strong>$${product.priceCOP.toLocaleString("es-CO")}</strong>
          <button class="add-button" data-product="${product.name}" data-price="${product.priceCOP}">Añadir <span>+</span></button>
        </div>
      </div>
    </article>
  `).join("");
}

async function loadRealProductImage(card) {
  const name = card.querySelector("h3")?.textContent.trim();
  const image = card.querySelector(".product-art img");
  if (!image || !name) return;

  const fallback = image.src;
  image.alt = name;
  image.title = name;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.src = fallback;
  }, { once: true });

  if (image.dataset.catalogImage === "true") return;
  if (name === "1 Million") return;

  try {
    if (officialProductImages[name]) {
      image.src = officialProductImages[name];
      image.dataset.source = "official";
      return;
    }

    const searches = [`${name} perfume bottle`, `${name} fragrance`, `${name} cologne`];
    let source;

    for (const search of searches) {
      const response = await fetch(
        `https://api.openverse.org/v1/images/?q=${encodeURIComponent(search)}&page_size=10`
      );
      if (!response.ok) throw new Error(`Openverse respondió ${response.status}`);
      const data = await response.json();
      const normalizedName = name.toLowerCase().replace(/[’']/g, "").split(" ");
      const match = data.results?.find((result) => {
        const text = `${result.title || ""} ${result.tags?.map((tag) => tag.name).join(" ") || ""}`.toLowerCase();
        return normalizedName.filter((word) => word.length > 2).some((word) => text.includes(word));
      }) || data.results?.[0];
      source = match?.thumbnail || match?.url;
      if (source) {
        image.dataset.source = "real";
        break;
      }
    }

    if (!source) throw new Error("No se encontró una imagen para esta loción");
    image.src = source;
  } catch (error) {
    console.warn(`No se pudo cargar la imagen real de ${name}.`, error);
    image.src = `https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85&fm=jpg&ixlib=rb-4.1.0&sig=${encodeURIComponent(name)}`;
  }

}

document.querySelectorAll(".product-card").forEach((card) => {
  loadRealProductImage(card);
});

function showModal(modal) {
  modal.hidden = false;
  modal.querySelector("input, button").focus();
}

function closeModals() {
  accountModal.hidden = true;
  bagModal.hidden = true;
  checkoutModal.hidden = true;
}

function renderBag() {
  const items = document.querySelector("#bag-items");
  const total = bag.reduce((sum, item) => sum + item.price, 0);
  document.querySelector("#bag-count").textContent = bag.length;
  document.querySelector("#bag-total").textContent = money(total);

  if (!bag.length) {
    items.innerHTML = '<p class="empty-bag">Tu bolsa está esperando una nueva fragancia.</p>';
    return;
  }

  items.innerHTML = bag
    .map(
      (item, index) => `
        <div class="bag-line">
          <div><strong>${item.name}</strong><small>1 unidad · Fragancia original</small></div>
          <div><strong>${money(item.price)}</strong><button type="button" data-remove="${index}">Eliminar</button></div>
        </div>`
    )
    .join("");
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

document.querySelector("#account-button").addEventListener("click", () => showModal(accountModal));
document.querySelector("#bag-button").addEventListener("click", () => {
  renderBag();
  showModal(bagModal);
});
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModals));
document.querySelectorAll(".modal-backdrop").forEach((backdrop) =>
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModals();
  })
);

document.querySelectorAll(".add-button").forEach((button) =>
  button.addEventListener("click", () => {
    bag.push({ name: button.dataset.product, price: Number(button.dataset.price) });
    renderBag();
    notify(`${button.dataset.product} se añadió a tu bolsa.`);
  })
);

document.querySelector("#bag-items").addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  bag.splice(Number(removeButton.dataset.remove), 1);
  renderBag();
});

document.querySelectorAll(".filter-tabs button, .category-card").forEach((control) =>
  control.addEventListener("click", (event) => {
    const filter = control.dataset.filter;
    if (!filter) return;
    if (control.matches("button")) {
      event.preventDefault();
      document.querySelectorAll(".filter-tabs button").forEach((button) => button.classList.toggle("active", button === control));
    }
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "todos" && card.dataset.gender !== filter);
    });
  })
);

document.querySelector("#account-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.hidden = true;
  document.querySelector("#account-success").hidden = false;
  notify("Tu cuenta Baja Panty está lista.");
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (!bag.length) {
    notify("Añade una fragancia antes de continuar.");
    return;
  }
  const checkoutItems = document.querySelector("#checkout-items");
  checkoutItems.innerHTML = bag.map((item) => `<div class="checkout-summary-line"><span>${item.name}</span><span>${money(item.price)}</span></div>`).join("");
  document.querySelector("#checkout-total").textContent = money(bag.reduce((sum, item) => sum + item.price, 0));
  bagModal.hidden = true;
  checkoutModal.hidden = false;
  checkoutModal.querySelector("input").focus();
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.hidden = true;
  document.querySelector("#checkout-success").hidden = false;
  notify("Tu pedido fue registrado correctamente.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector("input").value = "";
  document.querySelector("#newsletter-message").textContent = "¡Listo! Revisa tu correo para confirmar la suscripción.";
});

renderBag();
