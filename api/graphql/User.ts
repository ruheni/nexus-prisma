import { schema } from 'nexus'

schema.enumType({
    name: 'Role',
    members: ["SALES_EXEC", "GENERAL_MANAGER", "STOCK_CLERK", "ADMIN"],
    description: "These are the different roles supported on the platform"
})

schema.objectType({
    name: 'User',
    definition(t) {
        t.int('id')
        t.string('firstName')
        t.string('lastName')
        t.string('email')
        t.string('password')
        t.field("role", {
            type: "Role",
            nullable: false
        })
    }
})

schema.extendType({
    type: 'Query',
    definition(t) {
        t.field('users', {
            nullable: false,
            type: 'User',
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.users.findMany()
            }
        })
    }
})
