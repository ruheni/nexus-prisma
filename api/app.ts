import { use } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { auth } from 'nexus-plugin-jwt-auth'
import { APP_SECRET } from './utils'

use(prisma())

// enable jwt auth plugin
use(
	auth({
		appSecret: APP_SECRET,
	}),
)
