import { getBaseUrl } from '@/utils/api';
import { TNewsResponse } from '@/pages/api/news';
import { Spinner } from '@/components/ui/spinner';
import { Post } from '@/components/news/post';
import { INewItem } from '@/types/intrefaces';

export interface INewsProps {
  news: INewItem[];
  message?: string;
}

export default function Home({ message, news }: INewsProps) {
  if (!news.length) {
    return (
      <div>
        <Spinner />
        <h2>{message}</h2>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-4 gap-4 ">
      {news.map((props, index) => (
        <Post key={index} {...props} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(getBaseUrl() + '/api/news');
  const news: TNewsResponse = await res.json();
  if (news?.message) {
    return {
      props: {
        news: [],
        message: news.message,
      },
    };
  }

  return {
    props: {
      news: news || [],
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
