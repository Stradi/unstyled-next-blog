import React from 'react';

import { findByType } from '@/lib/utils/react';

export interface ArticleHeaderProps extends React.ComponentPropsWithoutRef<'header'> {}
const ArticleHeader = React.forwardRef<HTMLElement, ArticleHeaderProps>(({ children, ...rest }, ref) => {
  return (
    <header ref={ref} {...rest}>
      {children}
    </header>
  );
});

export interface ArticleBodyProps extends React.ComponentPropsWithoutRef<'section'> {}
const ArticleBody = React.forwardRef<HTMLElement, ArticleBodyProps>(({ children, ...rest }, ref) => {
  return (
    <section ref={ref} {...rest}>
      {children}
    </section>
  );
});

export interface ArticleFooterProps extends React.ComponentPropsWithoutRef<'footer'> {}
const ArticleFooter = React.forwardRef<HTMLElement, ArticleFooterProps>(({ children, ...rest }, ref) => {
  return (
    <footer ref={ref} {...rest}>
      {children}
    </footer>
  );
});

export interface ArticleProps extends React.ComponentPropsWithoutRef<'article'> {}
function Article({ children, ...rest }: ArticleProps) {
  const articleHeader = findByType(children, ArticleHeader);
  const articleBody = findByType(children, ArticleBody);
  const articleFooter = findByType(children, ArticleFooter);

  return (
    <article {...rest}>
      {articleHeader}
      {articleBody}
      {articleFooter}
    </article>
  );
}

ArticleHeader.displayName = 'ArticleHeader';
ArticleFooter.displayName = 'ArticleFooter';
ArticleBody.displayName = 'ArticleBody';

export default Object.assign(Article, {
  Header: ArticleHeader,
  Body: ArticleBody,
  Footer: ArticleFooter,
});
