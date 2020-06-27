import { schema } from 'nexus'

schema.enumType({
    name: "Grade",
    members: ["GRADED", "UNGRADED"],
    description: "Flower grades"
})

schema.enumType({
    name: "Color",
    members: ["WHITE", "LILAC", "PINK", "CERISE", "RED", "ORANGE", "YELLOW", "PEACH", "BI_COLOUR",],
    description: "Flower colors"
})

schema.objectType({
    name: 'Product',
    definition(t) {
        t.int('id')
        t.string('color')
        t.int('length')
        t.string('grade')
        t.string('variety')
        t.int('quantity')
        t.field('grade', {
            nullable: false,
            type: "Grade",
        })
        t.field('color', {
            nullable: false,
            type: "Color"
        })
    }
})

schema.extendType({
    type: 'Query',
    definition(t) {
        t.field('products', {
            nullable: false,
            type: "Product",
            list: true,
            resolve(_root, _args, ctx) {
                return ctx.db.product.findMany()
            }
        })
    }
})

schema.extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createProduct', {
            type: "Product",
            nullable: false,
            args: {
                color: schema.stringArg({ required: true }),
                length: schema.intArg({ required: true }),
                grade: schema.stringArg({ required: true }),
                variety: schema.stringArg({ required: true }),
                quantity: schema.intArg({ required: true }),
            },
            async resolve(_root, args, ctx) {
                const product = {
                    color: args.color,
                    length: args.length,
                    quantity: args.quantity,
                    variety: args.variety
                }

                return await ctx.db.product.create({ data: product })
            }
        })
    }
})
