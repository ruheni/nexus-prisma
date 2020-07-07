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

schema.queryType({
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

schema.mutationType({
	definition(t) {
		t.field('createProduct', {
			type: 'Product',
			args: {
				color: schema.stringArg({ required: true }),
				grade: schema.stringArg({ required: true }),
				length: schema.intArg({ nullable: false }),
				variety: schema.stringArg({ nullable: false }),
				quantity: schema.intArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.product.create({
					data: {
						length: args.length,
						quantity: args.quantity,
						variety: args.variety,
						// TODO create input type to support enums for color and grade
						color: args.color,
						grade: args.grade,
					}
				})
			},
		})
		t.field('updateProduct', {
			type: 'Product',
			args: {
				id: schema.intArg({ required: true }),
				color: schema.stringArg({ nullable: false }),
				length: schema.intArg({ nullable: false }),
				grade: schema.stringArg({ nullable: false }),
				variety: schema.stringArg({ nullable: false }),
				quantity: schema.intArg({ nullable: false }),
			},
			resolve(_root, args, ctx) {
				return ctx.db.product.update({
					where: { id: args.id },
					data: {
						length: args.length,
						quantity: args.quantity,
						variety: args.variety,
						// TODO create input type to support enums for color and grade
						color: args.color,
						grade: args.grade,
					}
				})
			}
		})
	},
})

