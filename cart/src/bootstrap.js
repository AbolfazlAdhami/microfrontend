import faker from "faker";

const mount = (el) => {
  const cartText = `<div> You Have ${faker.random.number()} item in your cart</div>`;

  el.innerHTML = cartText;
};

if (process.env.NODE_ENV === "development") {
  const devCart = document.querySelector("#cart-dev");
  if (devCart) {
    mount(devCart);
  }
}

export { mount };
