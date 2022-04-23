/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs/promises';
import frontMatter from 'front-matter';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItContainer from 'markdown-it-container';
/* @ts-expect-error - no types */
import markdownItIns from 'markdown-it-ins';
import markdownItKbd from 'markdown-it-kbd';
/* @ts-expect-error - no types */
import markdownItMark from 'markdown-it-mark';

const markdown = MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’'
});

// Add attributes plugin
markdown.use(markdownItAttrs, {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['class', 'id', 'style', 'title', /^data-/]
});
markdown.use(markdownItIns);
markdown.use(markdownItKbd);
markdown.use(markdownItMark);

// Add tip/warning callout syntaxes
['tip', 'warning', 'danger'].forEach(type => {
  markdown.use(markdownItContainer as MarkdownIt.PluginWithParams, type, {
    render: function (tokens: any, idx: number) {
      if (tokens[idx].nesting === 1) {
        return `<div role="alert" class="callout callout--${type}">`;
      }
      return '</div>\n';
    }
  });
});

// Add details syntax
markdown.use(markdownItContainer as MarkdownIt.PluginWithParams, 'details', {
  validate: (params: string) => params.trim().match(/^details\s+(.*)$/),
  render: (tokens: any, idx: number) => {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      return `<details>\n<summary><span>${markdown.utils.escapeHtml(m[1])}</span></summary>\n`;
    }
    return '</details>\n';
  }
});

/** Parses a markdown document with optional front matter. */
export async function parse(file: string) {
  const data = await fs.readFile(file, 'utf8');
  const { attributes, body } = frontMatter(data);

  return {
    frontMatter: attributes as Record<string, unknown>,
    content: body
  };
}

/** Renders a string of markdown. */
export function render(content: string) {
  return markdown.render(content);
}
