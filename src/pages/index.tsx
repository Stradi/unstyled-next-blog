export default function Page() {
  return <div>Hi</div>;
}

Page.getSeo = function getSeo() {
  return {
    titleTemplate: '',
    title: 'Unstyled Next Blog',
    description: 'This is the home page',
  } as TPageSeo;
};
