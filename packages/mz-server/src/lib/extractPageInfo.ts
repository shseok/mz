import axios from 'axios'
import AppError from './AppError.js'
import metascraper from 'metascraper'
import authRule from 'metascraper-author'
import imageRule from 'metascraper-image'
import publisherRule from 'metascraper-publisher'
import logoRule from 'metascraper-logo-favicon'

type ValidateResult = {
  url: string
  html: string
}

interface ExtractPageInfoResult {
  url: string
  publisher: string
  favicon: string | null
  thumbnail: string | null
  author: string | null
  domain: string
}

const client = axios.create({
  timeout: 8000,
})

const scraper = metascraper([
  logoRule(),
  imageRule(),
  publisherRule(),
  authRule(),
])

export async function extractPageInfo(
  url: string,
): Promise<ExtractPageInfoResult> {
  const { url: validatedUrl, html } = await validateUrl(url)
  const data = await scraper({
    html,
    url: validatedUrl,
  })
  const domain = new URL(validatedUrl).hostname
  // console.log(data, domain)
  return {
    url: validatedUrl,
    publisher: data.publisher ?? domain,
    author: data.author,
    favicon: data.logo,
    thumbnail: data.image,
    domain,
  }
}

async function validateUrl(url: string): Promise<ValidateResult> {
  const hasProtocol = /^https?:\/\//.test(url)

  if (hasProtocol) {
    try {
      const { data } = await client.get(url)

      return {
        url,
        html: data,
      }
    } catch (error) {
      throw new AppError('InvalidURLError')
    }
  }

  const withHttp = `http://${url}`
  const withHttps = `https://${url}`
  const [http, https] = await Promise.allSettled([
    client.get(withHttp),
    client.get(withHttps),
  ])

  if (https.status === 'fulfilled') {
    return {
      url: withHttps,
      html: https.value.data,
    }
  }

  if (http.status === 'fulfilled') {
    return {
      url: withHttp,
      html: http.value.data,
    }
  }

  throw new AppError('InvalidURLError')
}
