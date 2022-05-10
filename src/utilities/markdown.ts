/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs/promises';
import frontMatter from 'front-matter';
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
/* @ts-expect-error - no types */
import markdownItIns from 'markdown-it-ins';
import markdownItKbd from 'markdown-it-kbd';
/* @ts-expect-error - no types */
import markdownItMark from 'markdown-it-mark';

interface RenderOptions {
  preserveHandlebars: boolean;
}

const markdown = MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false
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

// Add aside syntax
markdown.use(markdownItContainer as MarkdownIt.PluginWithParams, 'aside', {
  render: function (tokens: any, idx: number) {
    if (tokens[idx].nesting === 1) {
      return `<aside>`;
    }
    return '</aside>\n';
  }
});

// Add cover syntax
markdown.use(markdownItContainer as MarkdownIt.PluginWithParams, 'cover', {
  render: function (tokens: any, idx: number) {
    if (tokens[idx].nesting === 1) {
      return `<div class="docs-cover">`;
    }
    return '</div>\n';
  }
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
export function render(content: string, options?: Partial<RenderOptions>) {
  const opts: RenderOptions = {
    preserveHandlebars: true,
    ...options
  };

  if (!opts.preserveHandlebars) {
    return markdown.render(content);
  }

  // Temporarily replace Handlebars brackets with placeholders while we render the markdown
  let html = content
    .replace(/{{{/g, 'DOXICITY_RAW_START')
    .replace(/}}}/g, 'DOXICITY_RAW_END')
    .replace(/{{>/g, 'DOXICITY_PARTIAL_START')
    .replace(/{{#/g, 'DOXICITY_BLOCK_START')
    .replace(/{{#>/g, 'DOXICITY_BLOCK_PARTIAL_START')
    .replace(/{{/g, 'DOXICITY_START')
    .replace(/}}/g, 'DOXICITY_END');

  html = markdown.render(html);

  // Restore the original brackets
  return html
    .replace(/DOXICITY_RAW_START/g, '{{{')
    .replace(/DOXICITY_RAW_END/g, '}}}')
    .replace(/DOXICITY_PARTIAL_START/g, '{{>')
    .replace(/DOXICITY_BLOCK_START/g, '{{#')
    .replace(/DOXICITY_BLOCK_PARTIAL_START/g, '{{#>')
    .replace(/DOXICITY_START/g, '{{')
    .replace(/DOXICITY_END/g, '}}');
}
