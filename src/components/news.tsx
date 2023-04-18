import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface INewsProps {
  list: string[];
}

const News = ({ list }: INewsProps) => {
  if (!list.length) return <Spinner />;
  return <div></div>;
};

export default News;
