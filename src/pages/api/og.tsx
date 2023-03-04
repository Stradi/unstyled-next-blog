import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { default as _config } from '@/config';

export const config = {
  runtime: 'edge',
};

const TYPE_TO_TEXT = {
  page: '',
  post: 'Article',
  tag: 'Tag',
  author: 'Author',
};

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get('type') || 'page';
  const title = searchParams.get('title') || _config.site.defaultSeo.title;
  const subtitle = searchParams.get('subtitle') || '';
  const width = Number.parseInt(searchParams.get('width')) || 1200;
  const height = Number.parseInt(searchParams.get('height')) || 630;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'black',
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            color: '#2e2e2e',
          }}
        >
          <p
            style={{
              fontSize: width * 0.025,
            }}
          >
            {TYPE_TO_TEXT[type] || ''}
          </p>
        </div>
        <div
          style={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: width * 0.045,
            }}
          >
            {title}
          </h1>
          <h2
            style={{
              fontSize: width * 0.025,
              color: '#7e7e7e',
            }}
          >
            {subtitle}
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            color: '#2e2e2e',
          }}
        >
          <p
            style={{
              fontSize: width * 0.01,
            }}
          >
            Built using Unstyled Next Blog
          </p>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
