import { use } from 'nexus'
import { auth } from 'nexus-plugin-jwt-auth'
import { prisma } from 'nexus-plugin-prisma'
import { shield } from 'nexus-plugin-shield'
import { APP_SECRET } from './utils'
import { rules } from './utils/permissions'

use(prisma())

// enable jwt auth plugin
use(
	auth({
		appSecret: APP_SECRET,
	}),
)

// enable shield plugin
// use(
// 	shield({
// 		rules,
// 	}),
// )
