import React from 'react'
import { useRouteData } from 'react-static'
import { Link } from 'components/Router'
import { Item, Container } from 'semantic-ui-react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { formatDate, blogImageUrl } from '../utils'

export default function Blog() {
  const { blog, posts } = useRouteData()
  return (
    <Container text>
      {documentToReactComponents(blog)}
      <Item.Group divided link>
        {posts.map(({ sys: { id }, fields: post }) => (
          <Item key={id} as={Link} to={`/blog/post/${id}/`}>
            <Item.Image size='small' src={blogImageUrl(post.thumbnail, { thumbnail: true})} />
            <Item.Content>
              <Item.Header as='h2' content={post.title} />
              <Item.Extra content={formatDate(post.postedOn)} />
              <Item.Description content={post.synopsis} />
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Container>
  )
}
