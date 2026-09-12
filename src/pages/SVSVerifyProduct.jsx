import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/logo.png";

export default function SVSVerifyProduct() {
  const { labelNumber } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Automatically cleans up the database number and formats it as Rs. XXX.00/-
  const formatMRP = (val) => {
    if (!val) return '';
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return val;
    return `Rs. ${num.toFixed(2)}`;
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify/${labelNumber}`)
      .then(res => setData(res.data))
      .catch(() => setError(true));
  }, [labelNumber]);

  // ── Error State ──
  if (error) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .svs-state {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #0D1F0F;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,150,42,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(201,150,42,0.05) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
          gap: 20px; padding: 40px 20px; text-align: center;
        }
        .svs-state-icon {
          width: 72px; height: 72px;
          border: 1px solid rgba(201,150,42,0.4);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .svs-state-icon::before {
          content: ''; position: absolute; inset: 4px;
          border: 1px solid rgba(201,150,42,0.2);
          border-radius: 50%;
        }
        .svs-state-icon-x {
          font-size: 22px; color: #C9962A; font-weight: 300; line-height: 1;
        }
        .svs-state-rule {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, #C9962A, transparent);
        }
        .svs-state-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 600; font-style: italic;
          color: #C9962A; letter-spacing: 0.5px;
        }
        .svs-state-sub {
          font-size: 13px; color: rgba(248,243,232,0.45);
          max-width: 260px; line-height: 1.75; font-weight: 300;
          letter-spacing: 0.2px;
        }
      `}</style>
      <div className="svs-state">
        <div className="svs-state-icon">
          <span className="svs-state-icon-x">✕</span>
        </div>
        <div className="svs-state-rule" />
        <div className="svs-state-title">Invalid Product Code</div>
        <div className="svs-state-sub">This QR code could not be verified. Please check the label and try again.</div>
      </div>
    </>
  );

  // ── Loading State ──
  if (!data) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .svs-state {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #0D1F0F;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,150,42,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(201,150,42,0.05) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
          gap: 24px; padding: 40px 20px; text-align: center;
        }
        .svs-load-logo {
          width: 72px; height: 72px;
          border: 1px solid rgba(201,150,42,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          animation: svsRotateBorder 3s linear infinite;
        }
        @keyframes svsRotateBorder {
          0% { box-shadow: 0 0 0 0 rgba(201,150,42,0), inset 0 0 0 0 rgba(201,150,42,0); }
          50% { box-shadow: 0 0 24px 2px rgba(201,150,42,0.18), inset 0 0 12px 0 rgba(201,150,42,0.08); }
          100% { box-shadow: 0 0 0 0 rgba(201,150,42,0), inset 0 0 0 0 rgba(201,150,42,0); }
        }
        .svs-load-logo img { width: 44px; height: 44px; object-fit: contain; filter: brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg); opacity: 0.85; }
        .svs-load-emblem-fallback {
          font-size: 26px; opacity: 0.8;
        }
        .svs-load-rule {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,150,42,0.6), transparent);
        }
        .svs-load-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 500; color: #F8F3E8;
          letter-spacing: 0.5px;
        }
        .svs-load-sub {
          font-size: 10px; color: rgba(201,150,42,0.6);
          letter-spacing: 3.5px; text-transform: uppercase; font-weight: 400;
        }
        .svs-dots { display: flex; gap: 8px; align-items: center; }
        .svs-dots span {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: rgba(201,150,42,0.5);
          animation: svsDot 1.4s ease-in-out infinite;
        }
        .svs-dots span:nth-child(2) { animation-delay: 0.22s; }
        .svs-dots span:nth-child(3) { animation-delay: 0.44s; }
        @keyframes svsDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="svs-state">
        <div className="svs-load-logo">
          <img src={logo} alt="SVS Logo" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <span className="svs-load-emblem-fallback" style={{display:'none'}}>🌾</span>
        </div>
        <div className="svs-load-rule" />
        <div className="svs-load-title">Ganga Kaveri Seeds</div>
        <div className="svs-load-sub">Verifying authenticity</div>
        <div className="svs-dots"><span /><span /><span /></div>
      </div>
    </>
  );

  // ── Verified State ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── ROOT ── */
        .svs-vp-root {
          min-height: 100vh;
          background: #0D1F0F;
          background-image:
            radial-gradient(ellipse 100% 55% at 50% -5%, rgba(201,150,42,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 10% 50%, rgba(13,31,15,0.0) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 80%, rgba(201,150,42,0.04) 0%, transparent 55%);
          padding: 32px 16px 64px;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── CARD ── */
        .svs-vp-card {
          position: relative;
          max-width: 460px;
          margin: 0 auto;
          background: #F8F3E8;
          border-radius: 3px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(201,150,42,0.35),
            0 0 0 5px rgba(13,31,15,0.6),
            0 0 0 6px rgba(201,150,42,0.18),
            0 32px 80px rgba(0,0,0,0.55),
            0 8px 24px rgba(0,0,0,0.35);
        }

        /* Outer gold frame lines — decorative pseudo-border */
        .svs-vp-card::before {
          content: '';
          position: absolute; inset: 8px;
          border: 1px solid rgba(201,150,42,0.22);
          border-radius: 1px;
          pointer-events: none;
          z-index: 10;
        }

        /* ── TOP ORNAMENT BAR ── */
        .svs-vp-top {
          height: 6px;
          background: linear-gradient(90deg,
            #5A7A5C 0%,
            #C9962A 25%,
            #E8B84B 45%,
            #C9962A 55%,
            #E8B84B 70%,
            #C9962A 80%,
            #5A7A5C 100%
          );
        }

        /* ── HEADER ── */
        .svs-vp-header {
          text-align: center;
          padding: 32px 28px 26px;
          border-bottom: 1px solid rgba(201,150,42,0.2);
          background: linear-gradient(180deg, rgba(201,150,42,0.06) 0%, transparent 100%);
          position: relative;
        }

        /* Corner ornaments */
        .svs-vp-header::before,
        .svs-vp-header::after {
          content: '✦';
          position: absolute;
          font-size: 8px;
          color: rgba(201,150,42,0.4);
          top: 14px;
        }
        .svs-vp-header::before { left: 20px; }
        .svs-vp-header::after  { right: 20px; }

        .svs-vp-emblem {
          width: 72px; height: 72px;
          margin: 0 auto 16px;
          border-radius: 50%;
          border: 1px solid rgba(201,150,42,0.4);
          display: flex; align-items: center; justify-content: center;
          background: #fff;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .svs-vp-emblem::before {
          content: ''; position: absolute; inset: 4px;
          border: 1px solid rgba(201,150,42,0.15);
          border-radius: 50%;
        }
        .svs-vp-emblem img {
          width: 46px; height: 46px; object-fit: contain;
        }
        .svs-vp-emblem-fallback {
          font-size: 28px;
        }

        .svs-vp-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700;
          color: #0D1F0F;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .svs-vp-pvt {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #C9962A;
          margin-top: 3px;
        }

        /* Gold rule divider */
        .svs-vp-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 16px auto 0;
          width: fit-content;
        }
        .svs-vp-divider-line {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, #C9962A);
        }
        .svs-vp-divider-line.rev {
          background: linear-gradient(90deg, #C9962A, transparent);
        }
        .svs-vp-divider-diamond {
          width: 6px; height: 6px;
          background: #C9962A;
          transform: rotate(45deg);
        }

        .svs-vp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 7px 18px;
          background: #0D1F0F;
          border: 1px solid rgba(201,150,42,0.5);
          border-radius: 2px;
          color: #C9962A;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        .svs-vp-check {
          width: 16px; height: 16px;
          border: 1px solid #C9962A;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #C9962A; font-size: 8px;
          flex-shrink: 0; line-height: 1;
        }

        /* ── MANIFEST TABLE ── */
        .svs-vp-table {
          display: flex; flex-direction: column;
        }

        .svs-vp-row {
          display: flex;
          border-bottom: 1px solid rgba(201,150,42,0.12);
          position: relative;
        }
        .svs-vp-row:last-child { border-bottom: none; }

        /* Subtle left accent on hover */
        .svs-vp-row::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 0;
          background: rgba(201,150,42,0.08);
          transition: width 0.2s ease;
        }
        .svs-vp-row:hover::before { width: 100%; }

        .svs-vp-lbl {
          flex: 1;
          padding: 12px 16px 12px 20px;
          background: rgba(201,150,42,0.05);
          font-size: 9px; font-weight: 600;
          color: #5A7A5C;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          line-height: 1.6;
          border-right: 1px solid rgba(201,150,42,0.14);
          font-family: 'DM Sans', sans-serif;
          position: relative; z-index: 1;
          display: flex;
          align-items: center;
        }
        .svs-vp-val {
          flex: 1.65;
          padding: 12px 20px 12px 16px;
          font-size: 13px; font-weight: 400;
          color: #1C2B1D;
          line-height: 1.6;
          font-family: 'DM Sans', sans-serif;
          position: relative; z-index: 1;
          display: flex;
          align-items: center;
        }
        .svs-vp-val.bold {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 16px;
          color: #0D1F0F; letter-spacing: 0.3px;
        }
        
        /* Subtle but significant MRP styling */
        .svs-vp-val.mrp-large {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; 
          font-size: 16px; 
          color: #0D1F0F; 
        }

        /* Section divider between rows groups */
        .svs-vp-section-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(201,150,42,0.08), rgba(201,150,42,0.35), rgba(201,150,42,0.08));
          margin: 0;
        }

        /* ── PDF BUTTON AREA ── */
        .svs-vp-pdf-area {
          padding: 22px 24px 26px;
          background: linear-gradient(180deg, rgba(201,150,42,0.04) 0%, rgba(201,150,42,0.07) 100%);
          border-top: 1px solid rgba(201,150,42,0.2);
        }
        .svs-vp-pdf-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 15px 20px;
          background: #0D1F0F;
          color: #C9962A;
          text-decoration: none;
          border-radius: 2px;
          border: 1px solid rgba(201,150,42,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(201,150,42,0.1);
          transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
          position: relative; overflow: hidden;
        }
        .svs-vp-pdf-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,150,42,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .svs-vp-pdf-btn:hover {
          background: #152B17;
          border-color: rgba(201,150,42,0.7);
          box-shadow: 0 6px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,150,42,0.2), inset 0 1px 0 rgba(201,150,42,0.15);
        }

        /* ── BOTTOM BAR ── */
        .svs-vp-bottom {
          height: 6px;
          background: linear-gradient(90deg,
            #5A7A5C 0%,
            #C9962A 25%,
            #E8B84B 45%,
            #C9962A 55%,
            #E8B84B 70%,
            #C9962A 80%,
            #5A7A5C 100%
          );
        }

        /* ── FOOTER ── */
        .svs-vp-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 9px; font-weight: 400;
          color: rgba(248,243,232,0.25);
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="svs-vp-root">
        <div className="svs-vp-card">
          <div className="svs-vp-top" />

          {/* HEADER */}
          <div className="svs-vp-header">
            <div className="svs-vp-emblem">
              <img
                src={logo}
                alt="Ganga Kaveri Seeds"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
              />
              <span className="svs-vp-emblem-fallback" style={{display:'none'}}>🌾</span>
            </div>
            <div className="svs-vp-brand">Ganga Kaveri Seeds</div>
            <div className="svs-vp-pvt">Pvt. Ltd.</div>
            <div className="svs-vp-divider">
              <div className="svs-vp-divider-line" />
              <div className="svs-vp-divider-diamond" />
              <div className="svs-vp-divider-line rev" />
            </div>
            <div className="svs-vp-badge">
              <div className="svs-vp-check">✔</div>
              Genuine Product Verified
            </div>
          </div>

          {/* DETAILS */}
          <div className="svs-vp-table">
            <Row label="Label Number"      value={data.labelNumber}               bold />
            <Row label="Crop Name"         value={data.cropName}                  bold />
            <div className="svs-vp-section-rule" />
            <Row label="Packed Variety"    value={data.packedVariety} />
            <Row label="Lot Number"        value={data.packedLotNumber} />
            <div className="svs-vp-section-rule" />
            <Row label="Date of Testing"   value={formatDate(data.dateOfTesting)} />
            <Row label="Date of Packaging" value={formatDate(data.dateOfPackaging)} />
            <Row label="Date of Expiry"    value={formatDate(data.dateOfExpiry)} />
            <div className="svs-vp-section-rule" />
            
            {/* Updated MRP Row with formatter and isMrp flag */}
            <Row label="MRP"               value={formatMRP(data.mrp)}            isMrp />
            
            <Row label="Unit Sale Price"   value={data.unitSalePrice} />
            <Row label="Net Quantity"      value={data.netQty} />
            <div className="svs-vp-section-rule" />
            <Row label="Office Address"    value={data.packedAt} />
            <Row label="Plant Address"     value={data.plantAddress} />
            <Row label="Produced & Marketed By"       value={data.producedBy} />
          </div>

          {/* PDF */}
          <div className="svs-vp-pdf-area">
            <a href={data.leafletUrl} target="_blank" rel="noreferrer" className="svs-vp-pdf-btn">
              📄 View Product Leaflet (PDF)
            </a>
          </div>

          <div className="svs-vp-bottom" />
        </div>

        <p className="svs-vp-footer">© {new Date().getFullYear()} Ganga Kaveri Seeds Pvt. Ltd.</p>
      </div>
    </>
  );
}

// Updated Row component to support the custom MRP styling
const Row = ({ label, value, bold, isMrp }) => {
  let valClass = "svs-vp-val";
  if (isMrp) valClass += " mrp-large";
  else if (bold) valClass += " bold";

  return (
    <div className="svs-vp-row">
      <div className="svs-vp-lbl">{label}</div>
      <div className={valClass}>{value}</div>
    </div>
  );
};