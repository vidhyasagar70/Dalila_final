/**
 * Slug utility functions for URL-safe string generation
 */

/**
 * Generates a URL-safe slug from a string
 * @param text - The text to convert to slug
 * @returns URL-safe slug string
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Gets the slug from a blog, using customSlug if available or generating from title
 * @param blog - Blog object with title and optional customSlug
 * @returns The slug to use for the blog
 */
export function getBlogSlug(blog: { title: string; customSlug?: string }): string {
  if (blog.customSlug) {
    // Remove leading/trailing slashes from customSlug
    return blog.customSlug.replace(/^\/+|\/+$/g, '');
  }
  return generateSlug(blog.title);
}
