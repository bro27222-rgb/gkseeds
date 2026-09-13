import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generateLabelsPDF } from '../utils/pdfGenerator';
import SVSBatchHistory from './SVSBatchHistory';
import logo from '../assets/logo.png';

const CROPS = [
  "Bajra",
  "Cotton",
  "Maize",
  "Sunflower",
  "Jowar",
  "Mustard",
  "Wheat"
];

const CROP_LEAFLETS = {
  "Bajra": "https://drive.google.com/file/d/1svp2DvUH5tD4Ovby3_uzXp6sgbqXHCiO/view?usp=sharing",
  "Cotton": "https://drive.google.com/file/d/1JSYQAu_kYYeFwzArwWMrSAt1VPNGQvOW/view?usp=sharing",
  "Maize": "https://drive.google.com/file/d/1RVhpWdYzaBnwuS9uzMoCySyIy9V3c3AM/view?usp=sharing",
  "Sunflower": "https://drive.google.com/file/d/19Fj4FPAOHSYWzsvzT4yAPC9bhuUU_7DS/view?usp=sharing",
  "Jowar": "https://drive.google.com/file/d/12NpeogbPJCunm53qdFabnYNdWHNhozhw/view?usp=sharing",
  "Mustard": "https://drive.google.com/file/d/1Z3nK4nYi941OKPtsP1hByX3e6ZnRXAAi/view?usp=sharing",
  "Wheat": "https://drive.google.com/file/d/16zyKrj-ZZIm6u8oqneQtQhxfnFGrq9sd/view?usp=sharing"
};

const ADDRESS_OPTIONS = [
  {
    label: "Jaipur Facility",
    value: "Ganga Kaveri seeds Pvt Ltd\nC-110 , Road no 08\nVKI Area Jaipur -302013\nMob 8058888811\nGST no 08AAACG3220D1ZA"
  },
  {
    label: "Maktha Facility",
    value: "M/s Ganga Kaveri Seeds Pvt Ltd\nH.No:7-73, 7-74, 7-75, 7-75/1, 7-75/2, 7-75/3,\nVill:Maktha,\nMolangur,\nShankarapatnam,\nDist: Karimnagar,\nState: Telangana,\nPIN:505470,\nMobile: 9866343771"
  },
  {
    label: "Medchal Facility",
    value: "Ganga Kaveri Seeds pvt Ltd\nc/o Sunanda Farm,\nS no: 115/116,\nKandlakoya,\nMedchal,malkajrigi,\nNear by Oxygen Park OPP ,\npin no :501401"
  },
  {
    label: "Gajwel Facility",
    value: "Gangakaveri seeds Pvt.Ltd ,\nVil : Kodakandla,\nMndl : Gajwel,\nDist : Siddipet,\nPincode : 502312"
  }
];

