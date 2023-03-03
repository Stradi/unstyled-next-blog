import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    {
      href: string;
      label: string;
    }[]
  >([]);

  const pathname = usePathname();

  useEffect(() => {
    function deslugify(str) {
      return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const items: {
      href: string;
      label: string;
    }[] = [];

    const paths = pathname.split('/').filter((p) => p !== '');
    paths.forEach((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = deslugify(path);
      items.push({ href, label });
    });

    setBreadcrumbItems(items);
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb">
      <ul>
        {breadcrumbItems.map((item, index) => (
          <li key={item.href}>
            {item.label}
            {index < breadcrumbItems.length - 1 && <span aria-hidden="true">{' > '}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
