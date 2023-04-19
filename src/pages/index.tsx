// import News, { INewsProps } from '@/components/news/news';
// import { getBaseUrl } from '@/utils/api';
// import { TNewsResponse } from '@/pages/api/news';

export default function Home() {
  return <div className="flex">{/*<News {...props} />*/}</div>;
}

// export async function getStaticProps() {
//   const res = await fetch(getBaseUrl() + '/api/news');
//   const news: TNewsResponse = await res.json();
//   if (news.message) {
//     return {
//       props: {
//         news: [],
//         message: news.message,
//       },
//     };
//   }
//
//   return {
//     props: {
//       news,
//     },
//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every 10 seconds
//     revalidate: 10, // In seconds
//   };
// }
