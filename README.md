# Microfrontend

A small, practical **Webpack 5 Module Federation** example that demonstrates how a host application can compose independently developed and served frontend applications at runtime.

## Architecture

The repository contains three applications:

```text
microfrontend/
├── container/   # Host / shell application
├── products/    # Products microfrontend
└── cart/        # Cart microfrontend
```

The `container` application acts as the host. It loads the `products` and `cart` remotes through Webpack Module Federation.

```text
                    ┌─────────────────────┐
                    │      Container      │
                    │    Host / Shell     │
                    │      :8080           │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐        ┌──────────────────┐
       │     Products     │        │       Cart       │
       │  Remote :8081    │        │   Remote :8082   │
       │                  │        │                  │
       │ ProductsIndex    │        │ CartShow         │
       └──────────────────┘        └──────────────────┘
```

The host is configured with:

- `products@http://localhost:8081/remoteEntry.js`
- `cart@http://localhost:8082/remoteEntry.js`

The remote applications expose their own entry modules through `remoteEntry.js`.

## Technologies

- JavaScript
- Webpack 5
- Webpack Module Federation
- webpack-dev-server
- html-webpack-plugin
- Faker.js for mock product/cart data

The current project uses Webpack `5.109.2`, Webpack CLI `7.2.2`, and webpack-dev-server `6.x`. The products and cart applications also use `@faker-js/faker` for generated demo data.

## Applications

### Container

The host application runs on:

```text
http://localhost:8080
```

Its Module Federation configuration registers the two remotes:

```js
remotes: {
  products: "products@http://localhost:8081/remoteEntry.js",
  cart: "cart@http://localhost:8082/remoteEntry.js",
}
```

The container is responsible for composing the microfrontends into a single user-facing application.

### Products

The products microfrontend runs on:

```text
http://localhost:8081
```

It exposes:

```text
./ProductsIndex
```

which maps to:

```text
./src/bootstrap
```

The exported `mount` function generates five mock product names with Faker and renders them into a supplied DOM element.

### Cart

The cart microfrontend runs on:

```text
http://localhost:8082
```

It exposes:

```text
./CartShow
```

which maps to:

```text
./src/bootstrap
```

The exported `mount` function generates a mock cart quantity and renders it into a supplied DOM element.

## How Module Federation Works Here

Each remote application is independently bundled and served.

The remote applications create a `remoteEntry.js` file containing their exposed modules. The container does not bundle the implementation of those modules directly; instead, it resolves and loads them from the remote applications at runtime.

Conceptually:

```text
Build time
──────────

Products ──► products/remoteEntry.js
Cart     ──► cart/remoteEntry.js
Container ──► knows where the remotes are located


Runtime
───────

Browser
   │
   ├──► Container :8080
   │
   ├──► Products :8081/remoteEntry.js
   │
   └──► Cart :8082/remoteEntry.js
```

This is the core idea demonstrated by this repository: separate frontend builds can be composed into one application without requiring everything to be built as a single bundle.

## Getting Started

### Prerequisites

Install:

- Node.js
- npm

Check your environment:

```bash
node --version
npm --version
```

### Install dependencies

Each application has its own `package.json`, so install dependencies separately.

```bash
cd container
npm install

cd ../products
npm install

cd ../cart
npm install
```

### Run the microfrontends

Start each application in a separate terminal.

#### Terminal 1 — Container

```bash
cd container
npm start
```

Runs on:

```text
http://localhost:8080
```

#### Terminal 2 — Products

```bash
cd products
npm start
```

Runs on:

```text
http://localhost:8081
```

#### Terminal 3 — Cart

```bash
cd cart
npm start
```

Runs on:

```text
http://localhost:8082
```

Once all three servers are running, open:

```text
http://localhost:8080
```

## Development Mode

All three applications provide:

```bash
npm run start:dev
```

which starts webpack-dev-server with watch mode.

Example:

```bash
cd products
npm run start:dev
```

## Project Structure

```text
microfrontend/
│
├── container/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── bootstrap.js
│   │   └── index.js
│   ├── package.json
│   └── webpack.config.js
│
├── products/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── bootstrap.js
│   │   └── index.js
│   ├── package.json
│   └── webpack.config.js
│
├── cart/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── bootstrap.js
│   │   └── index.js
│   ├── package.json
│   └── webpack.config.js
│
└── README.md
```

## Remote Contract

The microfrontends use a simple `mount` contract.

### Products

```js
const mount = (el) => {
  // render products into el
};

export { mount };
```

### Cart

```js
const mount = (el) => {
  // render cart into el
};

export { mount };
```

This provides a minimal integration boundary between the host and each remote.

## CORS

The development servers send:

```http
Access-Control-Allow-Origin: *
```

This allows the container running on port `8080` to load the remote entries from ports `8081` and `8082` during local development.

For production, this should be replaced with an explicit and appropriately restricted origin policy.

## Why Microfrontends?

Microfrontends apply the principles of independently developed and deployable components to the frontend. A host application can compose functionality owned by separate frontend applications.

Typical benefits include:

- Independent development
- Independent builds
- Independent deployment
- Smaller application boundaries
- Team ownership by business/domain area
- Runtime composition
- Ability to evolve parts of an application independently

Module Federation is one approach for implementing this architecture with Webpack.

## Important Trade-offs

Microfrontends introduce additional architectural complexity. They should not automatically replace a well-structured monolithic frontend.

Consider:

- Remote version compatibility
- Shared dependencies
- Runtime failures
- Network latency
- Authentication and authorization
- Cross-application state
- Routing ownership
- UI consistency
- Error boundaries
- Deployment and rollback strategy
- Observability

For a small application or a single team, a modular monolith may be simpler. Microfrontends become more compelling when independent ownership, deployment, scaling, or technology boundaries provide a real benefit.

## Future Improvements

Possible next steps for this demo:

- Add React or another frontend framework
- Share React and ReactDOM through Module Federation
- Add TypeScript
- Add a shared design system
- Introduce application-level routing
- Add error boundaries around remotes
- Add loading and failure states
- Define typed contracts between host and remotes
- Add environment-based remote URLs
- Add production builds
- Add CI/CD pipelines
- Containerize each application with Docker
- Add automated tests
- Add versioned remote deployments
- Restrict CORS origins for production
- Add centralized observability

## Learning Goals

This repository is intended as a hands-on demonstration of:

1. What a microfrontend architecture looks like.
2. How a host application communicates with remote applications.
3. How Webpack Module Federation exposes modules.
4. How `remoteEntry.js` is consumed at runtime.
5. How independent development servers can compose one frontend application.
6. How a simple `mount()` contract can establish an integration boundary.

## License

This project does not currently declare a repository-level license. Add an explicit license before distributing or reusing the project publicly under defined terms.
