// src/pages/mentor/ReportsIndex.jsx
import { useEffect, useState, useCallback } from "react";
import { ChildrenAPI } from "../../api/http";
import { Link } from "react-router-dom";
import "../../styles/mentor/ReportsIndex.css";

const ITEMS_PER_PAGE = 10;

export default function ReportsIndex() {
  const [kids, setKids] = useState([]);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async (page, search) => {
    setLoading(true);
    try {
      const result = await ChildrenAPI.list({ page, limit: ITEMS_PER_PAGE, search });
      setKids(result.children || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.total || 0);
      setCurrentPage(result.pagination?.page || 1);
    } catch (err) {
      console.error(err);
      setKids([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren(currentPage, q);
  }, [currentPage, q, fetchChildren]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== q) {
        setQ(searchInput);
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, q]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    "linear-gradient(135deg, #f472b6, #e11d48)",
    "linear-gradient(135deg, #a78bfa, #6366f1)",
    "linear-gradient(135deg, #60a5fa, #06b6d4)",
    "linear-gradient(135deg, #2dd4bf, #10b981)",
    "linear-gradient(135deg, #fb923c, #f59e0b)",
    "linear-gradient(135deg, #f87171, #ec4899)",
  ];

  const getAvatarColor = (name) => {
    const index = name ? name.charCodeAt(0) % avatarColors.length : 0;
    return avatarColors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <h1>Children Reports</h1>
        <p>View and manage reports for all children</p>
      </div>

      {/* Search Bar */}
      <div className="search-wrapper">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(""); setQ(""); }} className="clear-btn">×</button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {kids.length} of {total} children
        {q && ` matching "${q}"`}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && kids.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3>{q ? "No children found" : "No children yet"}</h3>
          <p>{q ? "Try adjusting your search terms" : "Children will appear here once added"}</p>
        </div>
      )}

      {/* Children Grid */}
      {!loading && kids.length > 0 && (
        <div className="children-grid">
          {kids.map((child) => (
            <Link key={child._id} to={`/mentor/reports/${child._id}`} className="child-card">
              <div className="card-header">
                <div className="avatar" style={{ background: getAvatarColor(child.name) }}>
                  {getInitials(child.name)}
                </div>
                <div className="card-info">
                  <h3 className="child-name">{child.name}</h3>
                  {child.account?.username && (
                    <span className="child-username">@{child.account.username}</span>
                  )}
                </div>
              </div>

              <div className="card-details">
                {child.dob && (
                  <div className="detail-row">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Born: {formatDate(child.dob)}</span>
                  </div>
                )}
                {child.parentId?.name && (
                  <div className="detail-row">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Parent: {child.parentId.name}</span>
                  </div>
                )}
                {child.account?.lastLoginAt && (
                  <div className="detail-row">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last active: {formatDate(child.account.lastLoginAt)}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="created-date">Added {formatDate(child.createdAt)}</span>
                <span className="view-link">
                  View Reports
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="pagination">
          <span className="page-info">
            Page {currentPage} of {totalPages} ({total} total children)
          </span>
          <div className="page-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ««
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            
            {totalPages > 1 && (
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, arr) => (
                    <span key={page} style={{ display: "flex", alignItems: "center" }}>
                      {index > 0 && arr[index - 1] !== page - 1 && <span className="ellipsis">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`page-num ${currentPage === page ? "active" : ""}`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}
              </div>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}