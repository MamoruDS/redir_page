import { Env } from './env'
import { getRedirTarget, getRedirUrl } from './handle'
import { BadPatternError, NotFoundError } from './kv'
import { respRedir, respPanic } from './utils'

export default {
    async fetch(
        request: Request,
        env: Env,
        _ctx: ExecutionContext
    ): Promise<Response> {
        const target = getRedirTarget(request)
        try {
            const redirUrl = await getRedirUrl(request, env, target)
            if (redirUrl !== null) {
                return respRedir(redirUrl)
            } else {
                return respPanic('Redir target not found', 404)
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                return respPanic(err, 404)
            }
            if (err instanceof BadPatternError) {
                return respPanic(err, 500)
            }
            throw err
        }
    },
}
