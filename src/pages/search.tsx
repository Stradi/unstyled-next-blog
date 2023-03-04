import { searchQuery } from '@/lib/utils/search';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  useEffect(() => {
    async function getResults() {
      const response = await searchQuery(query);
      if (response.hits.length === 0) {
        setResults(null);
        return;
      }

      setHasSearchedOnce(true);
      setResults(response.hits);
    }

    getResults();
  }, [query]);

  return (
    <div>
      <h1>Search</h1>
      <label htmlFor="search">Search Term:</label>
      <input id="search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      {results ? (
        <ul>
          {results.map((result) => {
            let href = '';
            if (result.document.type === 'page') {
              href = `/${result.document.slug}`;
            } else {
              href = `/${result.document.type}/${result.document.slug}`;
            }

            return (
              <Link key={result.id} href={href}>
                <li>{result.document.name}</li>
              </Link>
            );
          })}
        </ul>
      ) : (
        hasSearchedOnce && <p>No results found.</p>
      )}
    </div>
  );
}

Page.getSeo = function getSeo() {
  return {
    title: 'Search',
    description: 'Search for content on the site.',
  };
};
