"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Marcellus, Jost } from "next/font/google";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { blogApi, type Blog } from "@/lib/api";
import { getBlogSlug } from "@/utils/helpers";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [moreBlogs, setMoreBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchBlogDetail(params.slug as string);
    }
  }, [params.slug]);

  // Update document title and meta tags when blog loads
  useEffect(() => {
    if (blog) {
      // Update page title
      document.title = blog.metaTitle || blog.title || "Blog";
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          blog.metaDescription || blog.h2Subtitle || blog.title
        );
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", blog.metaTitle || blog.title);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute(
          "content",
          blog.metaDescription || blog.h2Subtitle || blog.title
        );
      }
      
      if (blog.featuredImage) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute("content", blog.featuredImage);
        }
      }
    }
  }, [blog]);

  const fetchBlogDetail = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all blogs using existing API
      const response = await blogApi.getAll({
        page: 1,
        limit: 1000, // Get all blogs
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response && response.data) {
        // Find the blog that matches the slug
        const foundBlog = response.data.find((blog) => {
          // Normalize the slug from URL (remove leading/trailing slashes)
          const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
          
          // Check if blog has customSlug that matches
          if (blog.customSlug) {
            // Normalize customSlug (remove leading/trailing slashes)
            const normalizedCustomSlug = blog.customSlug.replace(/^\/+|\/+$/g, '');
            if (normalizedCustomSlug === normalizedSlug) {
              return true;
            }
          }
          
          // Otherwise, generate slug from title and compare
          const generatedSlug = blog.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          return generatedSlug === normalizedSlug;
        });

        if (foundBlog) {
          setBlog(foundBlog);
          
          // Set other blogs (excluding current blog) for the "More Blogs" section
          const otherBlogs = response.data
            .filter((b) => b._id !== foundBlog._id)
            .slice(0, 3); // Limit to 3 blogs
          setMoreBlogs(otherBlogs);
        } else {
          setError("Blog not found");
        }
      } else {
        setError("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtmlTags = (html: string) => {
    if (typeof document === 'undefined') return html; // SSR safety
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getExcerpt = (description: string, maxLength: number = 150) => {
    const text = stripHtmlTags(description);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c89e3a] animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 pt-40">
          <div className="text-center">
            <h1
              className={`text-3xl md:text-4xl text-[#2d2d2d] mb-4 ${marcellus.className}`}
            >
              {error || "Blog not found"}
            </h1>
            <button
              onClick={() => router.push("/blogs")}
              className={`inline-flex items-center gap-2 text-[#c89e3a] hover:text-[#9d7400] font-semibold transition-colors ${jost.className}`}
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .blog-content {
          color: #1a1a1a;
          line-height: 1.8;
          font-size: 1.0625rem;
        }
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 2rem 0 1rem;
          color: #1a1a1a;
        }
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin: 1.75rem 0 1rem;
          color: #1a1a1a;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 0.875rem;
          color: #1a1a1a;
        }
        .blog-content p {
          margin: 1rem 0;
          color: #374151;
        }
        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .blog-content li {
          margin: 0.5rem 0;
          color: #374151;
        }
        .blog-content blockquote {
          border-left: 4px solid #c89e3a;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        .blog-content strong {
          font-weight: 600;
          color: #1a1a1a;
        }
        .blog-content em {
          font-style: italic;
        }
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .blog-content a:hover {
          color: #1d4ed8;
        }
        .blog-content a.cta-button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #030822;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1.0625rem;
          transition: all 0.3s ease;
          margin: 20px 0;
          box-shadow: 0 2px 8px rgba(3, 8, 34, 0.2);
        }
        .blog-content a.cta-button * {
          color: #ffffff !important;
        }
        .blog-content a.cta-button:hover {
          background-color: #020615;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(3, 8, 34, 0.3);
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
      `}</style>
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto max-w-5xl px-4 pt-40 pb-6">
        <button
          onClick={() => router.push("/blogs")}
          className={`inline-flex items-center gap-2 text-[#c89e3a] hover:text-[#b8922e] font-medium transition-all ${jost.className} hover:gap-3`}
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </button>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto max-w-5xl px-4 pb-16">
        <AnimatedContainer direction="up">
          <div className="bg-white">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="w-full h-72 md:h-[500px] overflow-hidden rounded-lg mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] font-bold leading-tight mb-6 ${marcellus.className}`}
              >
                {blog.title}
              </h1>

              {/* H2 Subtitle */}
              {blog.h2Subtitle && (
                <h2
                  className={`text-lg md:text-xl text-gray-700 font-normal leading-relaxed mb-8 ${jost.className}`}
                >
                  {blog.h2Subtitle}
                </h2>
              )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 pb-8 mb-10 border-b-2 border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} className="text-[#c89e3a]" />
                <span className={`text-sm font-medium ${jost.className}`}>
                  By {blog.authorName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} className="text-[#c89e3a]" />
                <span className={`text-sm ${jost.className}`}>
                  {formatDate(blog.createdAt)}
                </span>
              </div>
            </div>

            {/* Blog Content (Rich Text HTML) */}
            <div
              className={`blog-content ${jost.className}`}
              dangerouslySetInnerHTML={{ __html: blog.content || blog.description }}
            />

            {/* Updated Date (if different from created) */}
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <div className="mt-12 pt-8 border-t-2 border-gray-100">
                <p className={`text-sm text-gray-500 italic ${jost.className}`}>
                  Last updated: {formatDate(blog.updatedAt)}
                </p>
              </div>
            )}
            </div>
          </div>
        </AnimatedContainer>

        {/* More Blogs Section */}
        {moreBlogs.length > 0 && (
          <div className="mt-20">
            <div className="mb-10">
              <h2
                className={`text-3xl md:text-4xl text-[#1a1a1a] font-bold text-center ${marcellus.className}`}
              >
                More Blogs
              </h2>
              <div className="w-20 h-1 bg-[#c89e3a] mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moreBlogs.map((moreBlog, index) => (
                <AnimatedContainer
                  key={moreBlog._id}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div
                    className="bg-white border border-gray-200 hover:border-[#c89e3a] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden"
                    onClick={() => router.push(`/blogs/${getBlogSlug(moreBlog)}`)}
                  >
                    {/* Featured Image */}
                    {moreBlog.featuredImage && (
                      <div className="w-full h-56 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={moreBlog.featuredImage}
                          alt={moreBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <h3
                        className={`text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#c89e3a] transition-colors line-clamp-2 ${marcellus.className}`}
                      >
                        {moreBlog.title}
                      </h3>

                      {moreBlog.h2Subtitle && (
                        <h4
                          className={`text-base text-gray-600 mb-4 line-clamp-2 ${jost.className}`}
                        >
                          {moreBlog.h2Subtitle}
                        </h4>
                      )}

                      <p
                        className={`text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed ${jost.className}`}
                      >
                        {getExcerpt(moreBlog.content || moreBlog.description)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} className="text-[#c89e3a]" />
                          <span className={jost.className}>
                            {moreBlog.authorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} className="text-[#c89e3a]" />
                          <span className={jost.className}>
                            {formatDate(moreBlog.createdAt)}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`mt-4 text-[#c89e3a] hover:text-[#b8922e] font-semibold text-sm transition-all flex items-center gap-2 group-hover:gap-3 ${jost.className}`}
                      >
                        Read More
                        <span className="text-lg">→</span>
                      </button>
                    </div>
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        )}

        {/* Navigation to other blogs */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push("/blogs")}
            className={`inline-flex items-center gap-2 px-8 py-3.5 bg-[#c89e3a] text-white hover:bg-[#b8922e] transition-all font-semibold text-base ${jost.className} shadow-md hover:shadow-lg`}
          >
            View All Blogs
          </button>
        </div>
      </article>
    </div>
    </>
  );
}
