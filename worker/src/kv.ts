import * as YAML from 'yaml'

type _Token = {
    value: string
    expire: number // -1 for never expire
}

type _RedirRec = {
    value: string
    fake_value?: string
    ua_excludes?: string[] // regex patterns
    require_token?: boolean
    tokens?: _Token[]
    enabled: boolean
}

class NotFoundError extends Error {
    public key: string
    constructor(key: string) {
        super(`Redir target with key='${key}' not found`)
        this.key = key
    }
}

class RedirKV {
    private _kv: KVNamespace
    constructor(kv: KVNamespace) {
        this._kv = kv
    }

    private _isExcludeUA = (
        header: Headers,
        ua_includes: string[]
    ): boolean => {
        const ua = header.get('User-Agent') || ''
        for (const pattern of ua_includes) {
            if (ua.match(pattern)) {
                return true
            }
        }
        return false
    }

    private _hasValidToken = (header: Headers, tokens: _Token[]): boolean => {
        const auth = header.get('Authorization') || ''
        const token = auth.replace(/^Bearer\s+/, '')
        for (const t of tokens) {
            if (t.value === token) {
                if (t.expire === -1) {
                    return true
                }
                if (t.expire > Date.now()) {
                    return true
                }
            }
        }
        return false
    }

    public get = async (
        key: string,
        header: Headers
    ): Promise<string | null> => {
        let fake = false
        const val = await this._kv.get(key)
        if (val === null) {
            throw new NotFoundError(key)
        }
        const rec: _RedirRec = YAML.parse(val)
        if (!rec.enabled) {
            return null
        }
        if (this._isExcludeUA(header, rec.ua_excludes || [])) {
            fake = true
        }
        if (
            rec.require_token &&
            !this._hasValidToken(header, rec.tokens || [])
        ) {
            fake = true
        }
        return fake ? rec.fake_value || null : rec.value
    }
}

export { RedirKV, NotFoundError }
