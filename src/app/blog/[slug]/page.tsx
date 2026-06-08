import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";
import {
    ArrowLeft,
    Clock,
    User,
    Calendar,
    Tag,
    ChevronRight,
    Home,
    HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getAllBlogSlugs, getRelatedPosts } from "@/lib/data";
import type { BlogPost } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const SITE_URL = "https://siliconpower.com";

const categoryLabels: Record<string, string> = {
    "solar-components": "Solar – Components & Brands",
    "solar-installation": "Solar – Installation & Config",
    "crane-types": "Crane – Machine Types & Brands",
    "crane-parts": "Crane – Parts & Components",
    "case-studies": "Case Studies",
    "company-news": "Company News",
    faqs: "FAQs & Troubleshooting",
    "config-guides": "Configuration Guides",
};

const categoryColors: Record<string, string> = {
    "solar-components": "bg-amber-100 text-amber-700",
    "solar-installation": "bg-yellow-100 text-yellow-700",
    "crane-types": "bg-slate-200 text-slate-700",
    "crane-parts": "bg-gray-200 text-gray-700",
    "case-studies": "bg-blue-100 text-blue-700",
    "company-news": "bg-emerald-100 text-emerald-700",
    faqs: "bg-purple-100 text-purple-700",
    "config-guides": "bg-rose-100 text-rose-700",
};

// ─── Static Params (build-time generation) ─────────────────────────────────

export function generateStaticParams() {
    return getAllBlogSlugs().map((slug) => ({ slug }));
}

// ─── Dynamic Metadata (per-post SEO) ───────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt;
    const ogImage = post.ogImage || post.image;
    const canonicalUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;

    return {
        title,
        description,
        keywords: post.keywords || [],
        authors: [{ name: post.author, url: post.authorUrl }],
        publisher: "Silicon Power",
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.dateModified || post.date,
            authors: [post.author],
            tags: post.tags || [],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.imageAlt || post.title,
                    type: "image/png",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
            creator: "@siliconpower",
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

// ─── JSON-LD Helpers ────────────────────────────────────────────────────────

function buildBlogPostingJsonLd(post: BlogPost) {
    const canonicalUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        image: post.ogImage || post.image,
        url: canonicalUrl,
        datePublished: post.date,
        dateModified: post.dateModified || post.date,
        author: {
            "@type": "Person",
            name: post.author,
            url: post.authorUrl,
            jobTitle: post.authorJobTitle,
            image: post.authorImage,
        },
        publisher: {
            "@type": "Organization",
            name: "Silicon Power",
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.svg`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
        keywords: (post.keywords || []).join(", "),
        articleSection: post.category,
        wordCount: post.content?.split(/\s+/).length || 0,
    };
}

function buildBreadcrumbJsonLd(post: BlogPost) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${SITE_URL}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${SITE_URL}/blog/${post.slug}`,
            },
        ],
    };
}

