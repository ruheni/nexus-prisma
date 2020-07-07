import { schema } from 'nexus'
import { arg } from 'nexus/components/schema'

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

schema.queryType({
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

schema.mutationType({
	definition(t) {
		// TODO - user authentication(signup) logic here
		t.field('signup', {
			type: 'User',
			args: {
				firstName: schema.stringArg({ nullable: false }),
				lastName: schema.stringArg({ nullable: false }),
				email: schema.stringArg({ nullable: false }),
				password: schema.stringArg({ nullable: false }),
				role: schema.stringArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.user.create({
					data: {
						firstName: args.firstName,
						lastName: args.lastName,
						email: args.email,
						// TODO - hash passwords
						password: args.password,
						// TODO - enum role
						role: args.role
					}
				})
			}
		})
		// TODO - user authentication(login) logic here
		t.field('login', {
			type: 'User',
			args: {
				email: schema.stringArg({ nullable: false }),
				password: schema.stringArg({ nullable: false })
			},
			resolve(_root, args, ctx) {
				return ctx.db.user.update({
					where: { email: args.email },
					data: {
						email: args.email,
						password: args.password
					}
				})
			}
		})
		t.field('updateUser', {
			type: 'User',
			args: {
				id: schema.intArg(),
				firstName: schema.stringArg(),
				lastName: schema.stringArg(),
				email: schema.stringArg(),
				password: schema.stringArg(),
				role: schema.stringArg(),
			},
			resolve(_root, args, ctx) {
				return ctx.db.user.update({
					where: { id: args.id },
					data: {
						firstName: args.firstName,
						lastName: args.lastName,
						email: args.email,
						// TODO - hash passwords
						password: args.password,
						// TODO - enum role
						role: args.role
					}
				})
			}
		})
	}
})
