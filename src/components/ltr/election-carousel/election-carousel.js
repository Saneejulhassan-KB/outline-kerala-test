import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/client';
import { GET_WARDS_DATA } from '../../../../queries/getWardsData';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './election-carousel.css';

if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

const MEDIA_BASE_URL = "https://admin.outlinekerala.com/media";

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  if (path.startsWith("http")) return path;
  return `${MEDIA_BASE_URL}/${path}`;
};

const ElectionCarousel = () => {
  const { loading, error, data } = useQuery(GET_WARDS_DATA);

  useEffect(() => {
    if (data) {
      console.log("Election Data Received:", data);
    }
    if (error) {
      console.error("Election Data Error:", error);
    }
  }, [data, error]);

  if (loading) return <div className="text-center py-4">Loading election data...</div>;
  if (error) return <div className="text-center py-4 text-danger">Error loading data: {error.message}</div>;

  const parties = {
    LDF: { color: '#d32f2f' },
    UDF: { color: '#1976d2' },
    NDA: { color: '#f57c00' },
    IND: { color: '#616161' },
    SDPI: { color: '#00953b' },
    BJP: { color: '#f57c00' }
  };

  const getPartyColor = (partyName) => {
      const normalized = partyName?.toUpperCase();
      if (parties[normalized]) return parties[normalized].color;
      if (normalized?.includes('LDF') || normalized?.includes('CPI')) return parties.LDF.color;
      if (normalized?.includes('UDF') || normalized?.includes('CONGRESS')) return parties.UDF.color;
      if (normalized?.includes('NDA') || normalized?.includes('BJP')) return parties.NDA.color;
      return parties.IND.color;
  };

  // Show ALL wards, including those without candidates
  const wards = (data?.wards || []).map((ward, index) => {
    const candidatesList = ward.candidates || [];
    
    // Sort by vote count descending
    const sortedCandidates = [...candidatesList].sort((a, b) => {
        const votesA = parseInt(a.voteCount) || 0;
        const votesB = parseInt(b.voteCount) || 0;
        return votesB - votesA;
    });

    const totalVotes = ward.totalVoters || sortedCandidates.reduce((acc, curr) => acc + (parseInt(curr.voteCount) || 0), 0);
    
    const margin = sortedCandidates.length > 1 
        ? (parseInt(sortedCandidates[0].voteCount) || 0) - (parseInt(sortedCandidates[1].voteCount) || 0) 
        : (parseInt(sortedCandidates[0]?.voteCount) || 0);

    return {
      id: ward.wardNumber || `ward-${index}`,
      name: ward.wardName,
      totalVotes: totalVotes,
      candidates: sortedCandidates.map(c => ({
        ...c,
        votes: parseInt(c.voteCount) || 0,
        image: getImageUrl(c.candidatePhoto),
        logo: getImageUrl(c.partyLogo),
        color: getPartyColor(c.party)
      })),
      margin: margin
    };
  });

  const options = {
    loop: wards.length > 1,
    margin: 20,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 800,
    responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 },
        1200: { items: 4 }
    }
  };

  if (wards.length === 0) {
    return (
      <div className="election-news-card-section py-4 bg-light">
        <div className="container">
          <div className="section-header mb-3 d-flex align-items-center">
            <div className="live-badge me-2">LIVE</div>
            <h4 className="mb-0 fw-bold text-uppercase">Ambaloor Election Results</h4>
          </div>
          <div className="text-center py-4 text-muted">No election data available yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="election-news-card-section py-4 bg-light">
      <div className="container">
        <div className="section-header mb-3 d-flex align-items-center">
            <div className="live-badge me-2">LIVE</div>
            <h4 className="mb-0 fw-bold text-uppercase">Ambaloor Election Results</h4>
        </div>

        <OwlCarousel className="owl-theme" {...options}>
          {wards.map((ward, index) => (
            <div key={`${ward.id}-${index}`} className="item">
              <div className="news-result-card">
                {/* Card Header */}
                <div className="card-header-strip d-flex justify-content-between align-items-center">
                    <span className="ward-name text-uppercase fw-bold">{ward.name}</span>
                    <span className="total-votes small text-muted">Total: {ward.totalVotes}</span>
                </div>

                <div className="card-body-content d-flex mt-3">
                    {/* Leader Section (Left) */}
                    {ward.candidates.length > 0 ? (
                        <>
                            <div className="leader-section text-center pe-3 border-end">
                                <div className="leader-img-container mx-auto mb-2">
                                    <img 
                                      src={`https://backend.outlinekerala.com/media/${ward.candidates[0].candidatePhoto}`} 
                                      alt={ward.candidates[0].name} 
                                      className="leader-img" 
                                      style={{borderColor: ward.candidates[0].color}}
                                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <div className="party-badge-lg" style={{backgroundColor: ward.candidates[0].color}}>
                                        <img 
                                          src={`https://backend.outlinekerala.com/media/${ward.candidates[0].partyLogo}`}  
                                          alt="" 
                                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                        />
                                    </div>
                                </div>
                                <h6 className="leader-name fw-bold mb-0 text-truncate">{ward.candidates[0].name}</h6>
                                <div className="leader-votes fw-bold fs-5" style={{color: ward.candidates[0].color}}>
                                    {ward.candidates[0].votes.toLocaleString()}
                                </div>
                                <div className="lead-margin small text-success fw-bold">
                                    Lead: +{ward.margin.toLocaleString()}
                                </div>
                            </div>

                            {/* Others Section (Right) */}
                            <div className="others-section flex-grow-1 ps-3 d-flex flex-column justify-content-center">
                                {ward.candidates.slice(1).map((candidate, idx) => (
                                    <div key={idx} className="other-candidate-row d-flex align-items-center mb-2">
                                        <div className="other-img-frame me-2">
                                            <img 
                                              src={`https://backend.outlinekerala.com/media/${candidate.candidatePhoto}`}
                                              alt={candidate.name} 
                                              className="other-img"
                                              onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                            />
                                            <div className="party-badge-sm" style={{backgroundColor: candidate.color}}>
                                                <img 
                                                  src={`https://backend.outlinekerala.com/media/${candidate.partyLogo}`}  
                                                  alt="" 
                                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/20'; }}
                                                />
                                            </div>
                                        </div>
                                        <div className="other-info lh-1">
                                            <div className="other-name fw-bold small text-truncate" style={{maxWidth: '80px'}}>{candidate.name}</div>
                                            <div className="other-party x-small text-muted">{candidate.party}</div>
                                        </div>
                                        <div className="other-votes ms-auto fw-bold small">
                                            {candidate.votes.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="w-100 text-center py-4">
                            <p className="text-muted mb-0">No candidates declared yet</p>
                        </div>
                    )}
                </div>
                
                {/* Footer Status */}
                <div className="card-footer-status mt-2 pt-2 border-top text-center">
                    {ward.candidates.length > 0 && (
                        <span className="status-text small text-uppercase fw-bold" style={{color: ward.candidates[0].color}}>
                            {ward.candidates[0].party} Leading
                        </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default ElectionCarousel;
