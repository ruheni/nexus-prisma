import { schema } from 'nexus'

schema.objectType({
	name: 'Agent',
	definition(t) {
		t.int('id')
		t.string('name')
		t.string('phoneNumber')
		t.string('email')
		t.field('customers', {
			type: 'Customer',
			list: true,
			nullable: false
		})
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('agents', {
			nullable: false,
			type: 'Agent',
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.agent.findMany()
			},
		})
	},
})
