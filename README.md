# Redir Page

URL scheme is a nice to have feature, but it is not as easy to use as a normal URL, which you can access with a single click on a website or any IM app. This repository allows you to access your URL scheme easily through redirection.

## Usage

You have the option to use either the Redir Page through GitHub Page or Cloudflare Worker. The GH Pager version will simply open the target URL in your browser, whereas the CF Worker version uses HTTP redirection and offers additional features, such as UA filtering and token authentication.

### Use via GitHub Page

```
https://mamoruds.github.io/redir_page/?redir=<your_url>
```

Example:

```
shortcuts://run-shortcut?name=Show clipboard content
```

Original url should be encoded:

```
https://mamoruds.github.io/redir_page?redir=shortcuts%3A%2F%2Frun-shortcut%3Fname%3DShow%20clipboard%20content
```

### Use via Cloudflare Worker

First, deploy the worker to your Cloudflare account

```shell
git clone https://github.com/MamoruDS/redir_page.git \
    && cd redir_page/worker

# fill in the KV binding in wrangler.toml before publishing
wrangle publish
```

You can now access your URL scheme with the same usage as the GH Pager version

```yaml
https://<worker_route>/?redir=<your_url>

# example
https://redir.foo.workers.dev/?redir=shortcuts%3A%2F%2Frun-shortcut%3Fname%3DShow%20clipboard%20content
```

To enable more advanced features, you can add redir records in the KV. The records are stored in YAML and have the following interface:

```typescript
type RedirRec = {
    value: string
    fake_value?: string
    ua_excludes?: string[] // regex patterns
    require_token?: boolean
    tokens?: {
        value: string
        expire: number // -1 for never expire
    }[]
    enabled: boolean
}
```

Example:

```yaml
# key=demo01
value: tg://open
fake_value: shortcuts://run-shortcut?name=Show clipboard content
ua_excludes:
  - Macintosh.*Safari
  - Chrome
  - Firefox\/1\d{2}
enabled: true
```

```shell
curl -A 'Chrome' -I 'https://redir.foo.workers.dev/?key=demo01'
# HTTP/1.1 302 Found
# date: Sun, 09 Apr 2023 10:41:11 GMT
# location: shortcuts://run-shortcut?name=Show%20clipboard%20content
# ...
```
