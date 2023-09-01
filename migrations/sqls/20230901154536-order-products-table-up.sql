/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS order_products (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL
)

