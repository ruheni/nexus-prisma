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
		t.field('customerProfile', {
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

schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createCustomer', {
			type: 'Customer',
			nullable: false,
			args: {
				name: schema.stringArg({ required: true }),
				contactName: schema.stringArg({ required: true }),
				market: schema.stringArg({ required: true }),
				email: schema.stringArg({ required: true }),
				phoneNumber: schema.stringArg({ required: true })
			},
			resolve(_root, args, ctx) {
				const customer = {
					name: args.name,
					contactName: args.contactName,
					market: args.market,
					email: args.email,
					phoneNumber: args.phoneNumber
				}

				return ctx.db.customer.create({ data: customer })
			}
		})
		t.field('updateCustomer', {
			type: 'Customer',
			nullable: false,
			args: {
				id: schema.intArg({ required: true }),
				name: schema.stringArg(),
				contactName: schema.stringArg(),
				market: schema.stringArg(),
				email: schema.stringArg(),
				phoneNumber: schema.stringArg()
			},
			resolve(_root, args, ctx) {
				let customer = {
					name: args.name,
					contactName: args.contactName,
					market: args.market,
					email: args.email,
					phoneNumber: args.phoneNumber
				}

				return ctx.db.customer.update({
					where: { id: args.id },
					data: customer
				})
			}
		})
	}
})
