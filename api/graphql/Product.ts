import { schema } from 'nexus'

schema.enumType({
	name: 'Grade',
	members: ['GRADED', 'UNGRADED'],
	description: 'Flower grades',
})

schema.enumType({
	name: 'Color',
	members: ['WHITE', 'LILAC', 'PINK', 'CERISE', 'RED', 'ORANGE', 'YELLOW', 'PEACH', 'BI_COLOUR'],
	description: 'Flower colors',
})

schema.objectType({
	name: 'Product',
	definition(t) {
		t.model.id()
		t.model.length()
		t.model.variety()
		t.model.quantity()
		t.model.createdAt()
		t.model.grade()
		t.model.color()
	},
})

schema.extendType({
	type: 'Query',
	definition(t) {
		t.field('products', {
			type: 'Product',
			nullable: false,
			list: true,
			resolve(_root, _args, ctx) {
				return ctx.db.product.findMany()
			},
		})
		t.field('productDetails', {
			type: 'Product',
			nullable: false,
			args: {
				id: schema.intArg({ required: true })
			},
			resolve(_root, { id }, ctx) {
				return ctx.db.product.findOne({ where: { id } })
			}
		})
	},
})

schema.extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createProduct', {
			type: 'Product',
			nullable: false,
			args: {
				color: schema.stringArg({ required: true }),
				length: schema.intArg({ required: true }),
				grade: schema.stringArg({ required: true }),
				variety: schema.stringArg({ required: true }),
				quantity: schema.intArg({ required: true }),
			},
			resolve(_root, args, ctx) {
				const product = {
					color: args.color,
					length: args.length,
					quantity: args.quantity,
					variety: args.variety,
					grade: args.grade,
				}

				return ctx.db.product.create({ data: product })
			},
		})
	},
})

