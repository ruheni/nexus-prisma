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
			resolve(_root, _args, ctx) {
				return ctx.db.order.findMany()
			}
		})
		t.field('findOrdersByStatus', {
			type: 'Order',
			list: true,
			args: {
				status: schema.arg({
					type: 'OrderStatus',
					required: true
				}),
			},
			resolve(_root, { status }, ctx) {
				return ctx.db.order.findMany({ where: { status } })
			},
		})
		t.field('orderDetails', {
			type: 'Order',
			nullable: false,
			args: {
				id: schema.intArg({ required: true }),
			},
			resolve(_root, { id }, ctx) {
				return ctx.db.order.findOne({ where: { id: id } })
			}
		})
	}
})



schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createOrder', {
			type: 'Order',
			args: {
				initialQuantity: schema.intArg({ required: true }),
				customerId: schema.intArg({ required: true }),
				productId: schema.intArg({ required: true }),
				date: schema.stringArg({ required: true }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.order.create({
					data: {
						initialQuantity: args.initialQuantity,
						finalQuantity: args.initialQuantity,
						date: args.date,
						status: "PENDING",
						Customer: {
							connect: { id: args.customerId }
						},
						products: {
							connect: { id: args.productId }
						},
					}
				})
			}
		})
		t.field('updateOrder', {
			type: 'Order',
			args: {
				id: schema.intArg({ required: true }),
				finalQuantity: schema.intArg({ nullable: false }),
				status: schema.arg({
					type: 'OrderStatus',
					nullable: false
				}),
				productIds: schema.intArg()
			},
			resolve(_root, { id, finalQuantity, status, productIds }, ctx) {
				return ctx.db.order.update({
					where: { id },
					data: {
						finalQuantity,
						status
					}
				})
			}
		})
	}
})
