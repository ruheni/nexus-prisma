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
                return ctx.db.products
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
            resolve(_root, args, ctx) {
                let product = {
                    color: args.color,
                    grade: args.grade,
                    variety: args.variety,
                    quantity: args.quantity
                }

                // ctx.db.products.push(product)

                return product
            }
        })
    }
})
