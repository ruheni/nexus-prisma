import { use, server } from 'nexus'
import { auth } from 'nexus-plugin-jwt-auth'
import { prisma } from 'nexus-plugin-prisma'
import { shield } from 'nexus-plugin-shield'
import { APP_SECRET } from './utils'
import { rules } from './utils/permissions'

import cookieParser from 'cookie-parser'

// Add cookie-parser middleware to Express 
server.express.use(cookieParser())

use(prisma())

// enable jwt auth plugin
use(
	auth({
		appSecret: APP_SECRET,
		useCookie: true,
		cookieName: 'token'
	}),
)

// enable shield plugin
use(
	shield({
		rules,
	}),
)
