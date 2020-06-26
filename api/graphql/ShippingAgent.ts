import { schema } from 'nexus'

schema.objectType({
    name: 'ShippingAgent',
    definition(t) {
        t.int('id')
        t.string('name')
        t.string('phoneNumber')
        t.string('email')
    }
})

schema.extendType({
    type: 'Query',
    definition(t) {
        t.field('shippingAgents', {
            nullable: false,
            type: "ShippingAgent",
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.shippingAgents.findMany()
            }
        })
    }

})
