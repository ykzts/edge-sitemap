import { type Writable } from 'node:stream'
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

async function pump<T>(
  reader: ReadableStreamDefaultReader<T>,
  stream: Writable
): Promise<ReadableStreamReadResult<T> | void> {
  const { done, value } = await reader.read()

  if (!done) {
    stream.write(value)

    return pump(reader, stream)
  }

  stream.end()
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const pretty = (
    Array.isArray(query.pretty) ? query.pretty : [query.pretty]
  )[0]
  const { readable: smReadable, writable: smWritable } = new SitemapStream({
    baseURL: 'https://example.com/',
    pretty: !!pretty && ['1', 'true'].includes(pretty),
  })
  const writer = smWritable.getWriter()

  ;(async () => {
    await writer.ready

    await Promise.all(
      sitemapItems.map((sitemapItem) => writer.write(sitemapItem))
    )

    await writer.close()
  })()

  await pump(smReadable.getReader(), event.node.res)
})