function buildFaqJsonLd(post: BlogPost) {
    if (!post.faqItems || post.faqItems.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(post.id, 3);
    const canonicalUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    const faqLd = buildFaqJsonLd(post);

    return (
        <>
            {/* ✅ JSON-LD: BlogPosting — Google Article Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildBlogPostingJsonLd(post)),
                }}
            />

            {/* ✅ JSON-LD: BreadcrumbList — Google Breadcrumb Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildBreadcrumbJsonLd(post)),
                }}
            />

            {/* ✅ JSON-LD: FAQPage — Google FAQ Rich Results (if faqItems exist) */}
            {faqLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqLd),
                    }}
                />
            )}

            <article className="min-h-screen bg-white">
                {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
                <nav
                    aria-label="Breadcrumb"
                    className="px-4 sm:px-6 lg:px-8 py-3 bg-gray-50 border-b"
                >
                    <ol className="mx-auto max-w-4xl flex items-center gap-2 text-sm text-gray-500">
                        <li>
                            <Link
                                href="/"
                                className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                            >
                                <Home className="size-3.5" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="size-3.5 text-gray-300" />
                        </li>
                        <li>
                            <Link
                                href="/blog"
                                className="hover:text-amber-600 transition-colors"
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="size-3.5 text-gray-300" />
                        </li>
                        <li>
                            <span className="text-gray-900 font-medium line-clamp-1" aria-current="page">
                                {post.title}
                            </span>
                        </li>
                    </ol>
                </nav>

                {/* ─── Hero Image ─────────────────────────────────────────────── */}
                <header className="relative">
                    <div className="mx-auto max-w-4xl">
                        <div className="relative aspect-[2/1] w-full overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.imageAlt || post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 896px"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <Badge
                                    className={`mb-3 text-xs font-bold border-0 ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}
                                >
                                    {categoryLabels[post.category] || post.category}
                                </Badge>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                                    {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                    {/* ✅ SEO: Author with link */}
                                    {post.authorUrl ? (
                                        <Link
                                            href={post.authorUrl}
                                            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                                        >
                                            {post.authorImage && (
                                                <Image
                                                    src={post.authorImage}
                                                    alt={post.author}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <User className="size-3.5" />
                                            <span>{post.author}</span>
                                            {post.authorJobTitle && (
                                                <span className="text-gray-400 text-xs hidden sm:inline">
                                                    — {post.authorJobTitle}
                                                </span>
                                            )}
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-1.5">
                                            <User className="size-3.5" />
                                            {post.author}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-3.5" />
                                        {post.readTime}
                                    </span>
                                    <time dateTime={post.date} className="flex items-center gap-1.5">
                                        <Calendar className="size-3.5" />
                                        {new Date(post.date).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </time>
                                    {post.dateModified && post.dateModified !== post.date && (
                                        <span className="text-xs text-gray-400">
                                            (Updated:{" "}
                                            <time dateTime={post.dateModified}>
                                                {new Date(post.dateModified).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </time>
                                            )
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Article Body ───────────────────────────────────────────── */}
                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Excerpt */}
                    <p className="text-lg text-gray-700 leading-relaxed font-medium mb-8 border-l-4 border-amber-400 pl-4">
                        {post.excerpt}
                    </p>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-gray-600 leading-relaxed">{post.content}</p>
                    </div>

                    {/* ✅ SEO: Tags Section */}
                    {post.tags && post.tags.length > 0 && (
                        <section className="mb-10 border-t pt-6" aria-label="Article tags">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Tag className="size-4 text-amber-500" />
                                Related Topics
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-gray-600 border-gray-300 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-colors"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ✅ SEO: FAQ Section with Structured Data */}
                    {post.faqItems && post.faqItems.length > 0 && (
                        <section className="mb-10 border-t pt-6" aria-label="Frequently asked questions">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <HelpCircle className="size-5 text-amber-500" />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {post.faqItems.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                                        open={index === 0}
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-base font-semibold text-gray-900 hover:text-amber-600 transition-colors list-none">
                                            <span>{faq.question}</span>
                                            <ChevronRight className="size-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                                        </summary>
                                        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ✅ SEO: Share Buttons (Client Component — no server error) */}
                    <ShareButtons title={post.title} url={canonicalUrl} />

                    {/* ✅ SEO: Related Posts (Internal Linking — CRITICAL) */}
                    {relatedPosts.length > 0 && (
                        <section className="border-t pt-8 mb-8" aria-label="Related articles">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {relatedPosts.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                        className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            <Image
                                                src={related.image}
                                                alt={related.imageAlt || related.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <Badge
                                                className={`mb-2 text-[10px] font-bold border-0 ${categoryColors[related.category] || "bg-gray-100 text-gray-700"}`}
                                            >
                                                {categoryLabels[related.category] || related.category}
                                            </Badge>
                                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                {related.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA: Back to Blog */}
                    <div className="text-center pt-4 pb-8">
                        <Link href="/blog">
                            <Button
                                variant="outline"
                                className="border-amber-500 text-amber-600 hover:bg-amber-50 font-bold"
                            >
                                <ArrowLeft className="size-4 mr-2" />
                                Back to All Articles
                            </Button>
                        </Link>
                    </div>
                </main>
            </article>
        </>
    );
}