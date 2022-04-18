import slugify from 'slugify';

/** Creates a slug from an arbitrary string of text. */
export function createSlug(text: string) {
  return slugify(String(text), {
    remove: /[^\w|\s]/g,
    lower: true
  });
}
