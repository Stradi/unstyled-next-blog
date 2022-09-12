import path from 'path';
import { Node, visit } from 'unist-util-visit';

export interface Options {
  publicPath: string;
}

interface NodePosition {
  start: {
    line: number;
    column: number;
    offset: number;
  };
  end: {
    line: number;
    column: number;
    offset: number;
  };
}

interface ImageNode {
  type: string;
  title: string;
  url: string;
  alt: string;
  position: NodePosition;
}

export const remarkNextImage = ({ publicPath }: Options) => {
  if (!publicPath) {
    throw new Error(
      '`publicPath` option is missing in "remark-next-image" plugin.'
    );
  }

  const visitor = (node: ImageNode) => {
    node.url = path.join(publicPath, node.url).toString().replaceAll('\\', '/');
  };

  const transform = (tree: Node) => {
    visit(tree, 'image', visitor);
  };

  return transform;
};
