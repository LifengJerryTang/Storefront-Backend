import client from "../../database";
import {Order} from "../../models/order";

describe('Order Model Tests', () => {

    const testData: Order[] = [
        {
            id: 1,
            products: [
                {
                    order_id: 1,
                    product_id: 1,
                    quantity: 5
                },
                {
                    order_id: 1,
                    product_id: 2,
                    quantity: 6
                },
            ],

            user_id: 2,
            order_status: 'complete'
        },

        {
            id: 2,
            products: [
                {
                    order_id: 2,
                    product_id: 3,
                    quantity: 6,
                },
                {
                    order_id: 2,
                    product_id: 4,
                    quantity: 12
                },
            ],

            user_id: 2,
            order_status: 'active'
        }
    ]
})
