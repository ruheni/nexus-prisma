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
		t.model.product()
		t.model.createdAt()
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
		t.field('ordersByStatus', {
			type: 'Order',
			// nullable: false,
			list: true,
			args: {
				status: schema.stringArg({ required: true }),
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
