import React from "react";
import "../styles/FilterBar.css";

export default function FilterBar({
  filters,
  toggle,
  update,
  fmtDate,
  onSearch,
  showModify = false,
}) {
  return (
    <div className={`filter-bar${showModify ? " sp-filter-bar" : ""}`}>
      {Object.entries(filters).map(([key, { open, value }]) => (
        <React.Fragment key={key}>
          <div className="filter">
            {open ? (
              key === "checkin" || key === "checkout" ? (
                <input
                  className="filter-input"
                  type="date"
                  value={value}
                  onChange={(e) => update(key, e.target.value)}
                  onBlur={() => toggle(key)}
                  autoFocus
                />
              ) : key === "guests" ? (
                <input
                  className="filter-input"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={value}
                  onChange={(e) => update(key, e.target.value)}
                  onBlur={() => toggle(key)}
                  autoFocus
                />
              ) : (
                <input
                  className="filter-input"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) => update(key, e.target.value)}
                  onBlur={() => toggle(key)}
                  autoFocus
                />
              )
            ) : (
              <button className="filter-btn" onClick={() => toggle(key)}>
                <span>
                  {value ||
                    (key === "checkin" || key === "checkout"
                      ? key === "checkin"
                        ? "Check in"
                        : "Check out"
                      : key.charAt(0).toUpperCase() + key.slice(1))}
                </span>
              </button>
            )}
          </div>
          {/* don't render separator after last */}
          {key !== "guests" && <div className="separator" />}
        </React.Fragment>
      ))}

      {showModify ? (
        <button className="btn modify" onClick={onSearch}>
          Modify
        </button>
      ) : (
        <button className="filter-search-btn" onClick={onSearch}>
          Search
        </button>
      )}
    </div>
  );
}
