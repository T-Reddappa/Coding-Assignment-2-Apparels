document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  categoryButtons.forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      const category = tabLink.dataset.category;

      categoryButtons.forEach((link) => link.classList.remove("active"));
      tabLink.classList.add("active");

      tabContents.forEach((content) => {
        if (content.id === category) {
          content.classList.add("active");
          fetchProductData(category);
        } else {
          content.classList.remove("active");
        }
      });

      //coditionally rendering the svg icon
      categoryButtons.forEach((link) => {
        const svg = link.querySelector("svg");
        if (link.classList.contains("active")) {
          svg.setAttribute("display", "inline");
        } else {
          svg.setAttribute("display", "none");
        }
      });
    });
  });
  function fetchProductData(category) {
    fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const categoryData = data.categories.find(
          (cat) => cat.category_name.toLowerCase() === category.toLowerCase()
        );
        if (categoryData) {
          const products = categoryData.category_products;
          const container = document.getElementById(category);
          container.innerHTML = ""; // Clear previous products

          products.forEach((product) => {
            const card = createProductCard(product);
            container.appendChild(card);
          });
        } else {
          console.error("Category not found:", category);
        }
      })
      .catch((error) => console.error("Error fetching product data:", error));
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.textContent = product.badge_text;
    product.badge_text && card.appendChild(badge);

    const image = document.createElement("img");
    image.classList.add("product-image");
    image.src = product.image;
    image.alt = product.title;
    card.appendChild(image);

    const info = document.createElement("div");
    info.classList.add("product-info");
    card.appendChild(info);

    const title = document.createElement("h3");
    title.textContent = product.title;
    title.classList.add("product-title");
    info.appendChild(title);

    const dot = document.createElement("div");
    dot.classList.add("icon");
    info.appendChild(dot);

    const vendor = document.createElement("p");
    vendor.textContent = product.vendor;
    info.appendChild(vendor);

    const priceInfo = document.createElement("div");
    priceInfo.classList.add("price-info");
    card.appendChild(priceInfo);

    const price = document.createElement("p");
    price.textContent = "Rs." + product.price;
    price.classList.add("product-price");
    priceInfo.appendChild(price);

    const comparePrice = document.createElement("p");
    comparePrice.classList.add("compare-price");
    comparePrice.textContent = product.compare_at_price;
    priceInfo.appendChild(comparePrice);

    const discount = document.createElement("p");
    discount.classList.add("price-discount");
    const discountPercent = Math.round(
      (1 - product.price / product.compare_at_price) * 100
    );
    discount.textContent = discountPercent + "% off";
    priceInfo.appendChild(discount);

    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.classList.add("add-to-cart-btn");
    card.appendChild(addToCartBtn);

    return card;
  }
});
