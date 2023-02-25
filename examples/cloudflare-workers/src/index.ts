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

export default {
  fetch(request: Request) {
    const { searchParams } = new URL(request.url)
    const pretty = searchParams.get('pretty')
    const { readable: smReadable, writable: smWritable } = new SitemapStream({
      baseURL: 'https://example.com/',
      pretty: !!pretty && ['1', 'true'].includes(pretty),
    })
    const body = smReadable.pipeThrough(new TextEncoderStream())
    const writer = smWritable.getWriter()

    ;(async () => {
      await writer.ready

      await Promise.all(
        sitemapItems.map((sitemapItem) => writer.write(sitemapItem))
      )

      await writer.close()
    })()

    return new Response(body, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
      },
    })
  },
}
