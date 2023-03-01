import generateSlug from 'slugify';

export function slugify(text: string) {
  return generateSlug(text, {
    lower: true,
  });
}
