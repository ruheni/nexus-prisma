import { schema } from 'nexus'

schema.objectType({
    name: "Customer",
    definition(t) {
        t.int('id')
        t.string('name')
        t.string('contactName')
        t.string('market')
        t.string('email')
        t.string('phoneNumber')
    }
})

schema.extendType({
    type: 'Query',
    definition(t) {
        t.field('customers', {
            nullable: false,
            type: 'Customer',
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.customers
            }
        })
    }
})
