// Schema.org structured data components for SEO

export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'HotPrint',
    'description': 'Типография премиальной отделки в Кишинёве: офсетная печать (Heidelberg), цифровая печать (Ricoh), шелкография, выборочный УФ-лак, тиснение фольгой, конгрев, тампопечать, пластиковые карты. Собственное производство с 1999 года.',
    'url': 'https://hotprint.md',
    'telephone': '+37368690899',
    'email': 'info@hotprint.md',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Academia St, 3/3',
      'addressLocality': 'Chișinău',
      'addressCountry': 'MD',
      'postalCode': 'MD-2028'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 47.0105,
      'longitude': 28.8638
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '09:00',
      'closes': '18:00'
    },
    'foundingDate': '1999',
    'sameAs': ['https://www.facebook.com/hotprint.md']
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'HotPrint',
    'url': 'https://hotprint.md',
    'logo': 'https://pbs.twimg.com/profile_images/1254880495843844096/ueowsjxo_400x400.jpg',
    'foundingDate': '1999',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+37368690899',
      'contactType': 'customer service',
      'availableLanguage': ['Russian', 'Romanian', 'English']
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbListSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': item.url
    }))
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FAQPageSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ProductSchema({ product }: { product: { name: string; description: string; minPrice?: number; maxPrice?: number; imageUrl?: string; slug: string } }) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'image': product.imageUrl || undefined,
    'url': `https://hotprint.md/products`,
    'brand': {
      '@type': 'Organization',
      'name': 'HotPrint'
    }
  }
  if (product.minPrice || product.maxPrice) {
    data.offers = {
      '@type': 'AggregateOffer',
      'priceCurrency': 'MDL',
      'lowPrice': String(product.minPrice ?? 0),
      'highPrice': String(product.maxPrice ?? product.minPrice ?? 0)
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ArticleSchema({ article }: { article: { title: string; excerpt: string; slug: string; imageUrl?: string; createdAt: string; updatedAt?: string; author?: string } }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.imageUrl || undefined,
    'url': `https://hotprint.md/blog/${article.slug}`,
    'author': {
      '@type': 'Organization',
      'name': article.author || 'HotPrint'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'HotPrint',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://pbs.twimg.com/media/HCq03mQbYAAY0_X.jpg'
      }
    },
    'datePublished': article.createdAt,
    'dateModified': article.updatedAt || article.createdAt
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ServiceSchema({ service }: { service: { name: string; description: string; slug: string; imageUrl?: string } }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.description,
    'url': `https://hotprint.md/services/${service.slug}`,
    'image': service.imageUrl || undefined,
    'provider': {
      '@type': 'Organization',
      'name': 'HotPrint',
      'url': 'https://hotprint.md'
    },
    'areaServed': {
      '@type': 'Country',
      'name': 'Moldova'
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
