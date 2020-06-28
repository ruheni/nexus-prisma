import { schema } from 'nexus'

schema.enumType({
	name: 'OrderStatus',
	members: ['PENDING', 'REVIEWED', 'CANCELLED'],
	description: 'Order statuses',
})

schema.objectType({
	name: 'Order',
	definition(t) {
		t.int('id')
		t.int('initialQuantity')
		t.int('finalQuantity')
		t.date('createdAt')
		t.field('status', {
			type: 'OrderStatus',
			nullable: false,
		})
		t.field('customer', {
			type: 'Customer',
			nullable: false,
		})
		t.field('products', {
			type: 'Product',
			nullable: false,
			list: true,
		})
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
