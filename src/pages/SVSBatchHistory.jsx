import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const SVSBatchHistory = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this batch and all its QR codes?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${productId}`);
      alert("Batch deleted successfully");
      fetchStats();
    } catch {
      alert("Failed to delete batch");
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${editProduct.id}`, {
        cropName: editProduct.name,
        packedVariety: editProduct.variety,
        mrp: editProduct.mrp,
        unitSalePrice: editProduct.usp,
        netQty: editProduct.netQty
      });
      alert("Product updated successfully!");
      setEditProduct(null);
      fetchStats();
    } catch {
      alert("Failed to update product");
    }
  };

  const downloadExcel = () => {
    const rows = [];
    stats.forEach(day => {
      day.products.forEach(p => {
        rows.push({
          "Date": p.date || day._id || "Unknown",
          "Crop Name": p.name || "Unknown",
          "Variety": p.variety || "Unknown",
          "Bags Produced": p.qty || 0,
          "MRP": p.mrp || "N/A",
          "Unit Sale Price": p.usp || "N/A",
          "Net Quantity": p.netQty || "N/A"
        });
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production_Logs");
    XLSX.writeFile(workbook, `SriVishnu_Seeds_Production_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <>
      <style>{`
        /* ════════════════════════════════
           BATCH HISTORY ROOT
        ════════════════════════════════ */
        .svsbh-root {
          max-width: 1050px;
          margin: 36px auto 0;
          padding: 0 28px 80px;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ════════════════════════════════
           MAIN CARD
        ════════════════════════════════ */
        .svsbh-card {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #d4e0d8;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 4px 6px rgba(17,29,20,0.04),
            0 16px 48px rgba(17,29,20,0.08);
          overflow: hidden;
        }

        /* Leaf-green accent stripe */
        .svsbh-card-stripe {
          height: 3px;
          background: #1bba6b;
        }

        /* ════════════════════════════════
           HEADER
        ════════════════════════════════ */
        .svsbh-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 28px 20px;
          border-bottom: 1px solid #d4e0d8;
          background: #f7faf8;
          gap: 16px;
          flex-wrap: wrap;
        }
        .svsbh-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .svsbh-header-icon {
          width: 40px; height: 40px;
          border-radius: 8px;
          background: rgba(27,186,107,0.08);
          border: 1px solid rgba(27,186,107,0.20);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .svsbh-header-icon svg { width: 17px; height: 17px; color: #1bba6b; }

        .svsbh-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 20px; font-weight: 400;
          color: #111d14;
          letter-spacing: -0.3px;
          margin: 0;
          line-height: 1.2;
        }
        .svsbh-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase;
          color: #7a9180;
          margin-top: 3px;
        }

        .svsbh-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111d14;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.4px;
          box-shadow: 0 3px 14px rgba(17,29,20,0.28);
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          white-space: nowrap;
          position: relative; overflow: hidden;
        }
        .svsbh-download-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(27,186,107,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .svsbh-download-btn svg { width: 14px; height: 14px; }
        .svsbh-download-btn:hover {
          background: #1bba6b;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(27,186,107,0.35);
        }

        /* ════════════════════════════════
           BODY
        ════════════════════════════════ */
        .svsbh-body { padding: 24px 28px; }

        /* Loading */
        .svsbh-loading {
          text-align: center;
          padding: 56px 20px;
        }
        .svsbh-loading-bars {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 5px;
          margin-bottom: 20px;
        }
        .svsbh-loading-bar {
          width: 4px;
          background: #1bba6b;
          border-radius: 2px;
          animation: svsbhBarAnim 1.2s ease-in-out infinite;
        }
        .svsbh-loading-bar:nth-child(1) { height: 16px; animation-delay: 0s; }
        .svsbh-loading-bar:nth-child(2) { height: 28px; animation-delay: 0.15s; }
        .svsbh-loading-bar:nth-child(3) { height: 20px; animation-delay: 0.30s; }
        .svsbh-loading-bar:nth-child(4) { height: 32px; animation-delay: 0.45s; }
        .svsbh-loading-bar:nth-child(5) { height: 16px; animation-delay: 0.60s; }
        @keyframes svsbhBarAnim {
          0%, 100% { opacity: 0.30; transform: scaleY(0.55); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        .svsbh-loading-text {
          font-family: 'Inter', sans-serif;
          font-size: 13px; color: #7a9180;
          letter-spacing: 0.2px;
        }

        /* Empty state */
        .svsbh-empty {
          text-align: center;
          padding: 64px 20px;
        }
        .svsbh-empty-icon {
          width: 52px; height: 52px;
          border-radius: 10px;
          background: #f2f6f3;
          border: 1px solid #d4e0d8;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .svsbh-empty-icon svg { width: 22px; height: 22px; color: #7a9180; }
        .svsbh-empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 17px; font-weight: 400;
          color: #3d5245; margin-bottom: 6px;
        }
        .svsbh-empty-sub {
          font-family: 'Inter', sans-serif;
          font-size: 12px; color: #7a9180;
          letter-spacing: 0.1px;
        }

        /* ════════════════════════════════
           DAY GROUP
        ════════════════════════════════ */
        .svsbh-day-group { margin-bottom: 30px; }
        .svsbh-day-group:last-child { margin-bottom: 0; }

        .svsbh-day-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e6ede8;
        }
        .svsbh-day-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #111d14;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500;
          padding: 5px 11px;
          border-radius: 4px;
          letter-spacing: 0.3px;
          flex-shrink: 0;
        }
        .svsbh-day-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1bba6b;
          box-shadow: 0 0 5px rgba(27,186,107,0.65);
        }
        .svsbh-day-label-text {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #7a9180;
        }
        .svsbh-day-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, #d4e0d8, transparent);
        }

        /* ════════════════════════════════
           TABLE
        ════════════════════════════════ */
        .svsbh-table-wrap {
          border-radius: 7px;
          border: 1px solid #d4e0d8;
          overflow-x: auto;
          box-shadow: 0 1px 4px rgba(17,29,20,0.04);
        }
        .svsbh-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 860px;
          font-family: 'Inter', sans-serif;
        }

        /* Table head */
        .svsbh-thead tr {
          background: #f2f6f3;
        }
        .svsbh-th {
          padding: 11px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: #3d5245;
          border-bottom: 2px solid #d4e0d8;
          white-space: nowrap;
        }
        .svsbh-th:first-child { padding-left: 20px; }
        .svsbh-th:last-child { padding-right: 20px; }

        /* Table rows */
        .svsbh-tr {
          border-bottom: 1px solid #eaf0ec;
          transition: background 0.10s;
        }
        .svsbh-tr:last-child { border-bottom: none; }
        .svsbh-tr:nth-child(even) { background: #fafcfa; }
        .svsbh-tr:hover { background: #f2f6f3; }

        .svsbh-td {
          padding: 12px 16px;
          font-size: 13px; color: #111d14;
          vertical-align: middle;
          line-height: 1.4;
        }
        .svsbh-td:first-child { padding-left: 20px; }
        .svsbh-td:last-child { padding-right: 20px; }
        .svsbh-td-bold { font-weight: 600; color: #111d14; }
        .svsbh-td-muted {
          font-family: 'JetBrains Mono', monospace;
          color: #7a9180; font-size: 11px; font-weight: 500; letter-spacing: 0.2px;
        }

        /* Bag count pill */
        .svsbh-bag-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          background: rgba(27,186,107,0.08);
          border: 1px solid rgba(27,186,107,0.22);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 600;
          color: #1d4528;
          white-space: nowrap;
        }

        /* ════════════════════════════════
           ACTION BUTTONS
        ════════════════════════════════ */
        .svsbh-actions {
          display: flex;
          gap: 7px;
          align-items: center;
        }
        .svsbh-edit-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(240,190,61,0.08);
          color: #7a6320;
          border: 1px solid rgba(240,190,61,0.35);
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .svsbh-edit-btn svg { width: 11px; height: 11px; }
        .svsbh-edit-btn:hover {
          background: rgba(240,190,61,0.16);
          border-color: rgba(240,190,61,0.58);
          color: #6b5818;
          transform: translateY(-1px);
        }

        .svsbh-delete-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(229,62,62,0.06);
          color: #9b1c1c;
          border: 1px solid rgba(229,62,62,0.24);
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .svsbh-delete-btn svg { width: 11px; height: 11px; }
        .svsbh-delete-btn:hover {
          background: rgba(229,62,62,0.13);
          border-color: rgba(229,62,62,0.45);
          transform: translateY(-1px);
        }

        /* ════════════════════════════════
           EDIT MODAL
        ════════════════════════════════ */
        .svsbh-overlay {
          position: fixed; inset: 0;
          background: rgba(10,20,12,0.72);
          backdrop-filter: blur(5px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
          animation: svsbhFadeIn 0.18s ease;
          padding: 20px;
        }
        @keyframes svsbhFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .svsbh-modal {
          background: #ffffff;
          border-radius: 10px;
          width: 100%;
          max-width: 460px;
          box-shadow:
            0 32px 80px rgba(0,0,0,0.45),
            0 8px 24px rgba(0,0,0,0.18);
          border: 1px solid #d4e0d8;
          overflow: hidden;
          animation: svsbhSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes svsbhSlideUp {
          from { transform: translateY(24px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .svsbh-modal-stripe {
          height: 3px;
          background: #1bba6b;
        }

        .svsbh-modal-header {
          padding: 20px 24px 18px;
          background: #111d14;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        /* Field-row scan lines on modal header */
        .svsbh-modal-header::before {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 14px,
            rgba(27,186,107,0.04) 14px, rgba(27,186,107,0.04) 15px
          );
          pointer-events: none;
        }

        .svsbh-modal-header-icon {
          width: 36px; height: 36px;
          border-radius: 7px;
          background: rgba(27,186,107,0.14);
          border: 1px solid rgba(27,186,107,0.28);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .svsbh-modal-header-icon svg { width: 16px; height: 16px; color: #1bba6b; }

        .svsbh-modal-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 18px; font-weight: 400;
          color: #fff; margin: 0;
          position: relative; z-index: 1;
          letter-spacing: -0.2px;
        }
        .svsbh-modal-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase;
          color: rgba(27,186,107,0.55);
          margin-top: 3px;
          position: relative; z-index: 1;
        }

        .svsbh-modal-body { padding: 22px 24px 8px; }

        .svsbh-modal-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.6px; text-transform: uppercase;
          color: #3d5245;
          margin-bottom: 6px;
        }
        .svsbh-modal-input {
          width: 100%;
          padding: 11px 14px;
          margin-bottom: 16px;
          border: 1.5px solid #c0d0c5;
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 14px; color: #111d14;
          background: #f7faf8;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
        }
        .svsbh-modal-input:focus {
          border-color: #1bba6b;
          box-shadow: 0 0 0 3px rgba(27,186,107,0.12);
          background: #fff;
        }
        .svsbh-modal-input::placeholder { color: #aabcb2; font-weight: 400; }

        .svsbh-modal-footer {
          display: flex;
          gap: 10px;
          padding: 8px 24px 24px;
        }
        .svsbh-save-btn {
          flex: 1;
          padding: 13px;
          background: #1bba6b;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.4px;
          box-shadow: 0 3px 12px rgba(27,186,107,0.30);
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .svsbh-save-btn:hover {
          background: #16a359;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(27,186,107,0.40);
        }
        .svsbh-cancel-btn {
          flex: 1;
          padding: 13px;
          background: transparent;
          color: #3d5245;
          border: 1.5px solid #d4e0d8;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: background 0.15s, border-color 0.15s;
        }
        .svsbh-cancel-btn:hover {
          background: #f2f6f3;
          border-color: #b8ccbc;
        }
      `}</style>

      <div className="svsbh-root">
        <div className="svsbh-card">
          <div className="svsbh-card-stripe" />

          <div className="svsbh-header">
            <div className="svsbh-header-left">
              <div className="svsbh-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <div>
                <h2 className="svsbh-title">Daily Production Monitor</h2>
                <div className="svsbh-subtitle">Batch History &amp; Records</div>
              </div>
            </div>
            <button onClick={downloadExcel} className="svsbh-download-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Excel
            </button>
          </div>

          <div className="svsbh-body">
            {loading ? (
              <div className="svsbh-loading">
                <div className="svsbh-loading-bars">
                  <div className="svsbh-loading-bar" />
                  <div className="svsbh-loading-bar" />
                  <div className="svsbh-loading-bar" />
                  <div className="svsbh-loading-bar" />
                  <div className="svsbh-loading-bar" />
                </div>
                <div className="svsbh-loading-text">Loading production data…</div>
              </div>
            ) : stats.length === 0 ? (
              <div className="svsbh-empty">
                <div className="svsbh-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div className="svsbh-empty-title">No production batches found</div>
                <div className="svsbh-empty-sub">Generate a batch above to see records here</div>
              </div>
            ) : (
              stats.map((day, index) => (
                <div key={index} className="svsbh-day-group">
                  <div className="svsbh-day-header">
                    <div className="svsbh-day-badge">
                      <div className="svsbh-day-badge-dot" />
                      {day._id || "Unknown Date"}
                    </div>
                    <span className="svsbh-day-label-text">Batch Group</span>
                    <div className="svsbh-day-line" />
                  </div>

                  <div className="svsbh-table-wrap">
                    <table className="svsbh-table">
                      <thead className="svsbh-thead">
                        <tr>
                          <th className="svsbh-th">Date</th>
                          <th className="svsbh-th">Crop Name</th>
                          <th className="svsbh-th">Variety</th>
                          <th className="svsbh-th">Bags</th>
                          <th className="svsbh-th">MRP</th>
                          <th className="svsbh-th">USP</th>
                          <th className="svsbh-th">Net Qty</th>
                          <th className="svsbh-th">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.products.map((p, i) => (
                          <tr key={i} className="svsbh-tr">
                            <td className="svsbh-td svsbh-td-muted">{p.date || day._id}</td>
                            <td className="svsbh-td svsbh-td-bold">{p.name || "Unknown"}</td>
                            <td className="svsbh-td">{p.variety || "Unknown"}</td>
                            <td className="svsbh-td">
                              <span className="svsbh-bag-pill">{p.qty || 0}</span>
                            </td>
                            <td className="svsbh-td">{p.mrp || "N/A"}</td>
                            <td className="svsbh-td">{p.usp || "N/A"}</td>
                            <td className="svsbh-td">{p.netQty || "N/A"}</td>
                            <td className="svsbh-td">
                              <div className="svsbh-actions">
                                <button onClick={() => setEditProduct(p)} className="svsbh-edit-btn">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Edit
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="svsbh-delete-btn">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {editProduct && (
        <div className="svsbh-overlay">
          <div className="svsbh-modal">
            <div className="svsbh-modal-stripe" />
            <div className="svsbh-modal-header">
              <div className="svsbh-modal-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="svsbh-modal-title">Edit Batch Details</h3>
                <div className="svsbh-modal-subtitle">Update product information</div>
              </div>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="svsbh-modal-body">
                <label className="svsbh-modal-label">Crop Name</label>
                <input className="svsbh-modal-input" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                <label className="svsbh-modal-label">Variety</label>
                <input className="svsbh-modal-input" value={editProduct.variety} onChange={(e) => setEditProduct({ ...editProduct, variety: e.target.value })} />
                <label className="svsbh-modal-label">MRP</label>
                <input className="svsbh-modal-input" value={editProduct.mrp} onChange={(e) => setEditProduct({ ...editProduct, mrp: e.target.value })} />
                <label className="svsbh-modal-label">Unit Sale Price (USP)</label>
                <input className="svsbh-modal-input" value={editProduct.usp} onChange={(e) => setEditProduct({ ...editProduct, usp: e.target.value })} />
                <label className="svsbh-modal-label">Net Quantity</label>
                <input className="svsbh-modal-input" value={editProduct.netQty} onChange={(e) => setEditProduct({ ...editProduct, netQty: e.target.value })} />
              </div>
              <div className="svsbh-modal-footer">
                <button type="submit" className="svsbh-save-btn">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)} className="svsbh-cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SVSBatchHistory;