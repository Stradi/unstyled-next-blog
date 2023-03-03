import { search, load, create } from '@lyrasearch/lyra';

let index = null;

export async function searchQuery(query: string, limit = 10) {
  await loadIndex();

  return await search(index, {
    term: query,
    limit,
  });
}

async function loadIndex() {
  if (index) return;

  const indexData = await (await fetch('/search-index.json')).json();
  index = await create({
    schema: {
      type: 'string',
      name: 'string',
      slug: 'string',
      description: 'string',
      content: 'string',
    },
    edge: true,
  });
  await load(index, indexData);
}
