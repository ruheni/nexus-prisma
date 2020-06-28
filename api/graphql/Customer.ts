import { schema } from 'nexus'

schema.objectType({
	name: 'Customer',
	definition(t) {
		t.int('id')
		t.string('name')
		t.string('contactName')
		t.string('market')
		t.string('email')
		t.string('phoneNumber')
		t.field('agents', {
			type: 'Agent',
			list: true,
		})
		t.field('orders', {
			type: 'Order',
			nullable: false,
			list: true,
		})
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('customers', {
			type: 'Customer',
			nullable: false,
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.customer.findMany()
			},
		})
		t.field('customerDetails', {
			type: 'Customer',
			nullable: false,
			args: {
				id: schema.intArg({ required: true })
			},
			resolve(_root, { id }, ctx) {
				return ctx.db.customer.findOne({ where: { id } })
			}
		})
	},
})
