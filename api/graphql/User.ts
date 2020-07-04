import { schema } from 'nexus'

schema.enumType({
	name: 'Role',
	members: ['SALES_EXEC', 'GENERAL_MANAGER', 'STOCK_CLERK', 'ADMIN'],
	description: 'These are the different roles supported on the platform',
})

schema.objectType({
	name: 'User',
	definition(t) {
		t.model.id()
		t.model.firstName()
		t.model.lastName()
		t.model.email()
		t.model.password()
		t.model.role()
		t.model.createdAt()
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('users', {
			type: 'User',
			nullable: false,
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.user.findMany()
			},
		})
		t.field('userProfile', {
			type: 'User',
			nullable: false,
			args: {
				id: schema.intArg({ required: true })
			},
			resolve(_root, { id }, ctx) {
				return ctx.db.user.findOne({ where: { id } })
			}
		})
	},
})
