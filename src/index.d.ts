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

export interface SitemapStreamOptions {
  baseURL?: URL | string
  pretty?: boolean
}

export class SitemapStream extends TransformStream<SitemapItem, string> {
  constructor(options?: SitemapStreamOptions)
}
