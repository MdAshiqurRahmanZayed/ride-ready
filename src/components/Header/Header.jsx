// Navbar.js
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Collapse,
  NavbarToggler,
} from "reactstrap";
import "./Header.css";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    token: state.token,
    user_type: state.user_type,
    // lengthRoomBooked: state.lengthRoomBooked,
    // userId: state.userId,
    // bookedRooms: state.bookedRooms,
  };
};

const Header = (props) => {
  // console.log(props.lengthRoom);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  let links;
  if (props.token ) {
    // console.log(props);
    if (props.user_type === `client`) {
      links = (
        <Nav>
          <NavItem>
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/all-booked">
              All booked Cars
            </NavLink>
          </NavItem>
        </Nav>
      );
    } else {
      links = (
        <Nav>
          <NavItem>
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/category">
              Category
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/vehicle">
              Vehicle
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/see-all-booked">
              See booked Vehicle
            </NavLink>
          </NavItem>
        </Nav>
      );
    }
  } else {
    links = (
      <NavItem>
        <Link className="nav-link" to="/signin">
          Signin
        </Link>
      </NavItem>
    );
  }
  return (
    <div>
      <Navbar className="navbar_color" light expand="md">
        <NavbarBrand tag={Link} to="/">
          Ride Ready
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            {links}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default connect(mapStateToProps)(Header);
