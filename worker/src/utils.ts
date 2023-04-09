const respRedir = (redirUrl: string): Response => {
    return Response.redirect(redirUrl, 302)
}

const respPanic = (e: Error | string, code: number): Response => {
    const msg = typeof e === 'string' ? e : e.message || e.toString()
    return new Response(msg || `Unknown error`, {
        status: code,
    })
}

export { respRedir, respPanic }
