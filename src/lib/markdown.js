/**
 * Markdown to HTML converter for chat messages using the marked library
 */

import { marked } from 'marked';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
  sanitize: false, // We'll handle sanitization separately
  smartypants: false, // Disable smart quotes for consistency
});

/**
 * Convert markdown text to HTML using marked
 * @param {string} text - The markdown text to convert
 * @returns {string} - The converted HTML
 */
export function markdownToHtml(text) {
  if (!text) return '';
  
  try {
    return marked.parse(text);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Fallback to plain text with line breaks
    return text.replace(/\n/g, '<br>');
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 * This is a basic implementation - for production, consider using a library like DOMPurify
 * @param {string} html - The HTML to sanitize
 * @returns {string} - The sanitized HTML
 */
export function sanitizeHtml(html) {
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Convert markdown to safe HTML
 * @param {string} text - The markdown text to convert
 * @returns {string} - The converted and sanitized HTML
 */
export function markdownToSafeHtml(text) {
  const html = markdownToHtml(text);
  return sanitizeHtml(html);
}