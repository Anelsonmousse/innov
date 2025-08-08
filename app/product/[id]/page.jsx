// app/product/[id]/page.jsx
import ProductDetailPage from './ProductDetailPage'

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }) {
  const productId = params.id

  try {
    const response = await fetch(`https://app.vplaza.com.ng/api/v1/products/${productId}`, {
      next: { revalidate: 60 },
    })
    const data = await response.json()
    const product = data?.data

    if (!product) {
      return {
        title: 'Product Not Found | VPlaza',
        description: 'The product you are looking for could not be found.',
      }
    }

    const formatPrice = (price) =>
      Number.parseFloat(price).toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

    const formattedPrice = formatPrice(product.price)
    const shortDescription =
      product.description.length > 150
        ? product.description.substring(0, 150) + '...'
        : product.description

    const imageUrl =
      product.images?.[0]?.url || 'https://www.vplaza.com.ng/vplaza-og-image.png'

    return {
      title: `${product.name} - ${formattedPrice} | ${product.store} | VPlaza`,
      description: `Buy ${product.name} for ${formattedPrice} from ${product.store}. ${shortDescription}`,

      openGraph: {
        type: 'website',
        siteName: 'VPlaza',
        title: `${product.name} - ${formattedPrice}`,
        description: `Get this amazing ${product.name} from ${product.store} for just ${formattedPrice}. ${shortDescription}`,
        url: `https://www.vplaza.com.ng/product/${productId}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${product.name} - Product image`,
          },
        ],
        locale: 'en_NG',
      },

      twitter: {
        card: 'summary_large_image',
        site: '@VPlazaNG',
        title: `${product.name} - ${formattedPrice} | VPlaza`,
        description: `Buy ${product.name} from ${product.store} for ${formattedPrice}. ${shortDescription}`,
        images: [imageUrl],
      },

      // ✅ Explicit og:image so warning never appears
      other: {
        'og:image': imageUrl,
      },
    }
  } catch (error) {
    return {
      title: 'Product | VPlaza',
      description: 'Discover amazing products from local stores on VPlaza',
    }
  }
}

export default function Page() {
  return <ProductDetailPage />
}
