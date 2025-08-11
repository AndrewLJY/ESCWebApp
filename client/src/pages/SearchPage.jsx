import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { searchHotelsAPI } from "../middleware/searchApi";

import Header from "../components/header";
import SearchBar from "../components/SearchBar";
import SortingBar from "../components/SortingBar";

import "../styles/SearchPage.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Pagination, Spinner } from "react-bootstrap";

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const pageSize = 4;

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [pagedHotels, setPagedHotels] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(0);
  const [error, setError] = useState(null);

  // Validate search parameters
  const validateParams = (params) => {
    const checkin = params.get("checkin");
    const checkout = params.get("checkout");
    const location = params.get("location");
    const hotel = params.get("hotel");

    // Check if we have either location or hotel
    if (!location && !hotel) {
      return "Location or hotel name is required";
    }

    // Validate dates if provided
    if (checkin && isNaN(Date.parse(checkin))) {
      return "Invalid check-in date";
    }
    if (checkout && isNaN(Date.parse(checkout))) {
      return "Invalid check-out date";
    }
    if (checkin && checkout && new Date(checkin) >= new Date(checkout)) {
      return "Check-out date must be after check-in date";
    }

    return null;
  };

  // Fetch hotels (real API or fallback mock)
  const fetchData = useCallback(async (queryString) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(queryString);

    // Validate parameters
    const validationError = validateParams(params);
    if (validationError) {
      setError(validationError);
      setHotels([]);
      setFilteredHotels([]);
      setLoading(false);
      return;
    }

    const payload = { hotelType: "Hotel" };
    if (params.get("location")) payload.location = params.get("location");
    if (params.get("hotel")) payload.hotel = params.get("hotel");
    if (params.get("checkin")) payload.checkIn = params.get("checkin");
    if (params.get("checkout")) payload.checkOut = params.get("checkout");
    payload.guests = Number(params.get("guests")) || 1;
    payload.roomNum = Number(params.get("roomNum")) || 1;

    try {
      const resp = await searchHotelsAPI(payload);
      console.log(resp);

      if (!resp || !resp.data) {
        setHotels([]);
        setFilteredHotels([]);
        setPagedHotels([]);
        setDestinationId("");
        return;
      }

      let data = resp.data.hotels || [];
      if (payload.hotel && data.length > 0) {
        const name = payload.hotel.toLowerCase();
        data = data.filter(
          (h) =>
            h?.keyDetails?.name?.toLowerCase().includes(name) &&
            h?.pricingRankingData?.lowestPrice
        );
      }

      setHotels(data);
      setFilteredHotels(data);
      setStartPage(0);

      if (data.length > pageSize) {
        data = data.slice(0, pageSize);
      }

      setPagedHotels(data);

      setDestinationId(resp.data.destination_id || "");
    } catch (err) {
      console.error("Search error:", err);
      setHotels([]);
      setFilteredHotels([]);
      setPagedHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilteredHotels = useCallback(
    (filtered) => {
      setFilteredHotels(filtered);
      setStartPage(0);
      const paged = filtered.slice(0, pageSize);
      setPagedHotels(paged);
    },
    [pageSize]
  );

  // Run fetch on mount and whenever the query string changes
  useEffect(() => {
    const qs = search.startsWith("?") ? search.slice(1) : search;
    fetchData(qs);
  }, [search, fetchData]);

  return (
    <>
      <Header />
      <div className="search-page">
        <main className="sp-main">
          <section className="search-and-filter">
            <div className="filter-bar-wrapper">
              <SearchBar
                search={search}
                fetchData={fetchData}
                isSearchPage={true}
              />
            </div>
          </section>

          <section className="sp-results">
            <div className="results-container">
              {hotels.length > 0 && (
                <aside className="sorting-sidebar">
                  <SortingBar
                    hotels={hotels}
                    onFilteredHotels={handleFilteredHotels}
                  />
                </aside>
              )}
              <div className="hotel-results">
                {loading ? (
                  // <div className="loading">Loading hotels...</div>
                  <SkeletonTheme baseColor="#8e98daff" highlightColor="#cde1ffff">
                    <Skeleton
                      count={4}
                      height={150}
                      className="hotel-skeleton"
                    />
                  </SkeletonTheme>
                ) : error ? (
                  <div className="error-message">
                    Invalid search parameters, please re-enter
                  </div>
                ) : filteredHotels.length === 0 ? (
                  <div>No hotels found.</div>
                ) : (
                  pagedHotels.map((h) => (
                    <div
                      key={h?.keyDetails?.id || Math.random()}
                      className="hotel-card"
                    >
                      <img
                        className="hotel-img "
                        src={(() => {
                          // Prefer stitchedImageUrls if available
                          if (
                            h?.imageDetails?.stitchedImageUrls &&
                            Array.isArray(h.imageDetails.stitchedImageUrls) &&
                            h.imageDetails.stitchedImageUrls.length > 0
                          ) {
                            return h.imageDetails.stitchedImageUrls[0];
                          }
                          // Otherwise try a thumbnailUrl if your API provides it
                          if (h?.imageDetails?.thumbnailUrl) {
                            return h.imageDetails.thumbnailUrl;
                          }
                          // Fallback to default placeholder
                          return "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg";
                        })()}
                        alt={h?.keyDetails?.name || "Hotel"}
                      />

                      <div className="hotel-info text-start m-3">
                        <p className="fs-5 fw-medium m-0 lh-sm text-gray">
                          {h?.keyDetails?.name || "Unknown Hotel"}
                        </p>
                        <div className="stars">
                          {"★".repeat(Math.floor(h?.keyDetails?.rating || 0))}
                        </div>
                        <p className="address m-0">
                          {h?.keyDetails?.address || "Address not available"}
                        </p>
                        <p className="rating fs-6">
                          Guest Rating:{" "}
                          {h?.keyDetails?.rating
                            ? `${h.keyDetails.rating}/5`
                            : "NA"}
                        </p>
                      </div>

                      <div className="hotel-book m-3">
                        <p className="fs-5 fw-medium text-start p-0 m-0">
                          From
                        </p>
                        <p className="fs-4 fw-bold text-start mt-0">
                          {" "}
                          {h.pricingRankingData?.lowestPrice != null
                            ? Math.floor(h.pricingRankingData.lowestPrice) +
                              " SGD"
                            : "Price unavailable"}
                        </p>
                        <button
                          className="btn book-small"
                          onClick={() => {
                            navigate(`/hotel/${h?.keyDetails?.id}${search}`, {
                              state: {
                                hotelDetails: h,
                                destinationId: destinationId,
                              },
                            });
                          }}
                        >
                          View More Details
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {!loading && (
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => {
                        setStartPage((prevState) => {
                          var newState = prevState - pageSize;
                          setPagedHotels(
                            filteredHotels.slice(newState, newState + pageSize)
                          );
                          return newState;
                        });
                      }}
                      disabled={startPage - pageSize < 0}
                    />
                    <Pagination.Next
                      onClick={() => {
                        setStartPage((prevState) => {
                          var newState = prevState + pageSize;
                          setPagedHotels(
                            filteredHotels.slice(newState, newState + pageSize)
                          );
                          return newState;
                        });
                      }}
                      disabled={startPage + pageSize > filteredHotels.length}
                    />
                  </Pagination>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
