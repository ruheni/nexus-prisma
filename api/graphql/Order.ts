import { schema } from 'nexus'

schema.objectType({
    name: "Order",
    definition(t) {
        t.int('id')
        t.int('initialQuantity')
        t.int('finalQuantity')
        t.string('status')
        t.date('date')
    }
})

schema.extendType({
    type: 'Query',
    definition(t) {
        t.field('completedOrders', {
            nullable: false,
            type: 'Order',
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.orders
            }
        })
        t.field('incompleteOrders', {
            nullable: false,
            type: 'Order',
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.orders
            }
        })
    }
})
