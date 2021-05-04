const BLOG_IMAGE_FULL_WIDTH = 700
const BLOG_IMAGE_HALF_WIDTH = 342

export function formatDate(text) {
  const date = new Date(text)
  return date.toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    year: 'numeric'
  })
}

export function blogImageWidth(asset) {
  if (asset.metadata.tags.some(x => x.sys.id === 'imageFullWidth')) {
    return BLOG_IMAGE_FULL_WIDTH
  }
  else if (asset.metadata.tags.some(x => x.sys.id === 'imageHalfWidth')) {
    return BLOG_IMAGE_HALF_WIDTH
  }
  return asset.fields.file.details.image.width
}

export function blogImageUrl(asset, options) {
  const queryOptions = []
  if (options) {
    const { thumbnail } = options
    if (thumbnail) {
      queryOptions.push(`w=150`)
      queryOptions.push(`h=150`)
      queryOptions.push(`fit=thumb`)
    }
  }
  else {
    const width = blogImageWidth(asset)
    queryOptions.push(`w=${width}`)
  }

  const fileUrl = asset.fields.file.url
  if (queryOptions.length > 0) {
    return fileUrl + '?' + queryOptions.join('&')
  }
  return fileUrl
}

export function toUri(text) {
  return encodeURIComponent(text.toLowerCase().replace(/\s/g, '-'))
}