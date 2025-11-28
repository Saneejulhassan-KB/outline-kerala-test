"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { WiDayLightning } from "weather-icons-react";
import ThemeChanger from "../style-selectors/style-selector";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES_WITH_NEWS } from "../../../../queries/getCategoriesWithNews";
import useSmartErrorHandler from "@/hooks/useSmartErrorHandler";
import AuthModal from "@/components/common/AuthModal";
import { useAuth } from "@/context/AuthContext";

const HomeLinks = [
  { href: "/", text: "Home – Layout 1", badge: "NEW" },
  { href: "/home-two", text: "Home – Layout 2", badge: "POPULAR" },
  { href: "/home-three", text: "Home – (Box) Layout 3" },
  { href: "/home-four", text: "Home – Layout 4" },
  { href: "/home-five", text: "Home – Layout 5" },
  { href: "/home-six", text: "Home – Layout 6" },
  { href: "/home-seven", text: "Home – Layout 7" },
  { href: "/home-eight", text: "Home – Layout 8" },
  { href: "/home-nine", text: "Home – Layout 9" },
  { href: "/category", text: "Category - layout 1" },
  { href: "/category-style-two", text: "Category - layout 2" },
  { href: "/category-style-three", text: "Category - layout 3" },
  { href: "/post-template", text: "Post - layout 1" },
  { href: "/post-template-two", text: "Post - layout 2" },
  { href: "/post-template-three", text: "Post - layout 3" },
  { href: "/", text: "Home" },
  { href: "/about", text: "About Us" },
  // { href: '/typography', text: 'Typography' },
  { href: "/contact", text: "Contact" },
  { href: "/faq", text: "Faq" },
];

