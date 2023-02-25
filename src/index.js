/**
 * @typedef {'always' | 'daily' | 'hourly' | 'monthly' | 'never' | 'weekly' | 'yearly'} SitemapChangeFreq
 */

/**
 * @typedef {Object} SitemapItem
 * @property {SitemapChangeFreq} [changefreq]
 * @property {`${number}-${number}-${number}`} [lastmod]
 * @property {(URL|string)} loc
 * @property {number} [priority]
 */

/**
 * @typedef {Object} SitemapTransformerOptions
 * @property {URL | string} [baseURL]
 * @property {boolean} [pretty]
 */

/**
 * @implements {Transformer<SitemapItem, string>}
 */
export class SitemapTransformer {
  /** @type {URL | string | undefined} */
  #baseURL
  /** @type {string} */
  #lf
  /** @type {string} */
  #indent

  /**
   * @param {SitemapTransformerOptions} [options]
   */
  constructor(
    /** @todo https://github.com/microsoft/TypeScript/pull/52880 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { baseURL, pretty = false } = {}
  ) {
    this.#baseURL = baseURL
    this.#lf = pretty ? '\n' : ''
    this.#indent = pretty ? '  ' : ''
  }

  /** @type {TransformerFlushCallback<string>} */
  flush(controller) {
    controller.enqueue(`</urlset>${this.#lf}`)
  }

  /** @type {TransformerStartCallback<string>} */
  start(controller) {
    controller.enqueue('<?xml version="1.0" encoding="UTF-8"?>\n')
    controller.enqueue(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${this.#lf}`
    )
  }

  /** @type {TransformerTransformCallback<SitemapItem, string>} */
  transform(chunk, controller) {
    /** @type {URL} */
    let url
    try {
      url = new URL(chunk.loc, this.#baseURL)
    } catch (error) {
      controller.error(error)

      return
    }

    controller.enqueue(`${this.#indent}<url>${this.#lf}`)

    if (chunk.changefreq) {
      controller.enqueue(
        `${this.#indent.repeat(2)}<changefreq>${chunk.changefreq}</changefreq>${
          this.#lf
        }`
      )
    }

    if (chunk.lastmod) {
      controller.enqueue(
        `${this.#indent.repeat(2)}<lastmod>${chunk.lastmod}</lastmod>${
          this.#lf
        }`
      )
    }

    controller.enqueue(
      `${this.#indent.repeat(2)}<loc>${url.toString()}</loc>${this.#lf}`
    )

    if (chunk.priority) {
      const priority = chunk.priority.toFixed(1)

      controller.enqueue(
        `${this.#indent.repeat(2)}<priority>${priority}</priority>${this.#lf}`
      )
    }

    controller.enqueue(`${this.#indent}</url>${this.#lf}`)
  }
}

/**
 * @typedef {Object} SitemapStreamOptions
 * @property {URL | string} [baseURL]
 * @property {boolean} [pretty]
 */

/**
 * @extends {TransformStream<SitemapItem, string>}
 */
export class SitemapStream extends TransformStream {
  /**
   * @param {SitemapStreamOptions} [options]
   */
  constructor(
    /** @todo https://github.com/microsoft/TypeScript/pull/52880 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { baseURL, pretty = false } = {}
  ) {
    super(new SitemapTransformer({ baseURL, pretty }))
  }
}
