// const APP_SECRET = process.env.APP_SECRET
const APP_SECRET = 'super_secret_key_no-one_can_guess'

const getUserId = (token: any | null | undefined) => {
    const userId = token.userId

    if (!userId) {
        throw new Error('Not Authorized')
    }

    return userId;
}

export { APP_SECRET, getUserId }
