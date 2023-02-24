/**
 * @typedef {('always'|'daily'|'hourly'|'monthly'|'never'|'weekly'|'yearly')} SitemapChangeFreq
 */

/**
 * @typedef {Object} SitemapItem
 * @property {SitemapChangeFreq} changefreq
 * @property {`${number}-${number}-${number}`} lastmod
 * @property {(URL|string)} loc
 * @property {number=} priority
 */

/**
 * @typedef {Object} SitemapStreamOptions
 * @property {(URL|string)=} baseURL
 * @property {boolean=} pretty
 */

/**
 * @extends {TransformStream<SitemapItem, string>}
 */
export class SitemapStream extends TransformStream {
  /**
   * @param {SitemapStreamOptions=} options
   */
  constructor({ baseURL, pretty = false } = {}) {
    const lf = pretty ? '\n' : ''

    super({
      flush(controller) {
        controller.enqueue(`</urlset>${lf}`)
      },
      start(controller) {
        controller.enqueue('<?xml version="1.0" encoding="UTF-8"?>\n')
        controller.enqueue(
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${lf}`
        )
      },
      transform(chunk, controller) {
        const indent = pretty ? '  ' : ''

        controller.enqueue(`${indent}<url>${lf}`)

        if (chunk.changefreq) {
          controller.enqueue(
            `${indent.repeat(2)}<changefreq>${
              chunk.changefreq
            }</changefreq>${lf}`
          )
        }

        if (chunk.lastmod) {
          controller.enqueue(
            `${indent.repeat(2)}<lastmod>${chunk.lastmod}</lastmod>${lf}`
          )
        }

        controller.enqueue(
          `${indent.repeat(2)}<loc>${new URL(
            chunk.loc,
            baseURL
          ).toString()}</loc>${lf}`
        )

        if (chunk.priority) {
          controller.enqueue(
            `${indent.repeat(2)}<priority>${chunk.priority.toFixed(
              1
            )}</priority>${lf}`
          )
        }

        controller.enqueue(`${indent}</url>${lf}`)
      },
    })
  }
}
