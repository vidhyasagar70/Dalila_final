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
    if (params.id) {
      fetchBlogDetail(params.id as string);
    }
  }, [params.id]);

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

  const fetchBlogDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogApi.getById(id);

      if (response && response.data) {
        setBlog(response.data);
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
        <div className="container mx-auto max-w-4xl px-4 py-32">
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
    <div className="bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-4">
        <button
          onClick={() => router.push("/blogs")}
          className={`inline-flex items-center gap-2 text-[#c89e3a] hover:text-[#9d7400] font-semibold transition-colors ${jost.className}`}
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto max-w-4xl px-4 py-8">
        <AnimatedContainer direction="up">
          <div className="bg-white rounded-none shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
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
            
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl text-[#2d2d2d] font-normal tracking-tight mb-4 ${marcellus.className}`}
              >
                {blog.title}
              </h1>

              {/* H2 Subtitle */}
              {blog.h2Subtitle && (
                <h2
                  className={`text-xl md:text-2xl text-gray-600 font-normal mb-6 ${jost.className}`}
                >
                  {blog.h2Subtitle}
                </h2>
              )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span className={`text-sm font-medium ${jost.className}`}>
                  {blog.authorName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span className={`text-sm ${jost.className}`}>
                  {formatDate(blog.createdAt)}
                </span>
              </div>
            </div>

            {/* Blog Content (Rich Text HTML) */}
            <div
              className={`prose prose-lg max-w-none ${jost.className}`}
              style={{
                color: "#4a4a4a",
                lineHeight: "1.8",
              }}
              dangerouslySetInnerHTML={{ __html: blog.content || blog.description }}
            />

            {/* Updated Date (if different from created) */}
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className={`text-sm text-gray-500 ${jost.className}`}>
                  Last updated: {formatDate(blog.updatedAt)}
                </p>
              </div>
            )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Navigation to other blogs */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/blogs")}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-[#c89e3a] text-white rounded-none hover:bg-[#9d7400] transition-colors font-semibold ${jost.className}`}
          >
            View All Blogs
          </button>
        </div>
      </article>
    </div>
  );
}
