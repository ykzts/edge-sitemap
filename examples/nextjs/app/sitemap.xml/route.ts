import { type SitemapItem, SitemapStream } from 'edge-sitemap'
import { type NextRequest, NextResponse } from 'next/server'

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

export function GET(req: NextRequest) {
  const pretty = req.nextUrl.searchParams.get('pretty')
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

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  })
}
