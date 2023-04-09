const respRedir = (redirUrl: string): Response => {
    return Response.redirect(redirUrl, 302)
}

const resp404 = (message: string): Response => {
    return new Response(message, { status: 404 })
}

export { respRedir, resp404 }
