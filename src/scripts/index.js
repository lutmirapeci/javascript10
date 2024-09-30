const products = [
  {
    title: "Phones",
    image: "https://image.freepik.com/free-psd/smartphone-pro-max-mockup_165789-171.jpg",
    list: [
      {
        product_name: "Iphone X",
        image_path:
          "https://image.freepik.com/free-vector/iphone-x-with-white-screen-realistic-style_23-2147857039.jpg",
        price: 420,
      },
      {
        product_name: "Iphone 11",
        image_path:
          "https://image.freepik.com/free-vector/realistic-iphone-11-with-black-back-cover_23-2148385252.jpg",
        price: 500,
      },
      {
        product_name: "Iphone 12 pro max",
        image_path:
          "https://image.freepik.com/free-photo/rome-italy-february-04-2021-iphone-12-pro-gold-with-white-earphone_241278-152.jpg",
        price: 2000,
      },
    ],
  },
  {
    title: "Accessories",
    image:
      "https://image.freepik.com/free-vector/set-smartphone-accessories-it-phone-with-case-charger-headphones-protective-glass-cover-other-things-smartphone-flat-cartoon-style_212168-54.jpg",
    list: [
      {
        product_name: "Selfie Sticks",
        image_path:
          "https://image.freepik.com/free-vector/selfie-stick-smartphone-with-blank-screen_274258-359.jpg",
        price: 100,
      },
      {
        product_name: "Headphones",
        image_path:
          "https://image.freepik.com/free-vector/realistic-vector-headphones-with-sound-wave-isolated_53562-9804.jpg",
        price: 40,
      },
      {
        product_name: "Bluetooth Earbuds",
        image_path:
          "https://as2.ftcdn.net/v2/jpg/03/43/71/39/1000_F_343713977_RxPzoKiawgTGMl7dxe4w9Eich7YZ36fK.jpg",
        price: 100,
      },
      {
        product_name: "Camera Lens Attachments",
        image_path:
          "https://as1.ftcdn.net/v2/jpg/02/62/07/22/1000_F_262072293_4KerCg22vtHBzS38cjuuhSItZi1BdxJX.jpg",
        price: 500,
      },
    ],
  },
  {
    title: "CoverPhones",
    image: "https://image.freepik.com/free-psd/smartphone-cover-case-mockup_358694-161.jpg",
    list: [
      {
        product_name: "Basic Cases",
        image_path: "https://image.freepik.com/free-vector/cases-mobile-mockup_1017-7631.jpg",
        price: 100,
      },
      {
        product_name: "Flip Cases",
        image_path:
          "https://image.freepik.com/free-psd/awesome-beautiful-phone-case-mockup_165789-393.jpg",
        price: 150,
      },
      {
        product_name: "Bumpers",
        image_path:
          "https://image.freepik.com/free-psd/smartphone-cover-case-mockup_358694-180.jpg",
        price: 230,
      },
    ],
  },
];

// State Management
const createState = () => {
  const state = {};
  products.forEach((product) => {
    state[product.title] = product.list.reduce((acc, item) => {
      acc[item.product_name] = 0;
      return acc;
    }, {});
  });
  return state;
};

const state = createState();

const updateState = (productTitle, itemName, quantity) => {
  state[productTitle][itemName] += Number(quantity);
};

// Reference Utility
const REFERENCE = {
  getContent: () => document.querySelector(".content"),
  getModal: () => document.getElementById("myModal"),
  getModalContent: () => document.querySelector(".modal-content"),
};

// Render Methods
const renderContent = () => {
  const content = document.createElement("section");
  content.className = "content";
  document.body.appendChild(content);
};

const renderPurchaseButton = () => {
  const button = document.createElement("button");
  button.id = "purchase_button";
  button.innerHTML = "Buy Products";
  button.onclick = () => {
    REFERENCE.getModal().style.display = "block";
    renderProductsTable();
  };
  REFERENCE.getContent().appendChild(button);
};

const renderProducts = () => {
  const container = document.createElement("section");
  container.className = "categories";

  products.forEach((product) => {
    const column = document.createElement("div");
    column.className = "category";

    const title = document.createElement("p");
    title.innerHTML = product.title;

    const image = document.createElement("img");
    image.src = product.image;

    const productSelect = document.createElement("select");
    const quantitySelect = createQuantitySelect();

    productSelect.onchange = (e) => {
      const selectedItem = product.list.find((el) => el.product_name === e.target.value);
      image.src = selectedItem.image_path;
    };

    product.list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.product_name;
      option.innerHTML = item.product_name;
      productSelect.appendChild(option);
    });

    const addToCartButton = createAddToCartButton(product, productSelect, quantitySelect);

    column.appendChild(title);
    column.appendChild(image);
    column.appendChild(productSelect);
    column.appendChild(quantitySelect);
    column.appendChild(addToCartButton);
    container.appendChild(column);
  });

  REFERENCE.getContent().appendChild(container);
};

const createQuantitySelect = () => {
  const select = document.createElement("select");
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    select.appendChild(option);
  }
  return select;
};

const createAddToCartButton = (product, productSelect, quantitySelect) => {
  const button = document.createElement("button");
  button.className = "product_cart_button";
  button.innerHTML = "Add to cart";
  button.onclick = () => {
    const selectedItem = productSelect.value;
    const selectedQuantity = quantitySelect.value;
    updateState(product.title, selectedItem, selectedQuantity);
  };
  return button;
};

const renderProductsTable = () => {
  const table = document.createElement("table");
  table.className = "table-report";

  const atLeastOneItem = products.some((product) => {
    return product.list.some((item) => state[product.title][item.product_name] > 0);
  });

  atLeastOneItem ? createTableContent(table) : createEmptyCart(table);
  REFERENCE.getModalContent().appendChild(table);
};

const createEmptyCart = (table) => {
  const noItems = document.createElement("p");
  noItems.innerHTML = "No items in the cart!";
  table.appendChild(noItems);
};

const createTableContent = (table) => {
  const columns = ["Product", "Category", "Quantity", "Total"];

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.innerHTML = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  products.forEach((product) => {
    product.list.forEach((item) => {
      const quantity = state[product.title][item.product_name];
      if (quantity > 0) {
        const row = document.createElement("tr");

        const productCell = document.createElement("td");
        productCell.innerHTML = item.product_name;

        const categoryCell = document.createElement("td");
        categoryCell.innerHTML = product.title;

        const quantityCell = document.createElement("td");
        quantityCell.innerHTML = quantity;

        const totalCell = document.createElement("td");
        totalCell.innerHTML = quantity * item.price;

        row.appendChild(productCell);
        row.appendChild(categoryCell);
        row.appendChild(quantityCell);
        row.appendChild(totalCell);

        tbody.appendChild(row);
      }
    });
  });
  table.appendChild(tbody);
};

// DOM Object to Manage Render Functions
const DOM = {
  renderContent,
  renderProducts,
  renderPurchaseButton,
  renderProductsTable,
};

// On Load
window.onload = () => {
  DOM.renderContent();
  DOM.renderProducts();
  DOM.renderPurchaseButton();
};

// Close Modal on Outside Click
window.onclick = (event) => {
  const modal = REFERENCE.getModal();
  if (event.target === modal) {
    modal.style.display = "none";
    REFERENCE.getModalContent().innerHTML = "";
  }
};
