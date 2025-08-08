// FILE 1: page.js (This handles metadata - NO "use client")
import ProductDetailPage from './ProductDetailPage'

export async function generateMetadata({ params }) {
  const productId = params.id
  
  try {
    const response = await fetch(`https://app.vplaza.com.ng/api/v1/products/${productId}`)
    const data = await response.json()
    const product = data.data

    if (!product) {
      return {
        title: 'Product Not Found | VPlaza',
        description: 'The product you are looking for could not be found.',
      }
    }

    // Format price for display
    const formatPrice = (price) => {
      return Number.parseFloat(price).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    }

    // Fix image URL function
    const fixImageUrl = (url) => {
      if (!url) return "https://www.vplaza.com.ng/diverse-products-still-life.png"
      const doubleHttpsIndex = url.indexOf("https://", url.indexOf("https://") + 1)
      if (doubleHttpsIndex !== -1) {
        return url.substring(doubleHttpsIndex)
      }
      return url
    }

    const productImage = product.images && product.images.length > 0 
      ? fixImageUrl(product.images[0].url) 
      : "https://www.vplaza.com.ng/diverse-products-still-life.png"

    const formattedPrice = formatPrice(product.price)
    const shortDescription = product.description.length > 150 
      ? product.description.substring(0, 150) + "..." 
      : product.description

    return {
      title: `${product.name} - ${formattedPrice} | ${product.store} | VPlaza`,
      description: `Buy ${product.name} for ${formattedPrice} from ${product.store}. ${shortDescription}`,
      keywords: `${product.name}, ${product.category}, ${product.store}, VPlaza, online shopping, student marketplace, ${product.university || 'Nigeria'}`,
      
      openGraph: {
        type: 'product',
        siteName: 'VPlaza',
        title: `${product.name} - ${formattedPrice}`,
        description: `Get this amazing ${product.name} from ${product.store} for just ${formattedPrice}. ${shortDescription}`,
        url: `https://www.vplaza.com.ng/product/${productId}`,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `${product.name} - Product image`,
          },
        ],
        locale: 'en_NG',
        // Product-specific Open Graph tags
        'product:price:amount': product.price,
        'product:price:currency': 'NGN',
        'product:availability': 'in_stock',
        'product:condition': 'new',
        'product:retailer': product.store,
        'product:category': product.category,
      },
      
      twitter: {
        card: 'summary_large_image',
        site: '@VPlazaNG',
        creator: '@VPlazaNG',
        title: `${product.name} - ${formattedPrice} | VPlaza`,
        description: `Buy ${product.name} from ${product.store} for ${formattedPrice}. ${shortDescription}`,
        images: [productImage],
      },
      
      alternates: {
        canonical: `https://www.vplaza.com.ng/product/${productId}`,
      },

      // Additional SEO metadata
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // JSON-LD structured data for better SEO
      other: {
        'application/ld+json': JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": productImage,
          "brand": {
            "@type": "Brand",
            "name": product.store
          },
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "NGN",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": product.store
            }
          },
          "aggregateRating": product.average_rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.average_rating,
            "ratingCount": product.reviews_count || 1
          } : undefined,
          "category": product.category,
          "url": `https://www.vplaza.com.ng/product/${productId}`
        })
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product | VPlaza',
      description: 'Discover amazing products from local stores on VPlaza - Nigeria\'s student marketplace',
      openGraph: {
        title: 'Product | VPlaza',
        description: 'Discover amazing products from local stores on VPlaza',
        images: ['https://www.vplaza.com.ng/vplaza-og-image.png'],
      },
    }
  }
}

export default function Page({ params }) {
  return <ProductDetailPage />
}