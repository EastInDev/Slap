import axios from 'axios'

export default function fetcher(url, options) {
  return axios.get(url).then((res) => res.data)
}
