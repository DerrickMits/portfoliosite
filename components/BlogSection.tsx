"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, X } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "@/lib/types";

// Custom markdown components with proper typography spacing
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-display font-bold text-warm-900 dark:text-warm-100 mt-10 mb-6 first:mt-0 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-display font-bold text-warm-900 dark:text-warm-100 mt-10 mb-5 first:mt-0 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-display font-semibold text-warm-800 dark:text-warm-200 mt-8 mb-4">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-warm-700 dark:text-warm-300 leading-relaxed mb-5 last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-warm-900 dark:text-warm-100">
      {children}
    </strong>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-2 mb-6 text-warm-700 dark:text-warm-300 marker:text-warm-500 dark:marker:text-warm-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-2 mb-6 text-warm-700 dark:text-warm-300 marker:text-warm-500 dark:marker:text-warm-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1">{children}</li>
  ),
  hr: () => (
    <hr className="my-8 border-warm-200 dark:border-warm-700" />
  ),
  code: ({ children }) => (
    <code className="bg-warm-100 dark:bg-warm-800 text-warm-800 dark:text-warm-200 px-1.5 py-0.5 rounded-md text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-warm-100 dark:bg-warm-800 rounded-xl p-4 overflow-x-auto mb-6 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-warm-400 dark:border-warm-600 pl-4 my-6 italic text-warm-600 dark:text-warm-400">
      {children}
    </blockquote>
  ),
};

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (posts.length === 0) {
    return null;
  }

  const openModal = (post: BlogPost) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  return (
    <section id="blog" className="relative py-20 md:py-28 bg-cream dark:bg-deep">
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-4">
            Insights &amp; Thought Leadership
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Blog
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => openModal(post)}
              className="group cursor-pointer bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 p-6 md:p-8 hover:shadow-lg hover:border-warm-300 dark:hover:border-warm-700 transition-all duration-300"
            >
              <div className="flex items-center gap-4 text-xs text-warm-500 dark:text-warm-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-warm-900 dark:text-warm-100 mb-3 leading-snug">
                {post.title}
              </h3>
              <p className="text-warm-600 dark:text-warm-300 leading-relaxed mb-5">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-700 dark:text-warm-300 hover:text-warm-900 dark:hover:text-warm-100 transition-colors">
                Read More <ArrowRight className="w-4 h-4" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-warm-900 rounded-2xl shadow-2xl border border-warm-200 dark:border-warm-800"
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-warm-700 dark:text-warm-300" />
              </button>

              <div className="p-8 md:p-10">
                {/* Post metadata */}
                <div className="flex items-center gap-4 text-sm text-warm-500 dark:text-warm-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-warm-900 dark:text-warm-100 mb-8 leading-tight">
                  {selectedPost.title}
                </h1>

                {/* Markdown content */}
                <article className="max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {selectedPost.content}
                  </ReactMarkdown>
                </article>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}