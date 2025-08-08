// This file handles metadata (NO "use client")
import StoreDetailPage from './StoreDetailPage'

export async function generateMetadata({ params }) {
  const slug = params.slug
  
  try {
    const response = await fetch(`https://app.vplaza.com.ng/api/v1/stores/${slug}`)
    const data = await response.json()
    const store = data.data

    if (!store) {
      return {
        title: 'Store Not Found | VPlaza',
        description: 'The store you are looking for could not be found.',
      }
    }

    return {
      title: `${store.name} - ${store.type} Store | VPlaza`,
      description: `Shop from ${store.name}, a ${store.type} store at ${store.university}. ${store.description.substring(0, 150)}...`,
      keywords: `${store.name}, ${store.type} store, ${store.university}, VPlaza, online shopping, student marketplace`,
      
      openGraph: {
        type: 'website',
        siteName: 'VPlaza',
        title: `${store.name} - ${store.type} Store`,
        description: `Discover amazing products from ${store.name} at ${store.university}. ${store.description.substring(0, 200)}`,
        url: `https://www.vplaza.com.ng/${slug}`,
        images: [
          {
            url: store.image_url || 'https://www.vplaza.com.ng/vplaza-og-image.png',
            width: 1200,
            height: 630,
            alt: `${store.name} store image`,
          },
        ],
        locale: 'en_NG',
      },
      
      twitter: {
        card: 'summary_large_image',
        site: '@VPlazaNG',
        creator: '@VPlazaNG',
        title: `${store.name} - ${store.type} Store | VPlaza`,
        description: `Shop from ${store.name} at ${store.university}. ${store.description.substring(0, 200)}`,
        images: [store.image_url || 'https://www.vplaza.com.ng/vplaza-og-image.png'],
      },
      
      alternates: {
        canonical: `https://www.vplaza.com.ng/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Store | VPlaza',
      description: 'Discover amazing products from local stores on VPlaza',
    }
  }
}

export default function Page({ params }) {
  return <StoreDetailPage />
}
