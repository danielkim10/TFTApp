import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
         UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
        } from 'reactstrap';

const Navigation = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Main</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Cheat Sheet
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem href="/cheatsheet/champions">
                    Champions
                  </DropdownItem>
                  <DropdownItem href="/cheatsheet/synergies">
                    Synergies
                  </DropdownItem>
                  <DropdownItem href="/cheatsheet/items">
                    Items
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="/matchhistory">Match History</NavLink>
              </NavItem>
              {/*<NavItem>
                <NavLink href="/savedbuilds">Saved Builds</NavLink>
              </NavItem>*/}
              <NavItem>
                <NavLink href="/create">Create</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/edit">Edit</NavLink>
              </NavItem>
              {/*<NavItem>
                <NavLink href="/guides">Guides</NavLink>
              </NavItem>*/}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
export default Navigation
