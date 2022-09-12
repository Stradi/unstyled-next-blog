import fs from 'fs-extra';
import matter from 'gray-matter';

export interface FileWithDetails {
  content: string;
  details: fs.Stats;
  frontmatter?: {
    [key: string]: any;
  };
}

export const getFileWithDetails = async (
  filePath: fs.PathLike,
  parseFrontmatter?: boolean
): Promise<FileWithDetails> => {
  const content = await fs.readFile(filePath, 'utf-8');
  const details = await fs.stat(filePath);

  if (parseFrontmatter) {
    const parsed = matter(content);

    return {
      content: parsed.content,
      details,
      frontmatter: parsed.data,
    };
  }

  return {
    content,
    details,
  } as FileWithDetails;
};
