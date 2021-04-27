import React from 'react'
import { useRouteData } from 'react-static'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight'
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { Container, Grid, Icon, Image, Menu, Segment } from 'semantic-ui-react'
import { formatDate, blogImageUrl, blogImageWidth } from '../utils'
import { Link } from '@reach/router'
import { useScrollingPosition } from '../components/Hooks'

const richTextOptions = {
  renderNode: {

    // render image assets
    [BLOCKS.EMBEDDED_ASSET]: ({ data: { target }}) =>
      <PostImage imageWidth={blogImageWidth(target)} rightPositioned={hasTag(target, 'blogImageRightPositioned')}>
        <Image fluid src={blogImageUrl(target)} alt={target.fields.title} />
        {hasTag(target, 'blogImageCaptioned') &&
        <PostImageCaption>{target.fields.title}</PostImageCaption>
        }
      </PostImage>,

    // fixup for code blocks being rendered with <p> parents (which isn't valid
    // html)
    [BLOCKS.PARAGRAPH]: ({ content }, children) => {
      if (content.length === 1 && content[0].marks.find(x => x.type === 'code')) {
        return <div>{children}</div>
      }
      return <p>{children}</p>
    }
  },

  renderMark: {

    // apply syntax highlighting to code blocks
    [MARKS.CODE]: text => {
      const { lang, snippet } = parseCodeSnippet(text)
      return (
        <SyntaxHighlighter style={vs} language={lang}>
          {snippet}
        </SyntaxHighlighter>
      )
    }
  }
}

export default () => {
  const { post } = useRouteData()
  return <Post post={post} />
}

export function Post(props) {
  const { post: { fields: { title, thumbnail, postedOn, body }}} = props
  const scrollPosition = useScrollingPosition()
  return (
    <div>
      {scrollPosition > 190 &&
        <SmallBanner title={title} />
      }
      <LargeBanner {...{title, thumbnail, postedOn}} />
      <Container text>
        {documentToReactComponents(body, richTextOptions)}
      </Container>
    </div>
  )
}

function LargeBanner(props) {
  const { title, thumbnail, postedOn } = props
  return (
    <TitleSegment inverted>
      <Container text>
        <Grid>
          <Grid.Column width={4}>
            <Image src={blogImageUrl(thumbnail, { thumbnail: true})} />
          </Grid.Column>
          <Grid.Column width={12}>
            <h1>{title}</h1>
            {formatDate(postedOn)}
          </Grid.Column>
        </Grid>
      </Container>
    </TitleSegment>
  )
}

function SmallBanner(props) {
  const { title } = props
  return (
    <Menu fixed='top' inverted>
      <Container text>
        <Menu.Item as={Link} to="/blog">
          <Icon name='chevron left'/>
        </Menu.Item>
        <Menu.Item header><Icon name='book' />{title.toUpperCase()}</Menu.Item>
      </Container>
    </Menu>
  )
}

const TitleSegment = styled(Segment)`
  border-radius: 0 !important;
  margin-top: -1em !important;
`

const PostImage = styled.div`
  width: ${props => props.imageWidth}px;
  display: inline-block !important;
  vertical-align: top !important;
  margin-bottom: 1em;
  margin-left: ${props => props.rightPositioned ? '1' : '0'}em;
`

const PostImageCaption = styled.p`
  color: rgba(55, 53, 47, 0.6);
  font-size: 90%;
`

function parseCodeSnippet(text) {
  const matches = text.match(/^\[(\w+)\]\n(.*)/s)
  if (matches) {
    return {
      lang: matches[1],
      snippet: matches[2]
    }
  }
  return {
    lang: 'javascript',
    snippet: text
  }
}

function hasTag(asset, tag) {
  return asset.metadata.tags.some(x => x.sys.id === tag)
}
