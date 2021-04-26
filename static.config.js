import path from 'path'
import { createClient } from 'contentful'

export default {
  getRoutes: async () => {
    const client = createClient({
      space: 'yjjqsazfmyk1',
      accessToken: 's-TZE9dEAmZySMN0dxcEbchmVba-vFiERmUctn4rLcM'
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
        path: `/post/${post.sys.id}`,
        template: 'src/containers/Post',
        getData: () => ({ post })
      }))
    }]
  },
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
