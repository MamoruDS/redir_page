import { Env } from './env'
import { getRedirTarget, getRedirUrl } from './handle'
import { NotFoundError } from './kv'
import { respRedir, resp404 } from './utils'

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
                return resp404('Redir target not found')
            }
        } catch (e) {
            if (e instanceof NotFoundError) {
                return resp404(e.message)
            }
            throw e
        }
    },
}
