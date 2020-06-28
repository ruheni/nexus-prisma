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
			nullable: false
		})
		t.field('products', {
			type: 'Product',
			nullable: false,
			list: true
		})
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('completedOrders', {
			nullable: false,
			type: 'Order',
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.order.findMany({ where: { status: 'REVIEWED' } })
			},
		})
		t.field('pendingOrders', {
			nullable: false,
			type: 'Order',
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.order.findMany({ where: { status: 'PENDING' } })
			},
		})
	},
})
