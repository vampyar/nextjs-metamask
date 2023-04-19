import News, { INewsProps } from '@/components/news/news';
import { getBaseUrl } from '@/utils/api';

export default function Home({ news }: INewsProps) {
  return (
    <div className="flex">
      <News news={news} />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(getBaseUrl() + '/api/news');
  const news = await res.json();

  return {
    props: {
      news,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
