
"use client";
import React from 'react';
import Layout from "@/components/ltr/layout/layout";
import Link from "next/link";
import "@/components/ltr/election-widget/election-widget.css"; // Reuse styles

export default function ElectionResultsPage() {
  // Reuse dummy data for now (ideally this would be in a shared context or hook)
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

  return (
    <Layout>
      <main className="page_main_wrapper py-5">
        <div className="container">
           <div className="election-header text-center mb-5">
              <h1 className="fw-bold text-uppercase display-4">Ampallur Gramapanchayath Election 2025</h1>
              <p className="lead text-muted">Detailed Results & Analytics</p>
            </div>

            {/* Overall Summary */}
            <div className="row mb-5 justify-content-center">
                {parties.map(party => (
                    <div key={party.name} className="col-md-3 col-6 mb-3">
                        <div className="card text-center border-0 shadow-sm h-100 py-3" style={{borderTop: `4px solid ${party.color}`}}>
                            <div className="card-body">
                                <img src={party.logo} alt={party.name} className="mb-2" style={{height: '40px'}} />
                                <h3 className="fw-bold mb-0">{party.seats}</h3>
                                <small className="text-muted">Seats Won</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ward Wise Grid */}
            <h3 className="mb-4 border-bottom pb-2">Ward-wise Results</h3>
            <div className="row g-4">
                {wards.map((ward) => (
                    <div key={ward.id} className="col-lg-3 col-md-4 col-sm-6">
                        <div className="ward-card text-center p-3 border rounded h-100 bg-white shadow-sm">
                            <div className="ward-badge mb-3 badge bg-dark fs-6">{ward.name}</div>
                            <div className="winner-img-wrapper mb-3 mx-auto" style={{width: '100px', height: '100px'}}>
                                <img src={ward.winner.image} alt={ward.winner.name} className="winner-img rounded-circle" />
                                <img src={ward.winner.partyLogo} alt={ward.winner.party} className="winner-party-logo-overlay" style={{width: '30px', height: '30px'}} />
                            </div>
                            <h5 className="fw-bold mb-1">{ward.winner.name}</h5>
                            <p className="fw-bold mb-2" style={{color: ward.winner.partyColor}}>{ward.winner.party}</p>
                            <div className="vote-stats text-muted bg-light p-2 rounded">
                                <div className="d-flex justify-content-between"><span>Votes:</span> <strong>{ward.winner.votes}</strong></div>
                                <div className="d-flex justify-content-between"><span>Margin:</span> <strong>{ward.winner.margin}</strong></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-5">
                <Link href="/" className="btn btn-outline-dark">Back to Home</Link>
            </div>
        </div>
      </main>
    </Layout>
  );
}
