import { schema } from 'nexus'

schema.objectType({
	name: 'Agent',
	definition(t) {
		t.model.id()
		t.model.name()
		t.model.email()
		t.model.phoneNumber()
		t.model.Customer()
		t.model.createdAt()
	},
})

schema.queryType({
	definition(t) {
		t.field('agents', {
			type: 'Agent',
			nullable: false,
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.agent.findMany()
			},
		})
		t.field('agentProfile', {
			type: 'Agent',
			nullable: false,
			args: {
				id: schema.intArg({ nullable: false })
			},
			resolve(_root, args, ctx) {
				return ctx.db.agent.findOne({ where: { id: args.id } })
			}
		})
	},
})

schema.mutationType({
	definition(t) {
		t.field('createAgent', {
			type: "Agent",
			args: {
				name: schema.stringArg({ required: true }),
				phoneNumber: schema.stringArg({ required: true }),
				email: schema.stringArg({ required: true }),
				customerId: schema.intArg({ nullable: false })
			},
			resolve(_root, args, ctx) {
				return ctx.db.agent.create({
					data: {
						name: args.name,
						email: args.email,
						phoneNumber: args.phoneNumber,
						Customer: {
							connect: { id: args.customerId }
						}
					},
				})
			}
		})
		t.field('updateAgent', {
			type: 'Agent',
			nullable: false,
			args: {
				id: schema.intArg({ nullable: false }),
				name: schema.stringArg({ nullable: false }),
				phoneNumber: schema.stringArg({ nullable: false }),
				email: schema.stringArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.agent.update({
					where: {
						id: args.id
					},
					data: {
						name: args.name,
						phoneNumber: args.name,
						email: args.phoneNumber
					}
				})
			}
		})
	}
})
