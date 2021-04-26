import React from 'react'
import { useRouteData } from 'react-static'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight'
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { Container, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { formatDate, blogImageUrl, blogImageWidth } from '../utils'

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
  return (
    <div>
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

      <Container text>
        {documentToReactComponents(body, richTextOptions)}
      </Container>
    </div>
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
