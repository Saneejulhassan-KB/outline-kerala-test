
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './election-widget.css';

if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

// Dynamically import OwlCarousel to avoid SSR issues
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

const ElectionWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Dummy Data
  const parties = [
    { name: 'LDF', color: '#FF0000', seats: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Communist_Party_of_India_%28Marxist%29.svg/1200px-Flag_of_the_Communist_Party_of_India_%28Marxist%29.svg.png' },
    { name: 'UDF', color: '#0000FF', seats: 6, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/1200px-Indian_National_Congress_hand_logo.svg.png' },
    { name: 'NDA', color: '#FF9933', seats: 2, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png' },
    { name: 'OTH', color: '#808080', seats: 0, logo: 'https://via.placeholder.com/50' },
  ];

  const wards = Array.from({ length: 18 }, (_, i) => {
    const wardNum = i + 1;
    const winnerParty = i < 10 ? parties[0] : i < 16 ? parties[1] : parties[2];
    return {
      id: wardNum,
      name: `Ward ${wardNum}`,
      winner: {
        name: `Candidate ${wardNum}`,
        party: winnerParty.name,
        partyColor: winnerParty.color,
        partyLogo: winnerParty.logo,
        image: `https://randomuser.me/api/portraits/men/${wardNum}.jpg`,
        votes: 500 + Math.floor(Math.random() * 500),
        margin: 10 + Math.floor(Math.random() * 100),
      },
    };
  });

  const totalSeats = 18;

  // Owl Carousel Options
  const options = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
  };

  return (
    <div className="election-widget-wrapper my-4">
        {/* Toggle Header */}
        <div className="election-toggle-header" onClick={() => setIsOpen(!isOpen)}>
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span className="badge bg-danger me-2 pulse-animation">LIVE</span>
                    <h5 className="mb-0 text-white fw-bold">Ambaloor Gramapanchayath Election 2025</h5>
                </div>
                <div className={`toggle-icon ${isOpen ? 'open' : ''}`}>
                    <i className="fa fa-chevron-down text-white"></i>
                </div>
            </div>
        </div>

        {/* Collapsible Content */}
        <div className={`election-widget-container ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="container py-4">
                <div className="election-header text-center mb-4">
                <p className="text-muted">Live Results & Updates</p>
                </div>

                <div className="row g-4">
                {/* Party Standings */}
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100 party-standings-card">
                    <div className="card-body">
                        <h4 className="card-title mb-4 border-bottom pb-2">Party Position</h4>
                        {parties.map((party) => (
                        <div key={party.name} className="party-row mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                            <div className="d-flex align-items-center">
                                <img src={party.logo} alt={party.name} className="party-logo-sm me-2" />
                                <span className="fw-bold">{party.name}</span>
                            </div>
                            <span className="fw-bold fs-5">{party.seats}</span>
                            </div>
                            <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${(party.seats / totalSeats) * 100}%`, backgroundColor: party.color }}
                                aria-valuenow={party.seats}
                                aria-valuemin="0"
                                aria-valuemax={totalSeats}
                            ></div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Ward Winners Carousel */}
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100 ward-winners-card">
                        <div className="card-body">
                            <h4 className="card-title mb-4 border-bottom pb-2">Ward Winners</h4>
                            <OwlCarousel className="owl-theme" {...options}>
                            {wards.map((ward) => (
                                <div key={ward.id} className="item">
                                <div className="ward-card text-center p-3 border rounded">
                                    <div className="ward-badge mb-2 badge bg-dark">{ward.name}</div>
                                    <div className="winner-img-wrapper mb-2 mx-auto">
                                        <img src={ward.winner.image} alt={ward.winner.name} className="winner-img rounded-circle" />
                                        <img src={ward.winner.partyLogo} alt={ward.winner.party} className="winner-party-logo-overlay" />
                                    </div>
                                    <h6 className="fw-bold mb-1 text-truncate">{ward.winner.name}</h6>
                                    <p className="text-muted small mb-1" style={{color: ward.winner.partyColor}}>{ward.winner.party}</p>
                                    <div className="vote-stats small text-muted">
                                        <div>Votes: <strong>{ward.winner.votes}</strong></div>
                                        <div>Margin: <strong>{ward.winner.margin}</strong></div>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
                </div>
                
                <div className="text-center mt-4">
                    <Link href="/election-results" className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">View Full Detailed Results</Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ElectionWidget;
