import { Route } from 'react-router-dom'
import { Router } from '../../lib/electron-router-dom'
import { Blank } from './pages/blank'
import { Document } from './pages/document'
import { Layout } from './Layout'

export function Routes() {
  return (
    <Router
      main={
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Blank />} />
          <Route path="/document" element={<Document />} />
        </Route>
      }
    />
  )
}
