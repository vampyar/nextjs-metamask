import { INewItem } from '@/types/intrefaces';
import { Post } from '@/components/news/post';

export interface INewsProps {
  news: INewItem[];
}

const News = ({ news }: INewsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-4 ">
      {news.map((props, index) => (
        <Post key={index} {...props} />
      ))}
    </div>
  );
};

export default News;
