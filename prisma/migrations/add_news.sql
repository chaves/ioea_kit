-- Migration: Add news tables
-- Date: 2026-10-16
-- Description: Public news (/news) managed from /auth/manager/news, same model as the SIOE site.

CREATE TABLE IF NOT EXISTS news_article (
  id INT NOT NULL AUTO_INCREMENT,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT NULL,
  image VARCHAR(255) NULL,
  imageFit VARCHAR(16) NOT NULL DEFAULT 'cover',
  imageFocusX INT NOT NULL DEFAULT 50,
  imageFocusY INT NOT NULL DEFAULT 28,
  published BOOLEAN NOT NULL DEFAULT false,
  publishedAt DATETIME(3) NULL,
  author VARCHAR(255) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  UNIQUE INDEX news_article_slug_key (slug),
  INDEX idx_news_article_published (published, publishedAt),
  PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_file (
  id INT NOT NULL AUTO_INCREMENT,
  articleId INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  label VARCHAR(255) NULL,
  size INT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX news_file_articleId_idx (articleId),
  PRIMARY KEY (id),
  CONSTRAINT news_file_articleId_fkey FOREIGN KEY (articleId) REFERENCES news_article(id) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
