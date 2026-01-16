"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Book1, Document, Clock, TickCircle } from "iconsax-react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import type { ApplicableArticle } from "../data/enhanced-risk-calculator";

interface ApplicableArticlesProps {
  articles: ApplicableArticle[];
}

export function ApplicableArticles({ articles }: ApplicableArticlesProps) {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  const totalRequirements = articles.reduce((sum, art) => sum + art.requirements.length, 0);

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Book1 size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            EU AI Act Articles That Apply to You
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            {articles.length} articles with {totalRequirements} total requirements
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="mb-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 p-4">
        <p className="text-sm text-brand-800 dark:text-brand-200">
          Your AI systems must comply with the following EU AI Act articles. 
          Click each article to see detailed requirements and what you need to do.
        </p>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isExpanded={expandedArticle === article.id}
            onToggle={() => toggleExpand(article.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface ArticleCardProps {
  article: ApplicableArticle;
  isExpanded: boolean;
  onToggle: () => void;
}

function ArticleCard({ article, isExpanded, onToggle }: ArticleCardProps) {
  return (
    <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Article Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        {/* Article Number Badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
          <span className="text-lg font-bold text-brand-600">{article.number}</span>
        </div>

        {/* Article Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-primary dark:text-white sm:text-lg">
              Article {article.number}: {article.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tertiary dark:text-gray-400">
            <span className="inline-flex items-center gap-1 text-brand-500">
              <TickCircle size={14} color="currentColor" variant="Bold" />
              {article.requirements.length} requirements
            </span>
            <span className="inline-flex items-center gap-1 text-brand-500">
              <Document size={14} color="currentColor" variant="Bold" />
              {article.documentsNeeded.length} documents
            </span>
            <span className="inline-flex items-center gap-1 text-brand-500">
              <Clock size={14} color="currentColor" variant="Bold" />
              ~{article.documentsNeeded.length * 5}min
            </span>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {/* What It Says */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-xs">📜</span>
              What the Law Says
            </h4>
            <blockquote className="pl-4 border-l-2 border-brand-300 dark:border-brand-600 italic text-sm text-tertiary dark:text-gray-400 leading-relaxed">
              "{article.officialText}"
            </blockquote>
          </div>

          {/* What It Means */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-100 dark:bg-brand-900/30 text-xs">🎯</span>
              What This Means for You
            </h4>
            <p className="text-sm text-tertiary dark:text-gray-400 leading-relaxed">
              {article.plainExplanation}
            </p>
          </div>

          {/* Key Requirements */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-success-100 dark:bg-success-900/30 text-xs">✓</span>
              Your {article.requirements.length} Requirements
            </h4>
            <ul className="space-y-2">
              {article.requirements.map((req, index) => (
                <li key={req.id} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-xs font-semibold text-brand-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-primary dark:text-white">
                      {req.title}
                    </p>
                    <p className="text-xs text-tertiary dark:text-gray-400 mt-0.5">
                      {req.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Needed */}
          <div className="p-4 sm:p-5 bg-white dark:bg-gray-800">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30 text-xs">📄</span>
              Documents You'll Generate
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.documentsNeeded.map((doc, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  <span className="text-brand-500"><Document size={12} color="currentColor" variant="Bold" /></span>
                  {doc}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-tertiary dark:text-gray-500">
              Estimated time: {article.estimatedHours} hours manually, ~{article.documentsNeeded.length * 5} minutes with Protectron
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
