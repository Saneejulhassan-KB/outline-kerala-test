"use client";
import StickyBox from "react-sticky-box";
import "./globals.css";
import NewsTicker from "@/components/ltr/news-ticker-carousal/page";
import SunnyWeather from "@/components/ltr/sunny-wether/sunny-weather";
import { useBackgroundImageLoader } from "@/components/ltr/use-background-image/use-background-image";
import Layout from "@/components/ltr/layout/layout";
import YoutubeVideo from "@/components/ltr/youtube-video/youtube-video";
import useRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import DatePickerComponents from "@/components/ltr/date-picker/date-picker";
import PollWidget from "@/components/ltr/poll-widget/poll";
import HomeFeatureCarousal from "@/components/ltr/home-feature-carousal/home-feature-carousal";
import HomeCenterSlider from "@/components/ltr/home-center-slider/home-center-slider";
import Tags from "@/components/ltr/tags/tags";
import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES_WITH_NEWS } from "../../queries/getCategoriesWithNews";
import useSmartErrorHandler from "@/hooks/useSmartErrorHandler";
import GoldTicker from "@/components/ltr/gold-ticker-carousal/page";
import AdvertisementPopup from "@/components/ltr/advertisement-popup/advertisement-popup";
// import ElectionWidget from "@/components/ltr/election-widget/election-widget";
import ElectionCarousel from "@/components/ltr/election-carousel/election-carousel";

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES_WITH_NEWS);
  const errorUI = useSmartErrorHandler(error, refetch);

  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [shareUrl, setShareUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href); // Get current page URL
    setTitle(document.title); // Get current page title
  }, []);

  useEffect(() => {
    // Your logic for setting dir attribute using JavaScript
    // For example:
    document.documentElement.removeAttribute("dir", "rtl");
  }, []);

  {
    /* *** ADD AND REMOVE CLASS ON BODY TAG *** */
  }
  useRemoveBodyClass(
    ["home-nine"],
    ["home-six", "home-seven", "home-two", "boxed-layout", "layout-rtl"]
  );
  {
    /* *** IMPORT BACKGROUND IMAGE *** */
  }
  useBackgroundImageLoader();

  const articlesPerPage = 5;

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
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

  const allCategories = data?.categories || [];

  const visibleCategories = showAll ? allCategories : allCategories.slice(0, 5);

  // Flatten the categories and subcategories to get all news items

  const newsItems = allCategories.flatMap(
    (cat) =>
      cat.subcategories?.flatMap((sub) =>
        (sub.news || []).map((news) => ({
          ...news,
          categoryName: cat.name,
          categorySlug: cat.slug,
          subcategoryName: sub.name,
          subcategorySlug: sub.slug,
        }))
      ) || []
  );

  // latest news section
  const sortedNewsItems = [...newsItems]
    .sort((a, b) => b.id - a.id)
    .slice(0, 30);

  // Get the first three categories for the left sidebar
  const firstSlideCategories = allCategories.slice(0, 3);

  // Get the next two categories for the bottom  left sidebar
  const secondSlideCategories = allCategories.slice(3, 6);

  // Get the next two categories for the bottom  right sidebar
  const thirdSlideCategories = allCategories.slice(6, 9);

  // Get the next two categories for the bottom  right sidebar
  const fourthSlideCategories = allCategories.slice(9, 12);

  // Filter only news tagged with "Trending"
  const trendingNews = newsItems.filter((news) =>
    news.tags?.some((tag) => tag.name.toLowerCase() === "trending")
  );

  // Sort trending news by latest added (highest ID first)
  trendingNews.sort((a, b) => b.id - a.id);

  // Sort news items for the sliders
  const sortedNewsItemsForSlider = [...newsItems].sort((a, b) => b.id - a.id); // latest added first

  const latestNewsForFirstSlider = sortedNewsItemsForSlider.slice(0, 5);
  const latestNewsForSecondSlider = sortedNewsItemsForSlider.slice(9, 14);
  const fourImageLayoutNews = sortedNewsItemsForSlider.slice(5, 9);

  // Flatten all tags from all news
  const allTags = allCategories.flatMap(
    (cat) =>
      cat.subcategories?.flatMap(
        (sub) => sub.news?.flatMap((news) => news.tags || []) || []
      ) || []
  );

  // Deduplicate tags by ID
  const uniqueTagsMap = new Map();
  allTags.forEach((tag) => {
    if (!uniqueTagsMap.has(tag.id)) {
      uniqueTagsMap.set(tag.id, tag);
    }
  });
  const uniqueTags = Array.from(uniqueTagsMap.values());

  //  Slice for each section
  // const firstSliderNews = newsItems.slice(0, 5);
  // const secondSliderNews = newsItems.slice(5, 10);
  // const fourImageLayoutNews = newsItems.slice(10, 14);

  // Sort news by publish date in descending order for top carousel and remaining layout
  // const latestNews = [...(dataNews?.newses || [])].sort((a, b) => b.id - a.id);
  // const topCarouselNews = latestNews.slice(0, 6); // For two sliders (3 per slider or however you configure)
  // const remainingNews = latestNews.slice(6); // For four-image layout

  // const getCategoryNews = (categoryName) =>
  //   newsItems.filter(
  //     (item) =>
  //       item.category?.name?.toLowerCase() === categoryName.toLowerCase()
  //   );

  const totalPages = Math.ceil(sortedNewsItems.length / articlesPerPage);
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = sortedNewsItems.slice(indexOfFirst, indexOfLast);

  return (
    <Layout>
      {/* *** START PAGE MAIN CONTENT *** */}
      <main className="page_main_wrapper">
        {/* START NEWSTRICKER */}
        <NewsTicker trendingNews={trendingNews} />
        {/* <GoldTicker /> */}
        {/*  END OF /. NEWSTRICKER */}
        
        {/* START ELECTION CAROUSEL */}
        <ElectionCarousel />
        {/* END OF /. ELECTION CAROUSEL */}

        {/* START ELECTION WIDGET */}
        {/* <ElectionWidget /> */}
        {/* END OF /. ELECTION WIDGET */}
        {/* START FEATURE SECTION */}
        <div
          className="bg-img feature-section py-4 py-lg-3 py-xl-4"
          data-image-src="assets/images/bg-shape.png"
        >
          <div className="container">
            <HomeFeatureCarousal />
          </div>
        </div>
        {/* END OF /. FEATURE SECTION */}
        {/* START POST BLOCK SECTION */}
        <section className="slider-inner">
          <div className="container-fluid p-0">
            <div className="row thm-margin">
             

              <div className="col-md-6 col-md-6 thm-padding ">
                <div className="slider-wrapper">
                  <HomeCenterSlider newsList={latestNewsForFirstSlider} />
                </div>
                <div className="slider-wrapper d-none d-md-block">
                  <HomeCenterSlider newsList={latestNewsForSecondSlider} />
                </div>
              </div>

              <div className="col-md-6 col-md-6 thm-padding">
                <div className="row slider-right-post thm-margin">
                
                  {fourImageLayoutNews.map((news, index) => (
                    <div
                      className={`col-6 col-sm-6 thm-padding ${
                        index >= 2 ? "d-md-block d-none" : ""
                      }`}
                      key={news.id}
                    >
                      <div className="slider-post post-height-2">
                        <a href={`/news/${news.slug}`} className="news-image">
                          <img
                            src={`https://backend.outlinekerala.com/media/${news.image}`}
                            alt={news.title}
                            className="img-fluid w-100"
                          />
                        </a>
                        <div className="post-text">
                          <span className="post-category">
                            {news.subcategoryName || news.categoryName}
                          </span>
                          <h4>
                            <a href={`/news/${news.slug}`}>
                              {news.title.length > 80
                                ? news.title.slice(0, 77) + "..."
                                : news.title}
                            </a>
                          </h4>
                          <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                            <li>{new Date(news.publishDate).toDateString()}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END OF /. POST BLOCK SECTION */}
        <div className="container">
          <div className="row gx-lg-5">
            {/* START MAIN CONTENT */}
            <div className="col-md-3 leftSidebar d-none d-xl-block">
              <StickyBox>
                {firstSlideCategories.map((cat) => {
                  const allNews =
                    cat.subcategories?.flatMap((sub) =>
                      (sub.news || []).map((newsItem) => ({
                        ...newsItem,
                        subcategoryName: sub.name,
                        subcategorySlug: sub.slug,
                      }))
                    ) || [];

                  const categoryNews = allNews
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 3);

                  return (
                    <div key={cat.id}>
                      <div className="panel_header">
                        <h4>
                          <Link href={`/category/${cat.slug}`}>
                            <strong>{cat.name}</strong>
                          </Link>
                        </h4>
                      </div>
                      <div className="border-bottom posts">
                        <ul>
                          {categoryNews.map((news, index) => (
                            <li
                              key={news.id}
                              className={`post-grid ${
                                index >= 2 ? "d-none d-xl-block" : ""
                              }`}
                            >
                              <div className="posts-inner px-0">
                                <h6 className="posts-title">
                                  <Link href={`/news/${news.slug}`}>
                                    {news.title.length > 70
                                      ? news.title.slice(0, 70) + "..."
                                      : news.title}
                                  </Link>
                                </h6>
                                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                  <li>
                                    <span className="post-category">
                                      {news.subcategoryName || "General"}
                                    </span>
                                  </li>
                                  <li>
                                    {new Date(news.publishDate).toDateString()}
                                  </li>
                                </ul>
                                <p>
                                  {news.content
                                    ?.replace(/<[^>]+>/g, "")
                                    .slice(0, 120) || "No content available"}
                                  ...
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </StickyBox>
            </div>
            <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
              <StickyBox>
                {/* START Main Trending Post */}
                <div className="post-inner">
                  <div className="post-body py-0">
                    {trendingNews.length > 0 && (
                      <article>
                        <figure>
                          <a href={`/news/${trendingNews[0].slug}`}>
                            <img
                              src={`https://backend.outlinekerala.com/media/${trendingNews[0].image}`}
                              alt={trendingNews[0].title}
                              className="img-fluid"
                            />
                          </a>
                        </figure>
                        <div className="post-info">
                          <h3 className="fs-4">
                            <a href={`/news/${trendingNews[0].slug}`}>
                              {trendingNews[0].title}
                            </a>
                          </h3>
                          <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                            <li>
                              <span className="post-category">
                                {trendingNews[0].categoryName}
                              </span>
                            </li>
                            <li>
                              {new Date(
                                trendingNews[0].publishDate
                              ).toDateString()}
                            </li>
                          </ul>
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                trendingNews[0].content.slice(0, 180) + "...",
                            }}
                          />
                        </div>
                      </article>
                    )}
                  </div>
                </div>

                {/* Grid Layout for Remaining Trending News */}
                <div className="news-grid-2 border-top pt-4 mb-4">
                  <div className="row gx-3 gx-lg-4 gy-4">
                    {trendingNews.slice(1, 7).map((news) => (
                      <div className="col-6 col-md-4 col-sm-6" key={news.id}>
                        <div className="grid-item mb-0">
                          <div className="grid-item-img">
                            <a href={`/news/${news.slug}`}>
                              <img
                                src={`https://backend.outlinekerala.com/media/${news.image}`}
                                className="img-fluid trending-news-image"
                                alt={news.title}
                              />
                              <div className="link-icon">
                                <i className="fa fa-camera" />
                              </div>
                            </a>
                          </div>
                          <h5>
                            <a href={`/news/${news.slug}`} className="title">
                              {news.title}
                            </a>
                          </h5>
                          <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0">
                            <li>{new Date(news.publishDate).toDateString()}</li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Advertisement */}
                <div className="add-inner">
                  <img src="./ads.jpg" className="img-fluid" alt="Ad" />
                </div>
              </StickyBox>
            </div>
            {/* END OF /. MAIN CONTENT */}
            {/* START SIDE CONTENT */}
            <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
              <StickyBox>
                {/* END OF /. SOCIAL ICON */}
                {/* START TRENDING TOPICS */}
                {thirdSlideCategories.map((cat) => {
                  // Flatten all news from subcategories under this category
                  const categoryNews =
                    cat.subcategories?.flatMap((sub) =>
                      (sub.news || []).map((newsItem) => ({
                        ...newsItem,
                        subcategoryName: sub.name,
                        subcategorySlug: sub.slug,
                      }))
                    ) || [];

                  // Sort and pick latest 3
                  const latestNews = categoryNews
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 3);

                  return (
                    <div className="panel_inner mb-4" key={cat.id}>
                      <div className="panel_header">
                        <h4>
                          <Link href={`/category/${cat.slug}`}>
                            <strong>{cat.name}</strong>
                          </Link>
                        </h4>
                      </div>

                      <div className="mb-3">
                        <img
                          src={`https://backend.outlinekerala.com/media/${cat.image}`}
                          alt={cat.name}
                          className="img-fluid w-100"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            marginTop: "10px",
                          }}
                        />
                      </div>

                      <div className="panel_body">
                        {latestNews.length > 0 ? (
                          latestNews.map((news, index) => (
                            <div
                              key={news.id}
                              className={`border-bottom pb-3 mb-3 ${
                                index === latestNews.length - 1 ? "mb-0" : ""
                              }`}
                            >
                              <h6>
                                <Link href={`/news/${news.slug}`}>
                                  {news.title.length > 70
                                    ? news.title.slice(0, 70) + "..."
                                    : news.title}
                                </Link>
                              </h6>
                              <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                <li>
                                  <span className="post-category mb-0">
                                    {news.subcategoryName || "General"}
                                  </span>
                                </li>
                                <li>
                                  {new Date(news.publishDate).toDateString()}
                                </li>
                              </ul>
                              <p className="mb-0">
                                {news.content
                                  ?.replace(/<[^>]+>/g, "")
                                  .slice(0, 120) || "No content"}
                                ...
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No news available for {cat.name}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="panel_inner review-inner">
                  <div className="panel_header">
                    <h4>
                      <strong>Trending</strong> topics
                    </h4>
                  </div>
                  <div className="panel_body">
                    {visibleCategories.map((cat, index) => (
                      <div
                        key={index}
                        className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
                        style={{
                          backgroundImage: `url(https://backend.outlinekerala.com/media/${cat.image})`,
                          backgroundSize: "cover",
                        }}
                      >
                        <Link
                          href={`/category/${cat.slug.toLowerCase()}/`}
                          className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"
                        >
                          {cat.name}
                        </Link>
                      </div>
                    ))}

                    {/* Toggle Button */}
                    {allCategories.length > 5 && (
                      <div className="text-center mt-3">
                        <button
                          onClick={() => setShowAll(!showAll)}
                          className="fw-bold text-primary-hover btn btn-link p-0"
                        >
                          <u>
                            {showAll
                              ? "Show less categories"
                              : "View all categories"}
                          </u>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {fourthSlideCategories.map((cat) => {
                  const allNews =
                    cat.subcategories?.flatMap((sub) =>
                      (sub.news || []).map((newsItem) => ({
                        ...newsItem,
                        subcategoryName: sub.name,
                        subcategorySlug: sub.slug,
                      }))
                    ) || [];

                  const categoryNews = allNews
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 3);

                  return (
                    <div key={cat.id}>
                      <div className="panel_header">
                        <h4>
                          <Link href={`/category/${cat.slug}`}>
                            <strong>{cat.name}</strong>
                          </Link>
                        </h4>
                      </div>
                      <div className="border-bottom posts">
                        <ul>
                          {categoryNews.map((news, index) => (
                            <li
                              key={news.id}
                              className={`post-grid ${
                                index >= 2 ? "d-none d-xl-block" : ""
                              }`}
                            >
                              <div className="posts-inner px-0">
                                <h6 className="posts-title">
                                  <Link href={`/news/${news.slug}`}>
                                    {news.title.length > 70
                                      ? news.title.slice(0, 70) + "..."
                                      : news.title}
                                  </Link>
                                </h6>
                                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                  <li>
                                    <span className="post-category">
                                      {news.subcategoryName || "General"}
                                    </span>
                                  </li>
                                  <li>
                                    {new Date(news.publishDate).toDateString()}
                                  </li>
                                </ul>
                                <p>
                                  {news.content
                                    ?.replace(/<[^>]+>/g, "")
                                    .slice(0, 120) || "No content available"}
                                  ...
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
                {/* END OF /. TRENDING TOPICS */}
                {/* START LATEST REVIEWS */}
                {/* <div className="panel_inner review-inner">
                  <div className="panel_header">
                    <h4>
                      <strong>Latest</strong> Reviews
                    </h4>
                  </div>
                  <div className="panel_body">
                    <div className="more-post">
                      <a href="#" className="news-image">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/043/032/587/small/a-person-walking-through-a-forest-during-a-gentle-rain-photo.jpg"
                          alt=""
                          className="img-fluid w-100"
                        />
                      </a>
                      <div className="reatting">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star-half-o" />
                        <i className="fa fa-star-o" />
                      </div>
                      <div className="post-text">
                       
                        <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-1">
                          <li>
                            <span className="post-category mb-0">Travel</span>
                          </li>
                          <li>Aug 16, 2023</li>
                        </ul>
                        <h4 className="mb-0">
                          Quisque tincidunt metus a lacinia faucibus.
                        </h4>
                      </div>
                    </div>
                    <div className="mt-4 news-list">
                      <div className="news-list-item p-0 mb-4">
                        <div className="img-wrapper">
                          <a href="#" className="thumb">
                            <img
                              src="https://curlytales.com/wp-content/uploads/2023/05/cover-61.jpg"
                              alt=""
                              className="img-fluid"
                            />
                            <div className="link-icon">
                              <i className="fa fa-camera" />
                            </div>
                          </a>
                        </div>
                        <div className="post-info-2">
                          <h5>
                            <a href="#" className="title">
                              Duis ac elit finibus, ullamcorper nibh eget,
                              cursus enim.{" "}
                            </a>
                          </h5>
                          <div className="reviews-reatting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star-half-alt" />
                            <i className="far fa-star" />
                          </div>
                        </div>
                      </div>
                      <div className="news-list-item p-0 mb-4">
                        <div className="img-wrapper">
                          <a href="#" className="thumb">
                            <img
                              src="https://images.cnbctv18.com/uploads/2025/06/air-india-crash-2025-06-2b061253501eb6bc4f31990cdf3f60b0.jpg?impolicy=website&width=296&height=161"
                              alt=""
                              className="img-fluid"
                            />
                            <div className="link-icon">
                              <i className="fa fa-play" />
                            </div>
                          </a>
                        </div>
                        <div className="post-info-2">
                          <h5>
                            <a href="#" className="title">
                              Vivamus luctus ligula a arcu ullamcorper
                              vestibulum.
                            </a>
                          </h5>
                          <div className="reviews-reatting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star-half-alt" />
                            <i className="far fa-star" />
                          </div>
                        </div>
                      </div>
                      <div className="news-list-item p-0">
                        <div className="img-wrapper">
                          <a href="#" className="thumb">
                            <img
                              src="https://images.news18.com/ibnlive/uploads/2025/06/image-2025-06-6a2128dea6df18d327982410f511d1b1.jpg"
                              alt=""
                              className="img-fluid"
                            />
                            <div className="link-icon">
                              <i className="fa fa-camera" />
                            </div>
                          </a>
                        </div>
                        <div className="post-info-2">
                          <h5>
                            <a href="#" className="title">
                              Etiam sed erat at purus laoreet condimentum.
                            </a>
                          </h5>
                          <div className="reviews-reatting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star-half-alt" />
                            <i className="far fa-star" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* END OF /. LATEST REVIEWS */}
              </StickyBox>
            </div>
            {/* END OF /. SIDE CONTENT */}
          </div>
        </div>
        {/* START YOUTUBE VIDEO */}
        {/* <div className="mb-4 py-5 position-relative video-section">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-md-6 text-center">
                <h3 className="text-white">Latest Video News</h3>
                <p className="text-white mb-0">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.{" "}
                </p>
              </div>
            </div>
            <YoutubeVideo />
          </div>
        </div> */}
        {/* END OF /. YOUTUBE VIDEO */}
        <section className="articles-wrapper">
          <div className="container">
            <div className="row gx-lg-5">
              <div className="col-md-3 leftSidebar d-none d-xl-block">
                <StickyBox>
                  {secondSlideCategories.map((cat) => {
                    // Flatten all news from subcategories under this category
                    const categoryNews =
                      cat.subcategories?.flatMap((sub) =>
                        (sub.news || []).map((newsItem) => ({
                          ...newsItem,
                          subcategoryName: sub.name,
                          subcategorySlug: sub.slug,
                        }))
                      ) || [];

                    // Sort and pick latest 3
                    const latestNews = categoryNews
                      .sort((a, b) => b.id - a.id)
                      .slice(0, 3);

                    return (
                      <div className="panel_inner mb-4" key={cat.id}>
                        <div className="panel_header">
                          <h4>
                            <Link href={`/category/${cat.slug}`}>
                              <strong>{cat.name}</strong>
                            </Link>
                          </h4>
                        </div>

                        <div className="mb-3">
                          <img
                            src={`https://backend.outlinekerala.com/media/${cat.image}`}
                            alt={cat.name}
                            className="img-fluid w-100"
                            style={{
                              height: "200px",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        </div>

                        <div className="panel_body">
                          {latestNews.length > 0 ? (
                            latestNews.map((news, index) => (
                              <div
                                key={news.id}
                                className={`border-bottom pb-3 mb-3 ${
                                  index === latestNews.length - 1 ? "mb-0" : ""
                                }`}
                              >
                                <h6>
                                  <Link href={`/news/${news.slug}`}>
                                    {news.title.length > 70
                                      ? news.title.slice(0, 70) + "..."
                                      : news.title}
                                  </Link>
                                </h6>
                                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                  <li>
                                    <span className="post-category mb-0">
                                      {news.subcategoryName || "General"}
                                    </span>
                                  </li>
                                  <li>
                                    {new Date(news.publishDate).toDateString()}
                                  </li>
                                </ul>
                                <p className="mb-0">
                                  {news.content
                                    ?.replace(/<[^>]+>/g, "")
                                    .slice(0, 120) || "No content"}
                                  ...
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No news available for {cat.name}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </StickyBox>
              </div>

              <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                <StickyBox>
                  <div className="post-inner">
                    {/* Header */}
                    <div className="post-head">
                      <h2 className="title">
                        <strong>Latest</strong> News
                      </h2>
                    </div>

                    {/* Articles */}
                    <div
                      className="post-body"
                      style={{ overflowX: "hidden", maxWidth: "100%" }}
                    >
                      {currentArticles.map((news, index) => (
                        <div
                          className="news-list-item articles-list"
                          key={index}
                        >
                          <div className="img-wrapper">
                            <div className="align-items-center bg-primary d-flex justify-content-center position-absolute rounded-circle text-white trending-post z-1">
                              <i className="fa-solid fa-bolt-lightning" />
                            </div>
                            <Link
                              href={`/news/${news.slug}`}
                              className="thumb d-block"
                            >
                              <img
                                src={`https://backend.outlinekerala.com/media/${news.image}`}
                                alt={news.title}
                                className="img-fluid w-100 latest-news-image"
                              />
                            </Link>
                          </div>
                          <div className="post-info-2">
                            <h4>
                              <Link
                                href={`/news/${news.slug}`}
                                className="title"
                              >
                                {news.title}
                              </Link>
                            </h4>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li>
                                <span className="post-category mb-0">
                                  {news.subcategoryName || "General"}
                                </span>
                              </li>
                              <li>
                                {new Date(news.publishDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </li>
                            </ul>
                            <p className="d-lg-block d-none article-text-clamp">
                              {news.content?.replace(/<[^>]+>/g, "") ||
                                "No content available"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer with Pagination + Social Icons */}
                    <div className="post-footer">
                      <div className="row thm-margin">
                        <div className="col-md-8 thm-padding">
                          <ul className="pagination">
                            <li className={currentPage === 1 ? "disabled" : ""}>
                              <span
                                onClick={() => changePage(currentPage - 1)}
                                className="ti ti-angle-left"
                              />
                            </li>
                            {Array.from({ length: totalPages }, (_, idx) => (
                              <li
                                key={idx}
                                className={
                                  currentPage === idx + 1 ? "active" : ""
                                }
                              >
                                <span onClick={() => changePage(idx + 1)}>
                                  {idx + 1}
                                </span>
                              </li>
                            ))}
                            <li
                              className={
                                currentPage === totalPages ? "disabled" : ""
                              }
                            >
                              <span
                                onClick={() => changePage(currentPage + 1)}
                                className="ti ti-angle-right"
                              />
                            </li>
                          </ul>
                        </div>

                        {/* Social Icons */}
                        <div className="col-md-4 d-md-block d-none thm-padding">
      <div className="social">
        <ul>
          <li>
            <div className="share transition">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ico fb"
              >
                <i className="fab fa-facebook-f" />
              </a>

              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ico tw"
              >
                <i className="fab fa-twitter" />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${title} - ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ico ws"
              >
                <i className="fab fa-whatsapp" />
              </a>

              <i className="ti ti-share ico-share" />
            </div>
          </li>
        </ul>
      </div>
    </div>
                      </div>
                    </div>

                    {/* Advertisement Section */}
                    <div className="add-inner mb-0">
                      <img
                        src="https://inews-neon.vercel.app/assets/images/add728x90-2.jpg"
                        className="img-fluid"
                        alt="Advertisement"
                      />
                    </div>
                  </div>
                </StickyBox>
              </div>
              <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
                <StickyBox>
                  {/* START WEATHER */}
                  {/* <div className="weather-wrapper-2 weather-bg-2">
                    <div className="weather-temperature">
                      <div className="weather-now">
                        <span className="big-degrees">39</span>
                        <span className="circle">°</span>
                        <span className="weather-unit">C</span>
                      </div>
                      <div className="weather-icon-2">
                        <SunnyWeather />
                      </div>
                    </div>
                    <div className="weather-info">
                      <div className="weather-name">Partly Sunny</div>
                      <span>
                        Real Fell: 67 <sup>°</sup>
                      </span>
                      <span>Change of Rain</span>
                    </div>
                    <div className="weather-week-2">
                      <div className="weather-days">
                        <div className="day-0">Sun</div>
                        <div className="day-icon">
                          <i className="wi wi-day-sunny" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-0">45</span>
                          <span className="td-circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-1">Mon</div>
                        <div className="day-icon">
                          <i className="wi wi-day-cloudy-high" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-1">21</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-2">Tue</div>
                        <div className="day-icon">
                          <i className="wi wi-day-sleet" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-2">29</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-3">Wed</div>
                        <div className="day-icon">
                          <i className="wi wi-day-lightning" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-3">19</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Thu</div>
                        <div className="day-icon">
                          <i className="wi wi-sleet" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-4">54</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Fri</div>
                        <div className="day-icon">
                          <i className="wi wi-smog" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-5">68</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Sat</div>
                        <div className="day-icon">
                          <i className="wi wi-lightning" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-6">28</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                    </div>
                    <div className="weather-footer">
                      <div className="weather-date">Saturday, March 26th</div>
                      <div className="weather-city">San Francisco, CA</div>
                    </div>
                  </div> */}
                  {/* END OF /. WEATHER */}
                  {/* START ADVERTISEMENT */}
                  <div className="add-inner mt-4">
                    <img
                      src="https://inews-neon.vercel.app/assets/images/add320x270-1.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  {/* END OF /. ADVERTISEMENT */}
                  {/* START ARCHIVE */}
                  {/* <div className="archive-wrapper">
                    <DatePickerComponents />
                  </div> */}
                  {/* END OF /. ARCHIVE */}
                  {/* START POLL WIDGET */}
                  {/* <PollWidget /> */}
                  {/* END OF /. POLL WIDGET */}
                  {/* START TAGS */}
                  <Tags tags={uniqueTags} />
                  {/* END OF /. TAGS */}
                </StickyBox>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* *** END OF /. PAGE MAIN CONTENT *** */}
      {/* *** END OF /. PAGE MAIN CONTENT *** */}
      <AdvertisementPopup />
    </Layout>
  );
}