export default function SVSAdminDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '', variety: '', packedLotNumber: '',
    dateOfTesting: '', packagingDate: '', dateOfExpiry: '',
    mrp: '', totalWeight: '', netQty: '', unitSalePrice: '',
    packedAt: ADDRESS_OPTIONS[0].value,
    plantAddress: ADDRESS_OPTIONS[1].value,
    producedBy: 'Ganga Kaveri Seeds Pvt. Ltd.',
    quantity: 10
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // ── NEW: Toast Notification State ──
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  useEffect(() => {
    const mrpVal = parseFloat(String(formData.mrp).replace(/[^0-9.]/g, ''));
    const netQtyVal = parseFloat(String(formData.netQty).replace(/[^0-9.]/g, ''));
    const totalWeightVal = parseFloat(String(formData.totalWeight).replace(/[^0-9.]/g, ''));

    let updates = {};

    if (!isNaN(mrpVal) && !isNaN(netQtyVal) && netQtyVal > 0) {
      const calculated = `Rs ${(mrpVal / netQtyVal).toFixed(2)} / Kg`;
      if (formData.unitSalePrice !== calculated) updates.unitSalePrice = calculated;
    }

    if (!isNaN(totalWeightVal) && !isNaN(netQtyVal) && netQtyVal > 0) {
      const bags = Math.ceil(totalWeightVal / netQtyVal).toString();
      if (String(formData.quantity) !== bags) updates.quantity = bags;
    }

    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [formData.mrp, formData.netQty, formData.totalWeight]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getAddressIndex = (addressString) => {
    const index = ADDRESS_OPTIONS.findIndex(opt => opt.value === addressString);
    return index !== -1 ? index : 0;
  };

  const handleLogout = () => {
    localStorage.removeItem('svs_token');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress({ current: 0, total: 0 }); 

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    const selectedLeaflet = CROP_LEAFLETS[formData.productName] || "No Leaflet Provided";
    data.append('leaflet', selectedLeaflet);

    // Grab JWT Token for the request
    const token = localStorage.getItem('svs_token');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/generate`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const totalLabels = response.data.labelNumbers.length;
      setProgress({ current: 0, total: totalLabels }); 

      await generateLabelsPDF(response.data.labelNumbers, (currentCount) => {
        setProgress({ current: currentCount, total: totalLabels });
      });

      // Show success notification instead of alert
      showToast("Batch generated and secured successfully!", "success");
      
      // Delay reload to let the user see the notification
      setTimeout(() => {
        window.location.reload();
      }, 3500);

    } catch (err) {
      // Capture the exact backend error message if available
      const errorMsg = err.response?.data?.error || "Error generating batch. Please check connection.";
      showToast(errorMsg, "error");
      setLoading(false);
    }
  };

  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --svs-ink:         #111d14;
          --svs-forest:      #1d4528;
          --svs-leaf:        #1bba6b;
          --svs-leaf-lt:     #34d884;
          --svs-surface:     #f2f6f3;
          --svs-white:       #ffffff;
          --svs-border:      #d4e0d8;
          --svs-border-dk:   #c0d0c5;
          --svs-text:        #111d14;
          --svs-text-mid:    #3d5245;
          --svs-text-muted:  #7a9180;
          --svs-danger:      #e74c3c;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .svsd-root {
          font-family: 'Inter', sans-serif;
          font-weight: 400; background: var(--svs-surface);
          min-height: 100vh; padding-bottom: 80px; -webkit-font-smoothing: antialiased;
        }

        /* ── TOAST NOTIFICATION CSS ── */
        .svsd-toast {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: var(--svs-ink);
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(17,29,20,0.4);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform: translateX(-150%);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
          min-width: 320px;
        }
        .svsd-toast.show {
          transform: translateX(0);
        }
        .svsd-toast-message {
          font-weight: 500;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .svsd-toast-bar-wrap {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          width: 100%;
          overflow: hidden;
        }
        .svsd-toast-bar {
          height: 100%;
          background: var(--svs-leaf);
          width: 100%;
          transform-origin: left;
        }
        .svsd-toast.error .svsd-toast-bar {
          background: var(--svs-danger);
        }
        .svsd-toast.error .svsd-toast-icon {
          color: var(--svs-danger);
        }
        .svsd-toast.success .svsd-toast-icon {
          color: var(--svs-leaf);
        }
        @keyframes shrinkToastBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        .svsd-toast.show .svsd-toast-bar {
          animation: shrinkToastBar 3.5s linear forwards;
        }

        /* ── EXISTING STYLES ── */
        .svsd-navbar {
          background: var(--svs-ink); position: sticky; top: 0; z-index: 200;
          box-shadow: 0 1px 0 rgba(27,186,107,0.15), 0 4px 24px rgba(0,0,0,0.35);
        }
        .svsd-navbar-stripe { height: 3px; background: linear-gradient(90deg, transparent 0%, var(--svs-leaf) 30%, var(--svs-leaf-lt) 50%, var(--svs-leaf) 70%, transparent 100%); }
        .svsd-nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 68px; }
        .svsd-nav-brand { display: flex; align-items: center; gap: 14px; }
        .svsd-nav-logo-ring { width: 40px; height: 40px; border-radius: 8px; background: rgba(27,186,107,0.10); border: 1px solid rgba(27,186,107,0.28); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px; }
        .svsd-nav-logo-ring img { width: 100%; height: 100%; object-fit: contain; filter: brightness(1.1); }
        .svsd-nav-name { font-family: 'DM Serif Display', serif; font-size: 15px; color: #fff; line-height: 1.2; }
        .svsd-nav-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(27,186,107,0.65); letter-spacing: 1px; text-transform: uppercase; }
        .svsd-nav-right { display: flex; gap: 14px; }
        .svsd-logout-btn { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); color: rgba(255,255,255,0.65); padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; }
        .svsd-logout-btn svg { width: 13px; height: 13px; }

        .svsd-page-header { background: var(--svs-white); border-bottom: 1px solid var(--svs-border); padding: 48px 32px 44px; text-align: center; }
        .svsd-header-title { font-family: 'DM Serif Display', serif; font-size: 42px; margin-bottom: 12px; }
        .svsd-header-title em { color: var(--svs-leaf); font-style: italic; }
        .svsd-header-sub { font-size: 13px; color: var(--svs-text-muted); }

        .svsd-container { max-width: 1050px; margin: 0 auto; padding: 36px 28px 0; }
        .svsd-form-card { background: var(--svs-white); border-radius: 10px; border: 1px solid var(--svs-border); overflow: hidden; box-shadow: 0 16px 48px rgba(17,29,20,0.08); }
        .svsd-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .svsd-col { padding: 32px 36px 28px; }
        .svsd-col:first-child { border-right: 1px solid var(--svs-border); }
        @media (max-width: 720px) { .svsd-grid { grid-template-columns: 1fr; } .svsd-col:first-child { border-right: none; border-bottom: 1px solid var(--svs-border); } }

        .svsd-sec { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; padding-bottom: 12px; border-bottom: 1px solid var(--svs-border); }
        .svsd-sec + .svsd-sec, .svsd-sec-gap { margin-top: 30px; }
        .svsd-sec-mark { width: 26px; height: 26px; border-radius: 6px; background: rgba(27,186,107,0.08); border: 1px solid rgba(27,186,107,0.20); display: flex; align-items: center; justify-content: center; }
        .svsd-sec-mark svg { width: 13px; height: 13px; color: var(--svs-leaf); }
        .svsd-sec-title { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--svs-text-muted); }

        .svsd-field { margin-bottom: 18px; }
        .svsd-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--svs-text-mid); margin-bottom: 7px; }
        .svsd-input, .svsd-textarea { width: 100%; padding: 11px 14px; border: 1.5px solid var(--svs-border-dk); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 14px; background: #f7faf8; outline: none; }
        .svsd-input:focus { border-color: var(--svs-leaf); box-shadow: 0 0 0 3px rgba(27,186,107,0.12); background: #fff; }
        .svsd-textarea { resize: none; font-size: 13px; line-height: 1.6; }
        .svsd-select-wrap { position: relative; }
        .svsd-select-wrap::after { content: '▼'; position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 9px; color: var(--svs-text-muted); pointer-events: none; }
        .svsd-clear-btn { margin-left: 8px; font-size: 20px; color: var(--svs-text-muted); background: none; border: none; cursor: pointer; }

        .svsd-final-panel { border-top: 2px solid var(--svs-ink); background: var(--svs-ink); padding: 28px 36px 36px; }
        .svsd-final-panel .svsd-label { color: rgba(255,255,255,0.45); }
        .svsd-final-panel .svsd-input { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); color: #fff; }
        .svsd-final-row { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 24px; }
        .svsd-qty-display { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: rgba(27,186,107,0.08); border: 1px solid rgba(27,186,107,0.22); border-radius: 6px; margin-top: 12px; }
        .svsd-qty-icon { width: 32px; height: 32px; border-radius: 5px; background: rgba(27,186,107,0.15); border: 1px solid rgba(27,186,107,0.28); display: flex; align-items: center; justify-content: center; }
        .svsd-qty-icon svg { width: 14px; height: 14px; color: var(--svs-leaf); }
        .svsd-qty-num { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 600; color: var(--svs-leaf); line-height: 1; }
        .svsd-qty-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(27,186,107,0.55); margin-top: 3px; }

        .svsd-submit-btn { width: 100%; padding: 18px 32px; background: var(--svs-leaf); color: #fff; border: none; border-radius: 7px; cursor: pointer; font-size: 13px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; box-shadow: 0 4px 6px rgba(0,0,0,0.20), 0 10px 30px rgba(27,186,107,0.35); }
        
        .svsd-progress-container {
          width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(27,186,107,0.3);
          border-radius: 7px; padding: 16px 24px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
        }
        .svsd-progress-text {
          display: flex; justify-content: space-between; align-items: center;
          color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 11px;
          margin-bottom: 12px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .svsd-progress-text span:first-child { color: rgba(255,255,255,0.7); }
        .svsd-progress-text span:last-child { color: var(--svs-leaf); font-size: 13px; font-weight: 600; }
        .svsd-progress-track {
          width: 100%; height: 6px; background: rgba(0,0,0,0.4); border-radius: 3px; overflow: hidden;
        }
        .svsd-progress-fill {
          height: 100%; background: var(--svs-leaf); border-radius: 3px;
          transition: width 0.3s ease; box-shadow: 0 0 12px rgba(27,186,107,0.6);
        }
      `}</style>

      {/* ── TOAST NOTIFICATION COMPONENT ── */}
      <div className={`svsd-toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
        <div className="svsd-toast-message">
          {toast.type === 'success' ? (
            <svg className="svsd-toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg className="svsd-toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          )}
          {toast.message}
        </div>
        <div className="svsd-toast-bar-wrap">
          <div className="svsd-toast-bar"></div>
        </div>
      </div>

      <div className="svsd-root">
        <nav className="svsd-navbar">
          <div className="svsd-navbar-stripe" />
          <div className="svsd-nav-inner">
            <div className="svsd-nav-brand">
              <div className="svsd-nav-logo-ring"><img src={logo} alt="SVS" /></div>
              <div>
                <div className="svsd-nav-name">Ganga Kaveri Seeds PVT. LTD.</div>
                <div className="svsd-nav-tag">Batch Management Portal</div>
              </div>
            </div>
            <div className="svsd-nav-right">
              <button onClick={handleLogout} className="svsd-logout-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="svsd-page-header">
          <h1 className="svsd-header-title">Generate <em>Batch Labels</em></h1>
          <p className="svsd-header-sub">Fill in product details below to generate QR-secured labels</p>
        </div>

        <div className="svsd-container">
          <form onSubmit={handleSubmit} className="svsd-form-card">
            <div className="svsd-form-stripe" />
            <div className="svsd-grid">
              
              <div className="svsd-col">
                <div className="svsd-sec"><span className="svsd-sec-title">Product Identification</span></div>
                
                <div className="svsd-field">
                  <label className="svsd-label">Crop Name</label>
                  <div className="svsd-select-wrap">
                    <select className="svsd-input" name="productName" value={formData.productName} onChange={handleChange} required>
                      <option value="" disabled>Select a crop...</option>
                      {CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                    </select>
                  </div>
                </div>

                <div className="svsd-field">
                  <label className="svsd-label">Variety</label>
                  <input className="svsd-input" type="text" name="variety" value={formData.variety} onChange={handleChange} placeholder="Enter Variety " required />
                </div>

                <div className="svsd-field">
                  <label className="svsd-label">Packed Lot Number</label>
                  <input className="svsd-input" name="packedLotNumber" value={formData.packedLotNumber} onChange={handleChange} required />
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Packed Lot Quantity (Kg)</label>
                  <input className="svsd-input" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
                </div>

                <div className="svsd-sec svsd-sec-gap"><span className="svsd-sec-title">Batch Dates</span></div>
                <div className="svsd-field">
                  <label className="svsd-label">Date of Testing</label>
                  <input className="svsd-input" type="date" name="dateOfTesting" value={formData.dateOfTesting} onChange={handleChange} required />
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Packaging Date</label>
                  <input className="svsd-input" type="date" name="packagingDate" value={formData.packagingDate} onChange={handleChange} required />
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Date of Expiry</label>
                  <input className="svsd-input" type="date" name="dateOfExpiry" value={formData.dateOfExpiry} onChange={handleChange} required />
                </div>
              </div>

              <div className="svsd-col">
                <div className="svsd-sec"><span className="svsd-sec-title">Commercials</span></div>
                <div className="svsd-field">
                  <label className="svsd-label">MRP</label>
                  <input className="svsd-input" name="mrp" value={formData.mrp} onChange={handleChange} required />
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Net Quantity (Kg/Bags)</label>
                  <input className="svsd-input" name="netQty" value={formData.netQty} onChange={handleChange} required />
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Unit Sale Price</label>
                  <input className="svsd-input" name="unitSalePrice" value={formData.unitSalePrice} onChange={handleChange} required />
                </div>

                <div className="svsd-sec svsd-sec-gap"><span className="svsd-sec-title">Facility & Logistics</span></div>
                
                <div className="svsd-field">
                  <label className="svsd-label">Packed At</label>
                  <div className="svsd-select-wrap">
                    <select 
                      className="svsd-input" 
                      name="packedAt" 
                      value={getAddressIndex(formData.packedAt)} 
                      onChange={(e) => setFormData({...formData, packedAt: ADDRESS_OPTIONS[e.target.value].value})} 
                      required
                    >
                      {ADDRESS_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Packed At Preview</label>
                  <textarea className="svsd-textarea" style={{ height: '90px', background: '#f0f4f2', color: '#5a6e61' }} value={formData.packedAt} readOnly />
                </div>

                <div className="svsd-field" style={{ marginTop: '20px' }}>
                  <label className="svsd-label">Plant Address</label>
                  <div className="svsd-select-wrap">
                    <select 
                      className="svsd-input" 
                      name="plantAddress" 
                      value={getAddressIndex(formData.plantAddress)} 
                      onChange={(e) => setFormData({...formData, plantAddress: ADDRESS_OPTIONS[e.target.value].value})} 
                      required
                    >
                      {ADDRESS_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="svsd-field">
                  <label className="svsd-label">Full Address Preview</label>
                  <textarea className="svsd-textarea" style={{ height: '110px', background: '#f0f4f2', color: '#5a6e61' }} value={formData.plantAddress} readOnly />
                </div>

                <div className="svsd-field" style={{ marginTop: '20px' }}>
                  <label className="svsd-label">Produced By</label>
                  <input className="svsd-input" name="producedBy" value={formData.producedBy} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="svsd-final-panel">
              <div className="svsd-final-row">
                <div style={{ width: '180px' }}>
                  <label className="svsd-label">Bags to Generate</label>
                  <input className="svsd-input" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required disabled={loading} />
                  <div className="svsd-qty-display">
                    <div>
                      <div className="svsd-qty-num">{formData.quantity}</div>
                      <div className="svsd-qty-label">Labels</div>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="svsd-progress-container">
                  <div className="svsd-progress-text">
                    <span>Compiling PDF Document...</span>
                    <span>{progress.current} / {progress.total} Generated</span>
                  </div>
                  <div className="svsd-progress-track">
                    <div className="svsd-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              ) : (
                <button type="submit" className="svsd-submit-btn">
                  Generate Labels & Secure Data
                </button>
              )}

            </div>
          </form>
        </div>
        <SVSBatchHistory />
      </div>
    </>
  );
}