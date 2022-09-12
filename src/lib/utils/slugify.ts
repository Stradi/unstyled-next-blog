import generateSlug from 'slugify';

export const slugify = (text: string) => {
  return generateSlug(text, {
    lower: true,
  });
};
