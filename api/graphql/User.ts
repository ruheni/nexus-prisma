import { schema } from 'nexus'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { APP_SECRET } from '../utils'

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
				id: schema.intArg({ nullable: true }),
				email: schema.stringArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.user.findOne({
					where: {
						id: args.id,
						email: args?.email
					}
				})
			}
		})
	},
})

schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('signup', {
			type: 'AuthPayload',
			args: {
				firstName: schema.stringArg({ nullable: false }),
				lastName: schema.stringArg({ nullable: false }),
				email: schema.stringArg({ nullable: false }),
				password: schema.stringArg({ nullable: false }),
				role: schema.arg({
					type: 'Role',
					nullable: false
				}),
			},
			resolve: async (_root, { firstName, lastName, email, password, role }, ctx) => {

				const hashedPassword = await hash(password, 10)
				const user = await ctx.db.user.create({
					data: {
						firstName,
						lastName,
						email,
						password: hashedPassword,
						role
					}
				})

				return {
					token: sign({ userId: user.id }, APP_SECRET),
					user
				}
			}
		})
		t.field('login', {
			type: 'AuthPayload',
			args: {
				email: schema.stringArg({ nullable: false }),
				password: schema.stringArg({ nullable: false })
			},
			resolve: async (_root, { email, password }, ctx) => {
				const user = await ctx.db.user.findOne({
					where: {
						email,
					},
				})

				if (!user) {
					throw new Error(`No user found fo email: ${email}`)
				}

				const validPassword = await compare(password, user.password)
				if (!validPassword) {
					throw new Error('Invalid password')
				}

				return {
					token: sign({ userId: user.id }, APP_SECRET),
					user,
				}
			}
		})
		t.field('updateUser', {
			type: 'User',
			args: {
				id: schema.intArg({ nullable: false }),
				firstName: schema.stringArg({ nullable: false }),
				lastName: schema.stringArg({ nullable: false }),
				email: schema.stringArg({ nullable: false }),
				password: schema.stringArg({ nullable: false }),
				role: schema.arg({
					type: 'Role',
					nullable: false
				}),
			},
			resolve(_root, { id, firstName, lastName, email, password, role }, ctx) {
				// TODO - hash passwords
				return ctx.db.user.update({
					where: { id },
					data: {
						firstName,
						lastName,
						email,
						password,
						role
					}
				})
			}
		})
	}
})
