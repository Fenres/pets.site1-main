import React, { useState, useEffect } from "react";
import Card from './propsCard'; // Assuming this is the correct import path for the Card component
import AdDetails from './adDetale';

const Searchforads = () => {
  const [district, setDistrict] = useState('');
  const [kind, setKind] = useState('');
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);

  const itemsPerPage = 9;

  // Function to fetch ads from the API
  const fetchAds = async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (district) query.append("district", district);
    if (kind) query.append("kind", kind);

    try {
      // const requestOptions = {
      //   method: "GET",
      
      //   redirect: "follow",
      // };

      const response = await fetch(`https://pets.xn--80ahdri7a.site/api/search/order/?${query.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setAds(data.data.orders);
      } else {
        setAds([]);
      }
    } catch (err) {
      setError("Error fetching ads.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search button click
  const searchAds = () => {
    fetchAds();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page changes
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Select ad for details view
  const selectAd = (ad) => {
    setSelectedAd(ad);
  };

  // Close the ad details view
  const closeAd = () => {
    setSelectedAd(null);
  };

  // Calculate ads for current page
  const indexOfLastAd = currentPage * itemsPerPage;
  const indexOfFirstAd = indexOfLastAd - itemsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  return (
    <div>
      {/* Search Panel */}
      <div className="search-box text-center text-white bg-primary me-2 p-2">
        <h3>Search</h3>
        <div className="d-flex flex-wrap justify-content-center">
          <input
            type="text"
            className="form-control w-25 me-2"
            placeholder="Район"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <input
            type="text"
            className="form-control w-25 me-2"
            placeholder="Тип животного"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
          <button onClick={searchAds} className="btn btn-light me-2">Search</button>
        </div>
      </div>

      <div>
        {selectedAd ? (
          <AdDetails key={selectedAd.id} selectedAd={selectedAd} closeAd={closeAd} />
        ) : (
          <>
            <div className="d-flex flex-wrap justify-content-center">
              {isLoading ? (
                <p className="text-center" style={{ height: '570px' }}>Loading ads...</p>
              ) : error ? (
                <p className="text-center" style={{ height: '570px', color: 'red' }}>{error}</p>
              ) : currentAds.length === 0 ? (
                <p className="text-center" style={{ height: '570px' }}>No ads found.</p>
              ) : (
                currentAds.map((pet) => (
                  <Card
                    key={pet.id}
                    pet={pet}
                    onClick={() => selectAd(pet)} // Open ad details on click
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {ads.length > 0 && (
              <nav aria-label="pagination" className="m-auto">
                <ul className="pagination pagination-lg justify-content-center">
                  {Array.from({ length: Math.ceil(ads.length / itemsPerPage) }, (_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Searchforads;
