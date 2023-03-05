import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface MDXRendererProps {
  content: MDXRemoteSerializeResult;
}

const components = {};

export default function MDXRenderer({ content }: MDXRendererProps) {
  return <MDXRemote components={components} {...content} />;
}
