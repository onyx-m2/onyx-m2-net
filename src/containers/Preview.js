import React, { useEffect, useState } from 'react'
import { createClient } from 'contentful'
import { Post } from './Post'
import { Loader } from 'semantic-ui-react'

const client = createClient({
  host: 'preview.contentful.com',
  space: 'yjjqsazfmyk1',
  accessToken: '4ab5SHy2UIK_qoWH7djEoTgS2UvwKSH0Mm_d3k258Mo'
})

export default () => {

  // NOTE: useLocation is broken in react-static, which is why it's not being used here.
  // See https://github.com/react-static/react-static/issues/1279
  const entryId = window.location.search.slice(1)
  const [ entry, setEntry ] = useState()

  useEffect(() => {
    async function getData() {
      const entry = await client.getEntry(entryId)
      setEntry(entry)
    }
    getData()
  }, [])

  return entry
    ? <Post post={entry} />
    : <Loader size='big' active />
}
