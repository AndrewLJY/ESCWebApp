import React from "react";
// import "../styles/FilterBar.css";

export default function FilterBar({
  search,
  fetchData,
  isSearchPage = false,
  className = "",
}) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location_filters: { open: false, value: "" },
    hotel_filters: { open: false, value: "" },
    checkin_filters: { open: false, value: "" },
    checkout_filters: { open: false, value: "" },
    guests_filters: { open: false, value: "" },
  });

  const [locationFilter, setLocationFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("1");

  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const update = (key, val) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

  const onSearch = () => {
    const {
      location_filters,
      hotel_filters,
      checkin_filters,
      checkout_filters,
      guests_filters,
    } = filters;

    if (
      !location_filters.value.trim() &&
      !hotel_filters.value.trim() &&
      !locationFilter.trim() &&
      !hotelFilter.trim()
    ) {
      alert("Please enter a location or a hotel name.");
      return;
    }

    if (!checkin_filters.value && !checkin) {
      alert("Please select a check-in date.");
      return;
    }
    if (!checkout_filters.value && !checkout) {
      alert("Please select a check-out date.");
      return;
    }

    if (isSearchPage) {
      if (!guests) {
        alert("Please specify number of guests.");
        return;
      }
    } else {
      if (!guests_filters.value) {
        alert("Please specify number of guests.");
        return;
      }
    }

    const params = new URLSearchParams();
    if (isSearchPage) {
      if (locationFilter.trim()) params.set("location", locationFilter.trim());
      if (hotelFilter.trim()) params.set("hotel", hotelFilter.trim());
      params.set("checkin", checkin);
      params.set("checkout", checkout);
      params.set("guests", guests);
    } else {
      if (location_filters.value.trim())
        params.set("location", location_filters.value.trim());
      if (hotel_filters.value.trim())
        params.set("hotel", hotel_filters.value.trim());
      params.set("checkin", checkin_filters.value);
      params.set("checkout", checkout_filters.value);
      params.set("guests", guests_filters.value);
    }

    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    if (isSearchPage) {
      const qs = search.startsWith("?") ? search.slice(1) : search;
      const params = new URLSearchParams(qs);
      setLocationFilter(params.get("location") || "");
      setHotelFilter(params.get("hotel") || "");
      setCheckin(params.get("checkin") || "");
      setCheckout(params.get("checkout") || "");
      setGuests(params.get("guests") || "1");
    }
  }, [search, fetchData, isSearchPage]);

  return (
    <div className={`filter-bar-wrapper ${className}`}>
      {isSearchPage ? (
        <div className="sp-filter-bar">
          <input
            type="text"
            placeholder="Location"
            className="filter-input"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hotel name"
            className="filter-input"
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          />
          <input
            type="date"
            className="filter-input"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
          <input
            type="date"
            className="filter-input"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
          <input
            type="number"
            className="filter-input"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
          <button className="sp-filter-search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
      ) : (
        <div className="filter-bar">
          {Object.entries(filters).map(([key, obj]) => (
            <React.Fragment key={key}>
              <div className="filter">
                {obj.open ? (
                  <input
                    autoFocus
                    className="filter-input"
                    type={
                      key.includes("date") || key.includes("check")
                        ? "date"
                        : key.includes("guests")
                        ? "number"
                        : "text"
                    }
                    placeholder={key.includes("guests") ? "1" : ""}
                    min={key.includes("guests") ? "1" : undefined}
                    value={obj.value}
                    onChange={(e) => update(key, e.target.value)}
                    onBlur={() => toggle(key)}
                  />
                ) : (
                  <button className="filter-btn" onClick={() => toggle(key)}>
                    <span>
                      {obj.value
                        ? key.includes("guests")
                          ? `Guests: ${obj.value}`
                          : key.includes("check")
                          ? fmtDate(obj.value)
                          : obj.value
                        : key
                            .replace("_filters", "")
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </button>
                )}
              </div>
              <div className="separator" />
            </React.Fragment>
          ))}
          <button className="filter-search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
      )}
    </div>
  );
}
