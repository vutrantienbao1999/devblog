import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '../styles/Home.module.css'
import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next'
import {getBlogs} from '../server/blogs'
import {BlogPost} from '../types/blogs'
import BlogReview from '../components/BlogReview'
import {useMemo, useState} from 'react'

const inter = Inter({subsets: ['latin']})

const Home: NextPage = ({
  blogData,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filterTag, setFilterTag] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number[]>([])
  const filterBlog: BlogPost[] = useMemo(() => {
    return filterTag.length > 0
      ? blogData.filter((blog: BlogPost) => {
          return filterTag.every((tag) => blog.tags.includes(tag))
        })
      : blogData
  }, [filterTag])
  const filterLabel = (tag: any, idx: number) => {
    if (selectedIdx.includes(idx)) {
      setSelectedIdx(selectedIdx.filter((id) => id !== idx))
      setFilterTag(filterTag.filter((text) => text !== tag.innerText))
    } else {
      setSelectedIdx([...selectedIdx, idx])
      setFilterTag([...filterTag, tag.innerText])
    }
  }

  return (
    <main className="layout">
      <title> Home Page </title>
      <section>
        <div className="mt-3 text-center">
          <h1 className="text-[3rem]"> Welcome to DevBlog </h1>
          <p> A full-stack blog made Next.js, TailwindCSS, Github GraphQL </p>
        </div>
      </section>
      <section className="flex flex-col items-center text-[1.15rem] mt-12">
        <div className="flex gap-3 mb-12">
          {tags.map((tag: string, idx: number) => {
            return (
              <button
                key={idx}
                className={`${
                  selectedIdx.includes(idx)
                    ? 'label-selected hover:bg-sky-400 transition-all duration-300'
                    : 'label hover:bg-sky-400 transition-all duration-300'
                }`}
                onClick={(e) => filterLabel(e.target, idx)}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {filterBlog.map((blog: BlogPost) => {
          return (
            <div
              key={blog.id}
              className="max-w-[28em] max-h-[20em] overflow-hidden mx-6 mb-6 bg-neutral-300 text-zinc-800 rounded-lg p-4 hover:bg-neutral-500 hover:text-neutral-300"
            >
              <a href={blog.url} target="_blank" rel="noreferrer">
                <BlogReview
                  title={blog.title}
                  bodyText={blog.bodyText}
                  createdAt={blog.createdAt}
                  author={blog.author}
                  tags={blog.tags}
                />
              </a>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default Home
export const getServerSideProps: GetServerSideProps = async () => {
  let blogs: BlogPost[] = await getBlogs()
  let tags: string[] = []
  recursionBlogs(blogs, tags)
  return {
    props: {
      blogData: blogs,
      tags: tags,
    },
  }
}

function recursionBlogs(array: any[], tags: string[], length = 0) {
  if (array.length === length) return 0

  if (Array.isArray(array[length].tags)) {
    recursionBlogs(array[length].tags, tags)
  } else {
    const tag: string = array[length]
    if (!tags.includes(tag)) {
      tags.push(tag)
    }
  }

  recursionBlogs(array, tags, length + 1)
}
