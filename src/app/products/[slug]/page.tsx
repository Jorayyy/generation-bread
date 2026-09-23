import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductPurchase from "@/components/ProductPurchase";
import ProductImage from "@/components/ProductImage";
import {
  getBusiness,
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
} from "@/lib/store";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Generation Bread`,
      description: product.description,
      url: `${SITE_URL}/products/${product.slug}`,
      type: "website",
      images: product.images[0]
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [business, category, relatedProducts] = await Promise.all([
    getBusiness(),
    getCategoryBySlug(product.category),
    getProducts(),
  ]);
  const related = relatedProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const jsonLd = [
    productJsonLd(product, business),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Shop", url: "/products" },
      { name: product.name, url: `/products/${product.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-cream-50">
        <div className="container-site py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-400">
              <li>
                <Link href="/" className="hover:text-brand-700 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-brand-700 transition-colors">
                  Shop
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="hover:text-brand-700 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-ink-800">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-cream-100 rounded-3xl overflow-hidden group">
                <ProductImage
                  src={product.images[0] ?? ""}
                  alt={product.name}
                  className="w-full h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 badge bg-white/95 text-brand-700">
                    {product.badge}
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1, 5).map((image, i) => (
                    <div
                      key={`${image}-${i}`}
                      className="relative aspect-square bg-cream-100 rounded-xl overflow-hidden group"
                    >
                      <ProductImage
                        src={image}
                        alt={`${product.name} view ${i + 2}`}
                        className="w-full h-full"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <ProductPurchase product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-white border-t border-ink-100">
          <div className="container-site">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="eyebrow mb-3">Keep exploring</span>
                <h2 className="font-display text-2xl lg:text-3xl text-ink-950">
                  You may also like
                </h2>
              </div>
              <Link href="/products" className="btn btn-ghost text-sm">
                View all
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
