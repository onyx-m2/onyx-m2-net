import React, { useEffect } from 'react'
import { Root, Routes, addPrefetchExcludes, Head, useLocation } from 'react-static'
import { Container, Icon, Loader, Menu, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import { Link, Router } from './components/Router'
import Preview from './containers/Preview'
import GoogleAnalytics from 'react-ga'
import './app.css'

// Non-static routes need to be declared here
addPrefetchExcludes(['preview'])

GoogleAnalytics.initialize(process.env.UA_ID)

function App() {

  // send off pageview event when the location changes as the user navigates the site,
  // and note that going 'back' won't trigger an event
  const location = useLocation();
  useEffect(() => {
    GoogleAnalytics.pageview(location?.pathname || window.location.pathname)
  }, [location?.pathname])

  return (
    <Root>
      <Head>
        <title>Onyx M2</title>
        <meta name='google-site-verification' content='bec0McKsxEc8t_rsbvfndxeDxxpJLosxXwSszP_JGgI' />
      </Head>
      <NavMenu borderless fixed='top' inverted>
        <Container text>
          <Menu.Item as={NavLink} to="/">
            <Icon name='home' /> HOME
          </Menu.Item>
          <Menu.Item as={NavLink} to="/about">
            <Icon name='cogs'/> PROJECT
          </Menu.Item>
          <Menu.Item as={NavLink} to="/blog">
            <Icon name='book'/> BLOG
          </Menu.Item>
          <Menu.Item as='a' position='right' href='https://github.com/onyx-m2'>
            <Icon name='github'/> GITHUB
          </Menu.Item>
        </Container>
      </NavMenu>

      <Content>
        <React.Suspense fallback={<Loader active/>}>
          <Router>
            <ScrollToTop path='/'>
              <Routes path="*" />
            </ScrollToTop>
            <Preview path="preview" />
          </Router>
        </React.Suspense>
      </Content>

      <Footer inverted>
        © 2021 John McCalla
      </Footer>

    </Root>
  )
}

const NavMenu = styled(Menu)`
  margin-bottom: 0 !important;
  border-radius: 0 !important;
`

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent  }) => {
      return isCurrent ? {
        className: 'active item'
      } : {}
    }}
  />
);

const Content = styled.div`
  padding-top: 4em;
  padding-bottom: 1em;
  min-height: calc(100vh - 7.75em);
`

const Footer = styled(Segment)`
  text-align: right;
  color: rgba(255, 255, 255, 0.7) !important;
  border-radius: 0 !important;
  height: 3.5em;
`

// Router scrolling nonsense, this makes navigating the site "normal"
const ScrollToTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname])
  return children
}

export default App
