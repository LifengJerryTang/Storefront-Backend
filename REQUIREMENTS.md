# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: '/products' [GET]
- Show: '/products/:id' [GET]
- Create [token required] '/products' [POST]
- [OPTIONAL] Top 5 most popular products  [GET]
- [OPTIONAL] Products by category (args: product category) '/products/:category' [GET]

#### Users
- Index [token required] '/users' [GET]
- Show [token required] '/users/:id' [GET]
- Create [token required] '/users' [POST]

#### Orders
- Current Order by user (args: user id)[token required]: '/orders/:userId' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] '/orders/:userId/completed' [GET]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

```
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price NUMERIC(9,2) NOT NULL,
  category VARCHAR NOT NULL
)
```

#### User
- id
- firstName
- lastName
- password

```
Schema:

users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(45) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL
)
```

#### Orders
- id
- list of Order Products
- user_id
- status of order (active or complete)

```
Schema:

orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_status ORDER_STATUS NOT NULL
)

ORDER_STATUS AS ENUM ('active', 'complete');
```

#### Order Products
- the id of the order 
- the id of the product
- quantity

```
Schema:

order_products (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL
)
```

