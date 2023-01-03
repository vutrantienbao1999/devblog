import React from 'react'
import {BlogPost} from '../types/blogs'
import BlogHeader from './BlogHeader'

const BlogReview: React.FC<BlogPost> = (props) => {
  const {bodyText, title, createdAt, author, tags} = props
  const previewText: string = `${bodyText.substring(0, 150)} ...`
  return (
    <section>
      <BlogHeader createdAt={createdAt} author={author} />
      <h2 className="font-bold">{title}</h2>
      <p className="mt-2">{previewText}</p>
      <div className="flex gap-3">
        {tags.map((tag, idx) => {
          return (
            <p
              key={idx}
              className="bg-sky-600 px-2 mt-2 font-semibold rounded-xl text-zinc-800"
            >
              {tag}
            </p>
          )
        })}
      </div>
    </section>
  )
}

export default BlogReview
