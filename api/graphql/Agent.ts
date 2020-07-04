import { schema } from 'nexus'

schema.objectType({
	name: 'Agent',
	definition(t) {
		t.model.id()
		t.model.name()
		t.model.phoneNumber()
		t.model.Customer()
	},
})

schema.extendType({
	type: 'Query',
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
				id: schema.intArg({ required: true })
			},
			resolve(_root, { id }, ctx) {
				return ctx.db.agent.findOne({ where: { id } })
			}
		})
	},
})

schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createAgent', {
			type: "Agent",
			nullable: false,
			args: {
				name: schema.stringArg({ required: true }),
				phoneNumber: schema.stringArg({ required: true }),
				email: schema.stringArg({ required: true }),
			},
			resolve(_root, args, ctx) {
				const agent = {
					name: args.name,
					phoneNumber: args.phoneNumber,
					email: args.email
				}

				return ctx.db.agent.create({ data: agent })
			}
		})
		t.field('updateAgent', {
			type: 'Agent',
			nullable: false,
			args: {
				id: schema.intArg({ required: true }),
				name: schema.stringArg(),
				phoneNumber: schema.stringArg(),
				email: schema.stringArg(),
			},
			resolve(_root, args, ctx) {
				const agent = {
					id: args.id,
					name: args.name,
					phoneNumber: args.phoneNumber,
					email: args.email
				}

				return ctx.db.agent.update({
					where: { id: args.id },
					data: agent
				})
			}
		})
	}
})
