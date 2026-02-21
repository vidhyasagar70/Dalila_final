"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Marcellus, Jost } from "next/font/google";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { blogApi, type Blog } from "@/lib/api";

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
  );
}
