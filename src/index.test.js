import { expect, test } from '@jest/globals'
import { SitemapStream } from './index.js'

/**
 * @param {import('.').SitemapItem[]} sitemapItems
 * @param {WritableStream<import('.').SitemapItem>} writableStream
 */
async function writeSitemapItems(sitemapItems, writableStream) {
  const writer = writableStream.getWriter()

  await writer.ready

  await Promise.all(
    sitemapItems.map((sitemapItem) => writer.write(sitemapItem))
  )

  await writer.close()
}

/**
 * @param {ReadableStream<string>} readableStream
 */
async function readableStreamToString(readableStream) {
  const reader = readableStream.getReader()
  let result = ''

  /**
   * @returns {Promise<ReadableStreamReadResult<string> | void>}
   */
  async function pump() {
    const { done, value } = await reader.read()

    if (!done) {
      result += value

      return pump()
    }
  }

  await pump()

  return result
}

test('basic use case', () => {
  const { readable, writable } = new SitemapStream({
    baseURL: 'https://example.com/',
  })

  writeSitemapItems(
    [
      {
        loc: '/',
        priority: 1.0,
      },
      {
        loc: '/privacy',
        priority: 0.1,
      },
    ],
    writable
  )

  return expect(readableStreamToString(readable)).resolves.toMatchSnapshot()
})

test('pretty results', () => {
  const { readable, writable } = new SitemapStream({
    baseURL: 'https://example.com/',
    pretty: true,
  })

  writeSitemapItems(
    [
      {
        loc: '/',
        priority: 1.0,
      },
      {
        loc: '/privacy',
        priority: 0.1,
      },
    ],
    writable
  )

  return expect(readableStreamToString(readable)).resolves.toMatchSnapshot()
})
