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
		t.date('date')
		t.field('orderStatus', {
			type: 'OrderStatus',
			nullable: false,
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
				return ctx.db.order.findMany({ where: { orderStatus: 'REVIEWED' } })
			},
		})
		t.field('pendingOrders', {
			nullable: false,
			type: 'Order',
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.order.findMany({ where: { orderStatus: 'PENDING' } })
			},
		})
	},
})
