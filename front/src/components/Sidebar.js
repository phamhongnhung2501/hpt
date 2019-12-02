import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import { Badge } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import routes from "../routes/index";
import { CustomImg } from "../components/CustomTag";
import { Settings, Users, Cpu } from "react-feather";

const SidebarItem = withRouter(
  ({ name, badgeColor, badgeText, icon: Icon, location, to }) => {
    const getSidebarItemClass = path => {
      return location.pathname === path ? "active" : "";
    };

    return (
      <li className={"sidebar-item " + getSidebarItemClass(to)}>
        <NavLink to={to} className="sidebar-link" activeClassName="active">
          {Icon ? <Icon size={18} className="align-middle mr-3" /> : null}
          {name}
          {badgeColor && badgeText ? (
            <Badge color={badgeColor} size={18} className="sidebar-badge">
              {badgeText}
            </Badge>
          ) : null}
        </NavLink>
      </li>
    );
  }
);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggle = index => {
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

  componentWillMount() {
    /* Open collapse element that matches current url */
    const pathName = this.props.location.pathname;

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      const isOpen = route.open;
      const isHome = route.containsHome && pathName === "/";

      this.setState(() => ({
        [index]: isActive || isOpen || isHome
      }));
    });
  }

  render() {
    const { sidebar, layout } = this.props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const name = userInfo.full_name;
    const avatar = userInfo.photo;
    const isAdmin = userInfo.is_admin;
    console.log("SideBar", isAdmin);

    if (name === undefined || avatar === undefined) {
      return (
        <div> </div>
      );
    } else
      return (
        <nav
          className={
            "sidebar" +
            (!sidebar.isOpen ? " toggled" : "") +
            (sidebar.isSticky ? " sidebar-sticky" : "")
          }
        >
          <div className="sidebar-content">
            <PerfectScrollbar>
              <a className="sidebar-brand" href="/stations">
                <div className="float-left mr-1 mb-2">
                  <img  src="https://image.flaticon.com/icons/svg/119/119070.svg" width={40} height={40} />
                </div>
                <span className="align-middle">Hospital station</span>
              </a>

              <ul className="sidebar-nav">
                <React.Fragment>
                  <SidebarItem
                    name="Dashboard"
                    to="/dashboard"
                    icon={Cpu}
                  />
                  <SidebarItem
                    name="Profile"
                    to="/profile"
                    icon={Users}
                  />
                  {isAdmin ?
                    <SidebarItem
                      name="Admin"
                      icon={Settings}
                      to="/stations/admin"
                    />
                    : null
                  }
                </React.Fragment>
              </ul>

              {!layout.isBoxed && !sidebar.isSticky ? (
                <div className="sidebar-bottom d-none d-lg-block">
                  <div className="media">
                    <CustomImg
                      className="rounded-circle mr-3"
                      src={avatar}
                      alt="Avatar"
                      width="40"
                      height="40"
                    />
                    <div className="media-body">
                      <h5 className="mb-1">{name.length < 20 ? name : name.substring(0, 20)}</h5>
                      <div>
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="text-success"
                        />{" "}
                        Online
                            </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </PerfectScrollbar>
          </div>
        </nav>
      );
  }
}

export default withRouter(
  connect(store => ({
    sidebar: store.sidebar,
    layout: store.layout
  }))(Sidebar)
);
