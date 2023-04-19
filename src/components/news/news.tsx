import { INewItem } from '@/types/intrefaces';
import { Post } from '@/components/news/post';
import { Spinner } from '@/components/ui/spinner';

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

export default News;
