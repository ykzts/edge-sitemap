# Edge Sitemap

Generator of Sitemaps using web standard technology for operation in Edge Computing.

## Usage

```javascript
import { SitemapStream } from 'edge-sitemap'

async function writeSitemap(writer) {
  await writer.ready

  await Promise.all([
    writer.write({
      loc: '/',
      priority: 1.0,
    }),
    writer.write({
      loc: '/privacy',
      priority: 0.1,
    }),
  ])

  await writer.close()
}

addEventListener('fetch', (event) => {
  const { readable: smReadable, writable: smWritable } = new Sitemap({
    baseURL: 'https://example.com/',
  })
  const body = smReadable.pipeThrough(new TextEncoderStream())
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  })

  writeSitemap(smWritable.getWriter())

  return event.respondWith(response)
})
```
