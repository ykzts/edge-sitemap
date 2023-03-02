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

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const baseURL = 'https://example.com/'
  const pretty =
    searchParams.has('pretty') &&
    ['1', 'true'].includes(searchParams.get('pretty') ?? '0')
  const body = createReadableStream()
    .pipeThrough(new SitemapStream({ baseURL, pretty }))
    .pipeThrough(new TextEncoderStream())

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  })
}
