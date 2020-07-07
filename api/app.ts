import { use } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { auth } from 'nexus-plugin-jwt-auth'

use(prisma())
use(auth({
    appSecret: 'random_app_secret_here'
}))
