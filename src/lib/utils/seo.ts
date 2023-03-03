export function getTitle(seo: TPageSeo) {
  let title = seo.title;
  if (seo.titleTemplate) {
    title = seo.titleTemplate.replace(/%s/g, seo.title);
  }

  return title;
}

export function getRobots(seo: TPageSeo) {
  let robots = '';
  if (seo.noindex) {
    robots += 'noindex';
  } else {
    robots += 'index';
  }

  robots += ', ';

  if (seo.nofollow) {
    robots += 'nofollow';
  } else {
    robots += 'follow';
  }

  return robots;
}
