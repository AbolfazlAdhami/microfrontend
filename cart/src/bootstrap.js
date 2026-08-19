import { faker } from "@faker-js/faker";

const mount = (el) => {
  let cartText = `<div> You Have ${faker.number.int({ min: 1, max: 10 })} item in your cart</div>`;

  el.innerHTML = cartText;
};

if (process.env.NODE_ENV === "development") {
  const devCart = document.querySelector("#cart-dev");
  if (devCart) {
    mount(devCart);
  }
}

export { mount };
