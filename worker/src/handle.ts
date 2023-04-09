import { Env } from './env'
import { RedirKV } from './kv'

type Target = {
    redir?: string
    key?: string
}

const getRedirTarget = (req: Request): Target => {
    const url = new URL(req.url)
    const target: Target = {}
    if (url.searchParams.has('key')) {
        const key = url.searchParams.get('key')
        target.key = key || undefined
    }
    if (url.searchParams.has('redir')) {
        const redir = url.searchParams.get('redir')
        target.redir = redir || undefined
    }
    return target
}

const getRedirUrl = async (
    req: Request,
    env: Env,
    target: Target
): Promise<string | null> => {
    if (typeof target.key !== 'undefined') {
        const kv = new RedirKV(env.KV_REDIR)
        return await kv.get(target.key, req.headers)
    }
    if (typeof target.redir !== 'undefined') {
        return target.redir || null
    }
    return null
}

export { getRedirTarget, getRedirUrl }
