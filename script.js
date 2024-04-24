async function fetchData() {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching data:", error);
  }
}

function displayCategoryMenu(categories) {
  const categoryMenuContainer = document.querySelector(".category-menu");
  categoryMenuContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const menuItem = document.createElement("span");
    menuItem.textContent = category.category_name;
    menuItem.addEventListener("click", () => {
      displayProducts(category.category_products);
      highlightActiveCategory(menuItem);
    });
    categoryMenuContainer.appendChild(menuItem);
  });
}

function displayProducts(products) {
  const productContainer = document.querySelector(".product-container");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("item");

    const imageElement = document.createElement("div");
    imageElement.classList.add("image");

    const imgElement = document.createElement("img");
    imgElement.src = product.image;
    imgElement.alt = product.title;

    imageElement.appendChild(imgElement);
    productElement.appendChild(imageElement);

    if (product.badge_text) {
      const badgeElement = document.createElement("span");
      badgeElement.classList.add("badge");
      badgeElement.textContent = product.badge_text;
      imageElement.appendChild(badgeElement);
    }

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");

    const titleElement = document.createElement("span");
    titleElement.classList.add("title");
    titleElement.textContent = product.title;

    const truncatedTitle =
      product.title.length > 11
        ? product.title.substring(0, 10) + "."
        : product.title;
    titleElement.textContent = truncatedTitle;

    descriptionElement.appendChild(titleElement);

    const symbolElement = document.createElement("span");
    symbolElement.classList.add("symbol");
    descriptionElement.appendChild(symbolElement);

    const vendorElement = document.createElement("span");
    vendorElement.textContent = product.vendor;
    descriptionElement.appendChild(vendorElement);

    productElement.appendChild(descriptionElement);

    const priceSection = document.createElement("div");
    priceSection.classList.add("price-section");

    const discountedPriceElement = document.createElement("span");
    discountedPriceElement.classList.add("discounted-price");
    discountedPriceElement.textContent = `RS ${product.price}.00`;
    priceSection.appendChild(discountedPriceElement);

    const originalPriceElement = document.createElement("span");
    originalPriceElement.classList.add("original-price");
    originalPriceElement.textContent = `${product.compare_at_price}.00`;
    priceSection.appendChild(originalPriceElement);

    const discountElement = document.createElement("span");
    discountElement.classList.add("discount");
    discountElement.textContent = `${calculateDiscount(
      product.price,
      product.compare_at_price
    )}% Off`;
    priceSection.appendChild(discountElement);

    productElement.appendChild(priceSection);

    const buttonElement = document.createElement("div");
    buttonElement.classList.add("button");

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Add to Cart";
    buttonElement.appendChild(addToCartButton);

    productElement.appendChild(buttonElement);

    productContainer.appendChild(productElement);
  });
}

function calculateDiscount(price, compareAtPrice) {
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount);
}

function highlightActiveCategory(activeMenuItem) {
  const menuItems = document.querySelectorAll(".category-menu span");
  menuItems.forEach((item) => {
    if (item === activeMenuItem) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function showLoader() {
  document.querySelector(".loader").style.display = "block";
  document.querySelector(".container").style.display = "none";
}

function hideLoader() {
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

async function main() {
  showLoader();
  const data = await fetchData();
  const categories = data.categories;
  displayCategoryMenu(categories);

  const menCategory = categories.find(
    (category) => category.category_name === "Men"
  );
  const menMenuItem = document.querySelector(
    `.category-menu span:nth-child(${categories.indexOf(menCategory) + 1})`
  );

  highlightActiveCategory(menMenuItem);
  displayProducts(menCategory.category_products);
  hideLoader();
}

main();
