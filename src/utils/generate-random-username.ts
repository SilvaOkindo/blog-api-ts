export const generateRandomUsername = (): string => {
    const username = 'user-' + Math.random().toString(36).slice(2)
    return username
}

