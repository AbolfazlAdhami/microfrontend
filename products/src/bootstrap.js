import { faker } from "@faker-js/faker";

const mount = (el) => {
  let products = ``;

  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.productName();
    products += `<div>${name}</div>`;
  }

  el.innerHTML = products;
};

if (process.env.NODE_ENV === "development") {
  const devCart = document.querySelector("#dev-products");
  if (devCart) {
    mount(devCart);
  }
}

export { mount };
