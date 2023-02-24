export type SitemapChangeFreq =
  | 'always'
  | 'daily'
  | 'hourly'
  | 'monthly'
  | 'never'
  | 'weekly'
  | 'yearly'

export interface SitemapItem {
  changefreq?: SitemapChangeFreq
  lastmod?: `${number}-${number}-${number}`
  loc: URL | string
  priority?: number
}

export interface SitemapTransformerOptions {
  baseURL?: URL | string
  pretty?: boolean
}

export class SitemapTransformer implements Transformer<SitemapItem, string> {
  constructor(options?: SitemapTransformerOptions)
  flush(controller: TransformerStartCallback<string>): void
  start(controller: TransformerStartCallback<string>): void
  transform(
    chunk: SitemapItem,
    controller: TransformerStartCallback<string>
  ): void
}

export interface SitemapStreamOptions {
  baseURL?: URL | string
  pretty?: boolean
}

export class SitemapStream extends TransformStream<SitemapItem, string> {
  constructor(options?: SitemapStreamOptions)
}
