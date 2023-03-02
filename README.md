# Edge Sitemap

Generator of Sitemaps using web standard technology for operation in Edge Computing.

## Usage

```javascript
import { SitemapStream } from 'edge-sitemap'

function createReadableStream() {
  return new ReadableStream({
    start(controller) {
      controller.enqueue({
        loc: '/',
        priority: 1.0,
      })
      controller.enqueue({
        loc: '/privacy',
        priority: 0.1,
      })
      controller.close()
    },
  })
}

addEventListener('fetch', (event) => {
  const baseURL = 'https://example.com/'
  const body = createReadableStream()
    .pipeThrough(new SitemapStream({ baseURL }))
    .pipeThrough(new TextEncoderStream())
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  })

  return event.respondWith(response)
})
```