const Header = () => {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [isOverlayActive, setOverlayActive] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const path = usePathname();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const { isAuthenticated, logout } = useAuth();
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES_WITH_NEWS);
  const errorUI = useSmartErrorHandler(error, refetch);

  const mainCategories = data?.categories?.slice(0, 11) || [];
  const otherCategories = data?.categories?.slice(6) || [];

  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive);
    setOverlayActive(!isOverlayActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
    setOverlayActive(false);
  };

  useEffect(() => {
    const dismissOverlay = document.querySelector("#dismiss");
    const overlay = document.querySelector(".overlay");
    const navIcon = document.querySelector("#nav-icon");

    if (dismissOverlay && overlay) {
      dismissOverlay.addEventListener("click", closeSidebar);
      overlay.addEventListener("click", closeSidebar);
    }

    if (navIcon) {
      navIcon.addEventListener("click", toggleSidebar);
    }

    // Cleanup function for removing event listeners
    return () => {
      if (dismissOverlay && overlay) {
        dismissOverlay.removeEventListener("click", closeSidebar);
        overlay.removeEventListener("click", closeSidebar);
      }
      if (navIcon) {
        navIcon.removeEventListener("click", toggleSidebar);
      }
    };
  }, [isSidebarActive, isOverlayActive]); // R
  useEffect(() => {
    const fullSkinSearch = () => {
      let wHeight = window.innerHeight;

      const fullscreenSearchform = document.getElementById(
        "fullscreen-searchform"
      );

      if (fullscreenSearchform) {
        fullscreenSearchform.style.top = `${wHeight / 2}px`;

        const handleResize = () => {
          wHeight = window.innerHeight;
          fullscreenSearchform.style.top = `${wHeight / 2}px`;
        };

        window.addEventListener("resize", handleResize);

        // Clean up resize event
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }
    };

    const cleanup = fullSkinSearch(); // Run once on mount
    return cleanup || (() => {}); // Run cleanup if it exists
  }, []);

  const handleSearchButtonClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleCloseButtonClick = () => {
    setIsSearchOpen(false);
  };

  const handleNavItemClick = () => {
    const navbar = document.getElementById("navbarSupportedContent");
    if (navbar && navbar.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbar, {
        toggle: true,
      });
      bsCollapse.hide();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorUI) return errorUI;

  return (
    <>
      {/* *** START PAGE HEADER SECTION *** */}
      <header>
        {/* START HEADER TOP SECTION */}
        <div className="header-top">
          <div className="container">
            <div className="row">
              <div className="col">
                {/* Start top left menu */}
                <div className="d-flex top-left-menu">
                  <ul className="align-items-center d-flex flex-wrap">
                    <li>
                      {/* Start header social */}
                      {/* <div className="header-social">
                        <ul className="align-items-center d-flex gap-2">
                          <li>
                            <Link href="#">
                              <i className="fab fa-facebook-f" />
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-twitter" />
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-vk" />
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-instagram" />
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-youtube" />
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-vimeo-v" />
                            </Link>
                          </li>
                        </ul>
                      </div> */}
                      {/* End of /. header social */}
                    </li>
                    <li className="d-none d-sm-block">
                      <Link className="nav-link" href="/contact">
                        Home
                      </Link>
                    </li>
                    <li className="d-none d-sm-block">
                      <Link className="nav-link" href="/contact">
                        Contact Us
                      </Link>
                    </li>
                    <li className="d-none d-sm-block">
                      <Link className="nav-link" href="/about">
                        About Us
                      </Link>
                    </li>
                    {/* <li className="d-none d-sm-block">
                      <Link href="#">Donation</Link>
                    </li> */}
                  </ul>
                </div>
                {/* End of /. top left menu */}
              </div>
              {/* Start header top right menu */}
              <div className="col-auto ms-auto">
                <div className="header-right-menu">
                  <ul className="d-flex justify-content-end">
                    {/* <li className="d-md-block d-none">
                      Currency:{" "}
                      <Link href="#" className="fw-bold">
                        USD
                      </Link>
                    </li>
                    <li className="d-md-block d-none">
                      Wishlist:{" "}
                      <Link href="#" className="fw-bold">
                        12
                      </Link>
                    </li> */}
                    <li>
      {!isAuthenticated ? (
        <>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAuthModalTab("signup");
              setAuthModalOpen(true);
            }}
          >
            <i className="fa fa-lock" /> Sign Up
          </a>
          <span className="fw-bold">/</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAuthModalTab("login");
              setAuthModalOpen(true);
            }}
          >
            Login
          </a>
        </>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            logout(); // 👈 this removes token & updates UI
            toast.info("Logged out successfully.");
          }}
        >
          <i className="fa fa-sign-out-alt" /> Logout
        </a>
      )}
    </li>
                  </ul>
                </div>
              </div>
              {/* end of /. header top right menu */}
            </div>
            {/* end of /. row */}
          </div>
          {/* end of /. container */}
        </div>
        {/* END OF /. HEADER TOP SECTION */}
        {/* START MIDDLE SECTION */}
        <div className="d-md-block d-none header-mid">
          <div className="container">
            <div className="row align-items-center">
              {/* Left: Logo and Weather */}
              <div className="col-auto">
                <div className="d-flex align-items-center gap-3">
                  <Link href="/" className="header-logo">
                    <img
                      src="/logo.jpeg"
                      className="header-logo_dark"
                      alt="Logo Dark"
                    />
                    <img
                      src="/logo.jpeg"
                      className="header-logo_white"
                      alt="Logo White"
                    />
                  </Link>
                  <div className="fs-5 fw-semibold weather-text">
                    <WiDayLightning size={28} /> 11.23°C
                  </div>
                </div>
              </div>

              {/* Center: Ad Banner */}
              <div className="col text-center">
                <div className="add-inner mb-0">
                  <img
                    src="https://inews-neon.vercel.app/assets/images/add728x90-2.jpg"
                    className="img-fluid"
                    alt="Advertisement"
                    style={{ maxHeight: "70px", maxWidth: "100%" }}
                  />
                </div>
              </div>

              {/* Right: Date */}
              <div className="col-auto text-end fw-semibold text-uppercase date-text">
                Friday, August 4
              </div>
            </div>
          </div>
        </div>

        {/* END OF /. MIDDLE SECTION */}
        {/* START NAVIGATION */}
        <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo">
          {/* Search Overlay */}
          {/* <div
            className={`fullscreen-search-overlay ${
              isSearchOpen ? "fullscreen-search-overlay-show" : ""
            }`}
          >
            <a
              href="#"
              className="fullscreen-close"
              onClick={handleCloseButtonClick}
              id="fullscreen-close-button"
            >
              <i className="ti ti-close" />
            </a>
            <div id="fullscreen-search-wrapper">
              <form method="get" id="fullscreen-searchform">
                <input
                  type="text"
                  placeholder="Type keyword(s) here"
                  id="fullscreen-search-input"
                />
                <i className="ti ti-search fullscreen-search-icon">
                  <input value="" type="submit" />
                </i>
              </form>
            </div>
          </div> */}

          <div className="container position-relative">
            {/* Mobile Logo */}
            <Link className="navbar-brand d-lg-none" href="/">
              <img src="/logo.jpeg" className="header-logo_dark" alt="Logo" />
            </Link>

            {/* Mobile Search Button */}
            {/* <button
              type="button"
              className="btn btn-search_two ms-auto d-lg-none"
              onClick={handleSearchButtonClick}
            >
              <i className="fa fa-search" />
            </button> */}

            {/* Toggle Button */}
            <button
              className="navbar-toggler ms-1"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Navigation Content */}
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              {/* Mobile Header */}
              <div className="d-lg-none border-bottom mb-3 pb-3 d-flex justify-content-between align-items-center">
                <Link href="/" className="navbar-brand">
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="header-logo_dark"
                  />
                </Link>
                <button
                  type="button"
                  className="bg-transparent border-0 collapse-close"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                >
                  <span /> <span />
                </button>
              </div>

              {/* Main Nav */}
              <ul className="navbar-nav w-100">
                {/* Home */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${path === "/" ? "active" : ""}`}
                    href="/"
                    onClick={handleNavItemClick}
                  >
                    Home
                  </Link>
                </li>

                {/* Pages Dropdown */}
                {/* <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Pages
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown dropend">
                      <a
                        className="dropdown-item dropdown-toggle"
                        href="#"
                        data-bs-toggle="dropdown"
                      >
                        Home
                      </a>
                      <ul className="dropdown-menu">
                        {HomeLinks.slice(0, 9).map((link, index) => (
                          <li key={index}>
                            <Link
                              className={`dropdown-item ${
                                path === link.href ? "active" : ""
                              }`}
                              href={link.href}
                              onClick={handleNavItemClick}
                            >
                              {link.text}
                              {link.badge && (
                                <span className="menu-badge">{link.badge}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </li> */}

                {/* Categories */}
                {!loading &&
                  !error &&
                  mainCategories.map((category) => {
                    const href = `/category/${category.slug}`;
                    const isActive = path === href;
                    const hasSub =
                      category.subcategories &&
                      category.subcategories.length > 0;

                    return (
                      <li
                        key={category.id}
                        className={`nav-item dropdown ${
                          hasSub ? "dropdown" : ""
                        } ${hasSub ? "d-lg-none" : ""}`}
                      >
                        {hasSub ? (
                          <>
                            <a
                              className="nav-link dropdown-toggle"
                              href="#"
                              data-bs-toggle="dropdown"
                            >
                              {category.name}
                            </a>
                            <ul className="dropdown-menu">
                              {category.subcategories.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    className="dropdown-item"
                                    href={`/subcategory/${sub.slug}`}
                                    onClick={handleNavItemClick}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Link
                            className={`nav-link ${isActive ? "active" : ""}`}
                            href={href}
                            onClick={handleNavItemClick}
                          >
                            {category.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}

                {/* Desktop Mega Menu */}
                {!loading &&
                  !error &&
                  mainCategories.map((category) => {
                    const href = `/category/${category.slug}`;
                    const isActive = path === href;
                    const hasSub =
                      category.subcategories &&
                      category.subcategories.length > 0;

                    return (
                      hasSub && (
                        <li
                          key={category.id}
                          className="nav-item dropdown d-none d-lg-block mega-menu-content"
                        >
                          <Link
                            className={`nav-link ${isActive ? "active" : ""}`}
                            href={href}
                          >
                            {category.name}
                          </Link>
                          <ul className="dropdown-menu mega-menu p-3 megamenu-content">
                            <li>
                              <div className="row">
                                {Array.from({
                                  length: Math.ceil(
                                    category.subcategories.length / 6
                                  ),
                                }).map((_, colIndex) => (
                                  <div className="col-md-3" key={colIndex}>
                                    <ul className="menu-col ">
                                      {category.subcategories
                                        .slice(colIndex * 6, colIndex * 6 + 6)
                                        .map((sub) => (
                                          <li key={sub.id} className="pt-2">
                                            <Link
                                              href={`/subcategory/${sub.slug}`}
                                              onClick={handleNavItemClick}
                                            >
                                              {sub.name}
                                            </Link>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </li>
                          </ul>
                        </li>
                      )
                    );
                  })}

                {/* Other Categories */}
                {otherCategories.length > 0 && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-h" />
                    </a>
                    <ul className="dropdown-menu">
                      {otherCategories.map((category) => (
                        <li key={category.id}>
                          <Link
                            className="dropdown-item"
                            href={`/category/${category.slug}`}
                            onClick={handleNavItemClick}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>

            {/* Desktop Search Button */}
            {/* <div className="d-none d-lg-flex">
              <button
                type="button"
                className="btn btn-search_two ms-auto"
                onClick={handleSearchButtonClick}
              >
                <i className="fa fa-search fa-lg" />
              </button>
            </div> */}
          </div>
        </nav>

        {/* END OF/. NAVIGATION */}
        {/* START SIDEBAR */}
        <nav id="sidebar" className={isSidebarActive ? "active p-4" : "p-4"}>
          <div id="dismiss">
            <i className="fas fa-arrow-left" />
          </div>
          <div className="d-flex flex-column h-100">
            <div className="">
              <Link href="/" className="d-inline-block my-3">
                <img src="assets/images/logo-white.png" alt="" height={50} />
              </Link>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
            </div>
            <ul className="nav d-block flex-column my-4">
              <li className="nav-item h5">
                <Link className="nav-link" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item h5">
                <Link className="nav-link" href="/about">
                  About
                </Link>
              </li>
              <li className="nav-item h5">
                <Link className="nav-link" href="/faq">
                  Faq
                </Link>
              </li>
              <li className="nav-item h5">
                <Link className="nav-link" href="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
            <div className="mt-auto pb-3">
              {/* Address */}
              <p className="mb-2 fw-bold">New York, USA (HQ)</p>
              <address className="mb-0">
                1123 Fictional St, San Francisco, CA 94103
              </address>
              <p className="mb-2">
                Call:{" "}
                <Link href="#" className="text-white">
                  <u>(123) 456-7890</u> (Toll-free)
                </Link>{" "}
              </p>
              <Link href="#" className="d-block text-white">
                hello@inews.com
              </Link>
            </div>
          </div>
        </nav>
        {/* END OF /. SIDEBAR */}
        <div className={isOverlayActive ? "overlay active" : "overlay"} />
      </header>
      {/* *** END OF /. PAGE HEADER SECTION *** */}
      <AuthModal
        show={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};

export default Header;
