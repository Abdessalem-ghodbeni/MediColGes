import React from "react";

function slidebar() {
  return (
    <>
      <main>
        {/* Sidebar START */}
        <nav className="navbar sidebar navbar-expand-xl navbar-light">
          {/* Navbar brand for xl START */}
          <div className="d-flex align-items-center">
            <a className="navbar-brand" href="index.html">
              <img
                className="light-mode-item navbar-brand-item"
                src="assets/images/logo (2).png"
                alt="logo"
              />
              <img
                className="dark-mode-item navbar-brand-item"
                src="assets/images/logo (2).png"
                alt="logo"
              />
            </a>
          </div>
          {/* Navbar brand for xl END */}
          <div
            className="offcanvas offcanvas-start flex-row custom-scrollbar h-100"
            data-bs-backdrop="true"
            tabIndex={-1}
            id="offcanvasSidebar"
          >
            <div className="offcanvas-body sidebar-content d-flex flex-column pt-4">
              {/* Sidebar menu START */}
              <ul className="navbar-nav flex-column" id="navbar-sidebar">
                {/* Menu item */}
                <li className="nav-item">
                  <a href="admin-dashboard.html" className="nav-link">
                    Dashboard
                  </a>
                </li>
                {/* Title */}
                <li className="nav-item ms-2 my-2">Pages</li>
                {/* Menu item **Organization Management** */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="collapse"
                    href="#collapsebooking"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapsebooking"
                  >
                    Organization Management
                  </a>
                  {/* Submenu */}
                  <ul
                    className="nav collapse flex-column"
                    id="collapsebooking"
                    data-bs-parent="#navbar-sidebar"
                  >
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" href="/organization/list">
                        Organization List
                      </a>
                    </li>
                    {/* <li className="nav-item">
                      {" "}
                      <a className="nav-link" href="/organization/details">
                        Organization Details
                      </a>
                    </li> */}
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        href="/organization/category/list"
                      >
                        Category List
                      </a>
                    </li>
                    {/* <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        href="/organization/category/details"
                      >
                        Category Details
                      </a>
                    </li> */}
                  </ul>
                </li>
                {/* Menu item **Feedback Management** */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="collapse"
                    href="#collapsebooking2"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapsebooking2"
                  >
                    Feedback Management
                  </a>
                  {/* Submenu */}
                  <ul
                    className="nav collapse flex-column"
                    id="collapsebooking2"
                    data-bs-parent="#navbar-sidebar"
                  >
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" href="/feedback/list">
                        Feedback List
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              {/* Sidebar menu end */}
              {/* Sidebar footer START */}
              <div className="d-flex align-items-center justify-content-between text-primary-hover mt-auto p-3">
                <a
                  className="h6 fw-light mb-0 text-body"
                  href="sign-in.html"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  aria-label="Sign out"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" /> Log out
                </a>
                <a
                  className="h6 mb-0 text-body"
                  href="admin-settings.html"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  aria-label="Settings"
                >
                  <i className="bi bi-gear-fill" />
                </a>
              </div>
              {/* Sidebar footer END */}
            </div>
          </div>
        </nav>
        {/* Sidebar END */}
      </main>
    </>
  );
}

export default slidebar;
