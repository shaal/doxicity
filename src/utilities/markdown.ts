import fs from 'fs/promises';
import frontMatter from 'front-matter';
import MarkdownIt from 'markdown-it';

export const markdown = MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’'
});

export async function parse(file: string) {
  const data = await fs.readFile(file, 'utf8');
  const { attributes, body } = frontMatter(data);

  return {
    frontMatter: attributes as Record<string, unknown>,
    content: body
  };
}
