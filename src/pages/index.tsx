import { getBaseUrl } from '@/utils/api';
import { TNewsResponse } from '@/pages/api/news';
import { GetServerSideProps } from 'next';
import { INewItem } from '@/types/intrefaces';
import { Spinner } from '@/components/ui/spinner';
import { Post } from '@/components/news/post';

export interface INewsProps {
  news: INewItem[];
  message?: string;
}

const News = ({ news, message }: INewsProps) => {
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
};

export default function Home(props: INewsProps) {
  return (
    <>
      <div className="flex">
        <News {...props} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const client = await fetch(getBaseUrl() + '/api/news');
  const news: TNewsResponse = await client.json();
  if (news.message) {
    return {
      props: {
        ...params,
        news: [],
        message: news.message,
      },
    };
  }

  return {
    props: {
      ...params,
      news,
    },
  };
};
