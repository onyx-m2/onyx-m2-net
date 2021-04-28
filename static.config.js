import path from 'path'
import { createClient } from 'contentful'
import { toUri } from './src/utils'
import dotenv from 'dotenv'
dotenv.config()

export default {

  siteRoot: process.env.SITE_ROOT,

  getRoutes: async () => {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE,
      accessToken: process.env.CONTENTFUL_TOKEN
    })
    const { items } = await client.getEntries({
      order: 'sys.createdAt'
    })
    const [ { fields: { body: blog }} ] = items.filter(x => x.fields.name === 'Blog')
    const posts = items.filter(x => x.sys.contentType.sys.id === 'blogPost')
    return [{
      path: '/blog',
      getData: () => ({ blog, posts }),
      children: posts.map(post => ({
        path: `/post/${toUri(post.fields.title)}`,
        template: 'src/containers/Post',
        getData: () => ({ post })
      }))
    }]
  },

  plugins: [
    [ require.resolve('react-static-plugin-source-filesystem'),
      { location: path.resolve('./src/pages') }
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
    require.resolve('@elbstack/react-static-plugin-dotenv')
  ],
}
