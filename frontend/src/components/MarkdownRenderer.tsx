"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-normal prose-headings:text-paper-text dark:prose-headings:text-charcoal-text
      prose-h2:border-b prose-h2:border-paper-border dark:prose-h2:border-charcoal-border prose-h2:pb-2
      prose-table:border prose-table:border-paper-border dark:prose-table:border-charcoal-border prose-table:rounded-lg prose-table:overflow-hidden
      prose-th:bg-paper-secondary dark:prose-th:bg-charcoal-secondary prose-th:p-3 prose-th:font-mono prose-th:text-xs prose-th:uppercase
      prose-td:p-3 prose-td:border-t prose-td:border-paper-border dark:prose-td:border-charcoal-border prose-td:text-xs
      prose-blockquote:border-l-4 prose-blockquote:border-paper-sage dark:prose-blockquote:border-charcoal-sage prose-blockquote:bg-paper-secondary dark:prose-blockquote:bg-charcoal-secondary prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};