import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  ShieldCheck, 
  FileText,
  ExternalLink 
} from 'lucide-react';
import { governmentPartnershipData } from '../data/companyContent';

export default function GovernmentPartnershipShowcase() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { pages, docRef, fileName, pdfUrl } = governmentPartnershipData;
  const activePage = pages[currentPageIndex];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentPageIndex((prev) => (prev + 1) % pages.length);
  };

  const openFullscreen = () => {
    setZoomLevel(1);
    setModalOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalOpen) {
        if (e.key === 'Escape') setModalOpen(false);
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <div className="government-partnership-section" id="government-partnership">
      {/* Section Header */}
      <div className="section-header text-center">
        <div className="inline-badge">
          <Landmark size={16} />
          <span>STRATEGIC BILATERAL ACCORD</span>
        </div>
        <h2 className="section-title">Government & Institutional Partnership in India</h2>
        <p className="section-subtitle" style={{ maxWidth: '840px', margin: '0 auto' }}>
          Official 25-Year Strategic Bilateral Agreement entered into between the <strong>Ministry of Housing and Urban Affairs (MoHUA), Government of India</strong> and <strong>Obayashi India Corporation Pvt. Ltd.</strong> for nationwide smart urban infrastructure.
        </p>
      </div>

      {/* Main Interactive Protected Document Viewer Card */}
      <div 
        className="gov-viewer-card" 
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Top Control Bar */}
        <div className="gov-viewer-topbar">
          <div className="gov-viewer-title-group">
            <span className="gov-page-indicator-pill">
              <FileText size={14} />
              <span>Page {activePage.pageNumber} of {pages.length}</span>
            </span>
            <span className="gov-file-tag-pill">
              {fileName || "obayashi-agreement.pdf"}
            </span>
            <h3 className="gov-current-page-title">{activePage.name}</h3>
          </div>

          {/* Viewer Controls */}
          <div className="gov-viewer-controls">
            <a 
              href={pdfUrl || "/obayashi-agreement.pdf"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="gov-tool-btn gov-pdf-link-btn" 
              title="Open full obayashi-agreement.pdf document"
            >
              <FileText size={14} />
              <span>{fileName || "obayashi-agreement.pdf"}</span>
              <ExternalLink size={13} />
            </a>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))} 
              className="gov-tool-btn" 
              title="Zoom In"
              type="button"
            >
              <ZoomIn size={16} />
              <span>Zoom In</span>
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} 
              className="gov-tool-btn" 
              title="Zoom Out"
              type="button"
            >
              <ZoomOut size={16} />
              <span>Zoom Out</span>
            </button>
            <button 
              onClick={() => setZoomLevel(1)} 
              className="gov-tool-btn" 
              title="Reset View"
              type="button"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button 
              onClick={openFullscreen} 
              className="gov-inspect-btn"
              title="Inspect Document Fullscreen"
              type="button"
            >
              <Maximize2 size={15} />
              <span>Inspect Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Document Display Stage */}
        <div className="gov-main-stage">
          {/* Navigation Arrow Left */}
          <button 
            onClick={handlePrev} 
            className="gov-nav-arrow left"
            aria-label="Previous Page"
            title="Previous Page"
            type="button"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>

          {/* Document Sheet Display (Protected Canvas & Image Container) */}
          <div 
            className="gov-document-stage-container"
            onClick={openFullscreen}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage.pageNumber}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="gov-doc-sheet"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center'
                }}
              >
                {/* Official Stamped Document High-Res Sheet */}
                <div className="gov-doc-paper">
                  <img 
                    src={activePage.image} 
                    alt={`Obayashi MoHUA Agreement - ${activePage.name}`}
                    className="gov-document-image"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Anti-copy / Read-only Transparent Shield Overlay */}
                  <div 
                    className="gov-protection-shield" 
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="gov-hover-inspect-badge">
                      <Maximize2 size={16} />
                      <span>Click to Inspect High-Resolution Document</span>
                    </div>
                  </div>
                </div>

                {/* Document Security Bottom Ribbon */}
                <div className="gov-doc-watermark-ribbon">
                  <span>OFFICIAL BILATERAL RECORD • MINISTRY OF HOUSING AND URBAN AFFAIRS & OBAYASHI INDIA CORPORATION • ALL RIGHTS RESERVED</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrow Right */}
          <button 
            onClick={handleNext} 
            className="gov-nav-arrow right"
            aria-label="Next Page"
            title="Next Page"
            type="button"
          >
            <ChevronRight size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* Page Switcher Tabs & Thumbnails */}
        <div className="gov-thumbnails-section">
          <div className="gov-page-tabs-bar">
            {pages.map((p, idx) => {
              const isActive = currentPageIndex === idx;
              return (
                <button
                  key={p.pageNumber}
                  onClick={() => {
                    setCurrentPageIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`gov-page-tab-btn ${isActive ? 'active' : ''}`}
                  type="button"
                >
                  <span className="tab-page-num">0{p.pageNumber}</span>
                  <span className="tab-page-title">{p.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Thumbnail preview strip */}
          <div className="gov-thumbs-row">
            {pages.map((p, idx) => {
              const isActive = currentPageIndex === idx;
              return (
                <div 
                  key={p.pageNumber}
                  onClick={() => {
                    setCurrentPageIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`gov-thumb-card ${isActive ? 'active' : ''}`}
                  title={p.name}
                >
                  <div className="gov-thumb-img-wrapper">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="gov-thumb-img"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="gov-thumb-overlay" />
                  </div>
                  <div className="gov-thumb-info">
                    <span className="gov-thumb-badge">Page {p.pageNumber}</span>
                    <span className="gov-thumb-desc">{p.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Inspection Modal (Protected - No Download) */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="gov-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <motion.div 
              className="gov-modal-box"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="gov-modal-header">
                <div className="gov-modal-info">
                  <div className="gov-modal-title-row">
                    <span className="gov-modal-badge">{docRef}</span>
                    <span className="gov-modal-doc-pill">
                      <FileText size={13} />
                      <span>{fileName || "obayashi-agreement.pdf"}</span>
                    </span>
                    <h3 className="gov-modal-title">Government & Institutional Partnership in India</h3>
                    <span className="gov-modal-page-tag">Page {activePage.pageNumber} of {pages.length}</span>
                  </div>
                  <p className="gov-modal-subtitle">
                    {activePage.name} • {activePage.subtitle}
                  </p>
                </div>

                <div className="gov-modal-actions">
                  <a 
                    href={pdfUrl || "/obayashi-agreement.pdf"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gov-modal-btn gov-modal-pdf-btn" 
                    title="Open original obayashi-agreement.pdf document"
                  >
                    <FileText size={16} />
                    <span>Open PDF</span>
                    <ExternalLink size={13} />
                  </a>

                  <div className="gov-modal-nav-group">
                    <button 
                      onClick={handlePrev} 
                      className="gov-modal-btn" 
                      title="Previous Page (Left Arrow)"
                      type="button"
                    >
                      <ChevronLeft size={18} />
                      <span>Prev Page</span>
                    </button>
                    <button 
                      onClick={handleNext} 
                      className="gov-modal-btn" 
                      title="Next Page (Right Arrow)"
                      type="button"
                    >
                      <span>Next Page</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="gov-modal-zoom-group">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 3))} 
                      className="gov-modal-btn" 
                      title="Zoom In"
                      type="button"
                    >
                      <ZoomIn size={18} />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.7))} 
                      className="gov-modal-btn" 
                      title="Zoom Out"
                      type="button"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(1)} 
                      className="gov-modal-btn" 
                      title="Reset View"
                      type="button"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>

                  {/* Close Modal Button */}
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="gov-modal-close-btn" 
                    title="Close Fullscreen (Esc)"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body with Full High-Res Document Sheet */}
              <div 
                className="gov-modal-body"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div 
                  className="gov-modal-document-container"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img 
                    src={activePage.image} 
                    alt={`Obayashi MoHUA Agreement - Page ${activePage.pageNumber}`}
                    className="gov-modal-img"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Overlay protecting the document image */}
                  <div 
                    className="gov-modal-shield"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>

              {/* Modal Footer with Security Watermark */}
              <div className="gov-modal-footer">
                <div className="gov-modal-footer-left">
                  <ShieldCheck size={16} className="text-blue" />
                  <span>Verified MoHUA & Obayashi Corporate Stamped & Signed Execution • Protected Institutional Record (Download Disabled)</span>
                </div>
                <div className="gov-modal-footer-right">
                  <span>Use <strong>Left / Right Arrow</strong> to switch pages • <strong>Esc</strong> to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
