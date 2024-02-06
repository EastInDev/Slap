import useSWR from 'swr'
import fetcher from './fetcher'

// posts: [
//   {
//     id,
//     title,
//     content,
//     created_at,
//     updated_at,
//     category_id,
//     total_count,
//     user: {
//       id,
//       nickname,
//     },
//     votes: [
//       {
//         id,
//         text,
//         count,
//       },
//     ],
//   },
// ]

export default function usePosts() {
  const { data, error, isLoading, mutate } = useSWR('/api/post', fetcher)

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate: mutate,
  }
}
