'use client';

interface IBlogPostContentBlockClientProps {
  content: string;
}

const BlogPostContentBlockClient = ({ content }: IBlogPostContentBlockClientProps) => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div
          className="blog-post-content prose prose-lg max-w-none text-cBlack prose-headings:text-cBlack prose-p:text-cBlack/70 prose-p:text-[1.6rem] md:prose-p:text-[1.8rem] prose-headings:font-bold prose-h1:text-[2.4rem] md:prose-h1:text-[3.2rem] lg:prose-h1:text-[3.8rem] prose-h1:mb-6 md:prose-h1:mb-8 prose-p:mb-4 md:prose-p:mb-6 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
};

export default BlogPostContentBlockClient;

