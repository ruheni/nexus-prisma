import { schema } from 'nexus'

schema.objectType({
    name: 'User',
    definition(t) {
        t.int('id')
        t.string('firstName')
        t.string('lastName')
        t.string('email')
        t.string('password')
        t.string('role')
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
                return ctx.db.users
            }
        })
    }
})
