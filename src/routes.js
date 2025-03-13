import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const About = React.lazy(() => import('./views/about/About'))
const WMTS = React.lazy(() => import('./views/services/wmts'))
const WMS = React.lazy(() => import('./views/services/wms'))
const WFS = React.lazy(() => import('./views/services/wfs'))
const WPS = React.lazy(() => import('./views/services/wps'))
const CSW = React.lazy(() => import('./views/services/csw'))
const VBDMapService = React.lazy(() => import('./views/services/vbdMapService'))
const ViewMap = React.lazy(() => import('./views/services/viewMap'))
const UserRole = React.lazy(() => import('./views/userRole/UserRole'))
const UpdatePassword = React.lazy(() => import('./views/userRole/Password'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/about', name: 'About', element: About },
  { path: '/services/wmts', name: 'wmts', element: WMTS },
  { path: '/services/wms', name: 'wms', element: WMS },
  { path: '/services/wfs', name: 'wfs', element: WFS },
  { path: '/services/wps', name: 'wps', element: WPS },
  { path: '/services/csw', name: 'csw', element: CSW },
  { path: '/services/mapservice', name: 'vbdMapService', element: VBDMapService },
  { path: '/viewmap', name: 'viewMap', element: ViewMap },
  { path: '/setting/userrole', name: 'Users-Role', element: UserRole },
  { path: '/setting/password', name: 'Password', element: UpdatePassword },
]

export default routes
