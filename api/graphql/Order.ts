import { schema } from 'nexus'

schema.enumType({
	name: 'OrderStatus',
	members: ['PENDING', 'REVIEWED', 'CANCELLED'],
	description: 'Order statuses',
})

schema.objectType({
	name: 'Order',
	definition(t) {
		t.model.id()
		t.model.initialQuantity()
		t.model.finalQuantity()
		t.model.status()
		t.model.Customer()
		t.model.products()
		t.model.createdAt()
		t.model.date()
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('orders', {
			type: 'Order',
			nullable: false,
			list: true,
			resolve: async (_root, _args, ctx) => {
				const orders = ctx.db.order.findMany()
				return orders
			},
		})
		t.field('findOrdersByStatus', {
			type: 'Order',
			list: true,
			args: {
				status: schema.arg({
					type: 'OrderStatus',
					required: true,
				}),
			},
			resolve: async (_root, { status }, ctx) => {
				const order = await ctx.db.order.findMany({ where: { status } })
				return order
			},
		})
		t.field('orderDetails', {
			type: 'Order',
			args: {
				id: schema.intArg({ nullable: false }),
			},
			resolve: async (_root, { id }, ctx) => {
				const order = await ctx.db.order.findOne({ where: { id: id } })
				return order
			},
		})
	},
})

schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createOrder', {
			type: 'Order',
			args: {
				initialQuantity: schema.intArg({ nullable: false }),
				customerId: schema.intArg({ nullable: false }),
				productId: schema.intArg({ nullable: false }),
				date: schema.stringArg({ nullable: false }),
			},
			resolve: async (_root, { initialQuantity, customerId, productId, date }, ctx) => {
				const order = await ctx.db.order.create({
					data: {
						initialQuantity: initialQuantity,
						finalQuantity: initialQuantity,
						date: date,
						status: 'PENDING',
						Customer: {
							connect: { id: customerId },
						},
						products: {
							connect: { id: productId },
						},
					},
				})

				return order
			},
		})
		t.field('updateOrder', {
			type: 'Order',
			args: {
				id: schema.intArg({ required: true }),
				finalQuantity: schema.intArg({ nullable: false }),
				status: schema.arg({
					type: 'OrderStatus',
					nullable: false,
				}),
				productIds: schema.intArg(),
			},
			resolve: async (_root, { id, finalQuantity, status, productIds }, ctx) => {
				const order = await ctx.db.order.update({
					where: { id },
					data: {
						finalQuantity,
						status,
					},
				})
				return order
			},
		})
	},
})
