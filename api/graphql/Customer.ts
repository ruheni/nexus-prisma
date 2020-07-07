import { schema } from 'nexus'

schema.objectType({
	name: 'Customer',
	definition(t) {
		t.model.id()
		t.model.name()
		t.model.contactName()
		t.model.email()
		t.model.market()
		t.model.agents({
			filtering: true,
			ordering: true,
		})
		t.model.orders({
			pagination: false,
			filtering: true,
			ordering: true
		})
		t.model.createdAt()
	},
})

schema.queryType({
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

schema.mutationType({
	definition(t) {
		t.field('createCustomer', {
			type: 'Customer',
			nullable: false,
			args: {
				name: schema.stringArg({ required: true }),
				contactName: schema.stringArg({ required: true }),
				market: schema.stringArg({ required: true }),
				email: schema.stringArg({ required: true }),
				phoneNumber: schema.stringArg({ required: true }),
				agentId: schema.intArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.customer.create({
					data: {
						name: args.name,
						contactName: args.contactName,
						email: args.contactName,
						market: args.market,
						phoneNumber: args.phoneNumber,
						agents: {
							connect: { id: args.agentId }
						}
					},
				})
			}
		})
		t.field('updateCustomer', {
			type: 'Customer',
			nullable: false,
			args: {
				id: schema.intArg({ required: true }),
				name: schema.stringArg({ nullable: false }),
				contactName: schema.stringArg({ nullable: false }),
				market: schema.stringArg({ nullable: false }),
				email: schema.stringArg({ nullable: false }),
				phoneNumber: schema.stringArg({ nullable: false })
			},
			resolve(_root, args, ctx) {
				return ctx.db.customer.update({
					where: { id: args.id },
					data: {
						name: args.name,
						contactName: args.contactName,
						market: args.market,
						email: args.email,
						phoneNumber: args.phoneNumber
					}
				})
			}
		})
	}
})
