import React from 'react';
import { INewItem } from '@/types/intrefaces';

export const Post = ({ url, title, date, description }: INewItem) => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
        <div className="p-5">
          <a href={url} target="_blank">
            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">{title}</h5>
          </a>
          <p className="font-normal text-gray-700 mb-3">{description}</p>
          <div className="flex justify-between items-center">
            <a
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
              target="_blank"
              href={url}
            >
              Read more
            </a>
            <p className="text-xs">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
