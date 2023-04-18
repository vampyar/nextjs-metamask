import News from '@/components/news';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <News />
    </main>
  );
}

export async function getStaticProps() {
  const res = await fetch('/api/news');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
