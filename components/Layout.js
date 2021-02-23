import React from 'react';
import { Container } from 'semantic-ui-react';
// everything in this component will be moved into head tag
import Head from 'next/head';
import Header from './Header';

const Layout = (props) => {
  return(
    <Container>
      <Head>
        <link async rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.0.3/dist/semantic.min.css" />
        <script async src="//cdn.jsdelivr.net/npm/semantic-ui@2.0.3/dist/semantic.min.js"></script>
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};

export default Layout;
