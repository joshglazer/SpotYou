import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div>
      <h2 className="bg-yellow inline-block my-8 p-3">
        You must have made a mistake...
      </h2>
    </div>
  </Layout>
)

export default NotFoundPage
