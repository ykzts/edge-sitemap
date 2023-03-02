import { type SitemapItem, SitemapStream } from 'edge-sitemap'

const sitemapItems: SitemapItem[] = [
  {
    changefreq: 'daily',
    lastmod: '2023-02-23',
    loc: '/',
    priority: 1.0,
  },
  {
    changefreq: 'monthly',
    lastmod: '2020-01-01',
    loc: '/privacy',
    priority: 0.1,
  },
]

type CreateHTMLDocumentOptions = {
  title: string
}

function createHTMLDocument({ title }: CreateHTMLDocumentOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
  </body>
</html>
`
}

function createReadableStream(): ReadableStream<SitemapItem> {
  return new ReadableStream<SitemapItem>({
    start(controller) {
      for (const sitemapItem of sitemapItems) {
        controller.enqueue(sitemapItem)
      }

      controller.close()
    },
  })
}

export default {
  fetch(request: Request) {
    const { pathname, searchParams } = new URL(request.url)

    switch (pathname) {
      case '/': {
        const body = createHTMLDocument({ title: 'Home' })

        return new Response(body, {
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
          },
        })
      }
      case '/privacy': {
        const body = createHTMLDocument({ title: 'Privacy' })

        return new Response(body, {
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
          },
        })
      }
      case '/sitemap.xml': {
        const baseURL = 'https://example.com/'
        const pretty =
          searchParams.has('pretty') &&
          ['1', 'true'].includes(searchParams.get('pretty') ?? '0')
        const body = createReadableStream()
          .pipeThrough(new SitemapStream({ baseURL, pretty }))
          .pipeThrough(new TextEncoderStream())

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=UTF-8',
          },
        })
      }
      default: {
        const body = createHTMLDocument({ title: '404 Not Found' })

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=UTF-8',
          },
          status: 404,
        })
      }
    }
  },
}
