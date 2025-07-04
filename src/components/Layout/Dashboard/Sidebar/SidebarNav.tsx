import {
  faAddressCard, faBell, faFileLines, faStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBug,
  faCalculator,
  faChartPie,
  faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faPuzzlePiece,
  faRightToBracket,
  faUsers, 
  faTags, 
  faCalendarCheck,
  faHouse,
  faHandsHolding
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

export default async function SidebarNav() {
  const dict = await getDictionary()
  return (
    <ul className="list-unstyled">

      <SidebarNavTitle>{dict.sidebar.items.pages}</SidebarNavTitle>


            <SidebarNavItem icon={faHouse} href="/">
            <span className="me-2">{dict.sidebar.items.home}</span>
            <small className="ms-auto">
            <Badge bg="danger">{dict.sidebar.items.home}</Badge>
            </small>
            </SidebarNavItem>


        <SidebarNavItem icon={faUsers} href="/users">
        <span className="me-2">{dict.sidebar.items.users}</span>
        <small className="ms-auto"><Badge bg="danger">{dict.sidebar.items.users}</Badge></small>
      </SidebarNavItem>

      <SidebarNavItem icon={faTags} href="/offers">
        <span className="me-2">{dict.sidebar.items.posts}</span>
        <small className="ms-auto"><Badge bg="danger">{dict.sidebar.items.posts}</Badge></small>
      </SidebarNavItem>

      <SidebarNavItem icon={faCalendarCheck} href="/reservations">
      <span className="me-2">{dict.sidebar.items.reservations}</span>
      <small className="ms-auto"><Badge bg="danger">{dict.sidebar.items.reservations}</Badge></small>
      </SidebarNavItem>

      <SidebarNavItem icon={faFileLines} href="/categories">
      <span className="me-2">{dict.sidebar.items.categories}</span>
      <small className="ms-auto"><Badge bg="danger">{dict.sidebar.items.categories}</Badge></small>
      </SidebarNavItem>

      {/* <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
        <small className="ms-auto"><Badge bg="info" className="ms-auto">NEW</Badge></small>
      </SidebarNavItem> */}
      {/* <SidebarNavItem icon={faCode} href="/pokemons">
        {dict.sidebar.items.sample}
        <small className="ms-auto"><Badge bg="danger" className="ms-auto">DEMO</Badge></small>
      </SidebarNavItem> */}
      {/* <SidebarNavTitle>{dict.sidebar.items.theme}</SidebarNavTitle> */}
      {/* <SidebarNavItem icon={faDroplet} href="#">{dict.sidebar.items.colors}</SidebarNavItem> */}
      {/* <SidebarNavItem icon={faPencil} href="#">{dict.sidebar.items.typography}</SidebarNavItem> */}
      {/* <SidebarNavTitle>{dict.sidebar.items.components}</SidebarNavTitle> */}

      {/* <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText={dict.sidebar.items.base}>
        <SidebarNavItem href="#">{dict.sidebar.items.accordion}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.breadcrumb}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.cards}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.carousel}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.collapse}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.list_group}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.navs}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.pagination}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.popovers}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.progress}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.scrollspy}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.spinners}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.tables}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.tabs}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.tooltips}</SidebarNavItem>
      </SidebarNavGroup> */}

      {/* <SidebarNavGroup toggleIcon={faLocationArrow} toggleText={dict.sidebar.items.buttons}>
        <SidebarNavItem href="#">{dict.sidebar.items.buttons}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.buttons_group}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.dropdowns}</SidebarNavItem>
      </SidebarNavGroup> */}

      {/* <SidebarNavItem icon={faChartPie} href="#">{dict.sidebar.items.charts}</SidebarNavItem> */}

      {/* <SidebarNavGroup toggleIcon={faFileLines} toggleText={dict.sidebar.items.forms}>
        <SidebarNavItem href="#">{dict.sidebar.items.form_control}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.select}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.checks_and_radios}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.range}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.input_group}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.floating_labels}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.layout}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.validation}</SidebarNavItem>
      </SidebarNavGroup> */}

      {/* <SidebarNavGroup toggleIcon={faStar} toggleText={dict.sidebar.items.icons}>
        <SidebarNavItem href="#">{dict.sidebar.items.core_ui_icons}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.core_ui_icons_brand}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.core_ui_icons_flag}</SidebarNavItem>
      </SidebarNavGroup> */}

      {/* <SidebarNavGroup toggleIcon={faBell} toggleText={dict.sidebar.items.notifications}>
        <SidebarNavItem href="#">{dict.sidebar.items.alerts}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.badge}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.modals}</SidebarNavItem>
        <SidebarNavItem href="#">{dict.sidebar.items.toasts}</SidebarNavItem>
      </SidebarNavGroup> */}
{/* 
      <SidebarNavItem icon={faCalculator} href="#">
        {dict.sidebar.items.widgets}
        <small className="ms-auto"><Badge bg="info">NEW</Badge></small>
      </SidebarNavItem> */}

      {/* <SidebarNavTitle>{dict.sidebar.items.extras}</SidebarNavTitle> */}

      {/* <SidebarNavGroup toggleIcon={faStar} toggleText={dict.sidebar.items.pages}>
        <SidebarNavItem icon={faRightToBracket} href="login">{dict.sidebar.items.login}</SidebarNavItem>
        <SidebarNavItem icon={faAddressCard} href="register">{dict.sidebar.items.register}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{dict.sidebar.items.error404}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{dict.sidebar.items.error500}</SidebarNavItem>
      </SidebarNavGroup> */}

      {/* <SidebarNavItem icon={faFileLines} href="#">{dict.sidebar.items.docs}</SidebarNavItem> */}
      {/* <SidebarNavItem icon={faLayerGroup} href="https://coreui.io/pro/">{dict.sidebar.items.try_core_ui_pro}</SidebarNavItem> */}
    </ul>
  )
}
