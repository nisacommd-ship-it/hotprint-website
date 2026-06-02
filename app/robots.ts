import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'hotprint.abacusai.app'
  const siteUrl = `https://${host}`

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
