import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'About',
    to: '/about',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Services',
    to: '/services',
    icon:  <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'MapService',
        to: '/services/mapservice',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'WMTS',
        to: '/services/wmts',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'WMS',
        to: '/services/wms',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'WFS',
        to: '/services/wfs',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'WPS',
        to: '/services/wps',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'CSW',
        to: '/services/csw',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Demo',
  },
  {
    component: CNavItem,
    name: 'View Map',
    to: '/viewmap',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Users-Role',
    to: '/setting/userrole',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Password',
    to: '/setting/password',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  {
    component: CNavTitle,
    name: 'Document',
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'http://10.222.3.84:1357/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
