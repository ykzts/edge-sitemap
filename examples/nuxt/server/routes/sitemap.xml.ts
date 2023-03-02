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
  const baseURL = 'https://example.com/'
  const pretty = ['1', 'true'].includes(
    (Array.isArray(query.pretty) ? query.pretty : [query.pretty])[0] ?? '0'
  )
  const readableStream = createReadableStream().pipeThrough(
    new SitemapStream({ baseURL, pretty })
  )

  await pump(readableStream.getReader(), event.node.res)
})
