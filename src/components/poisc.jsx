import React, { useState, useEffect, useCallback } from 'react';
import Card1 from './cart1'; // Ensure the component is imported correctly
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import AdDetails from './adDetale'; // Import the modal component

function Poisc() {
    const [showModal, setShowModal] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null); // For storing detailed pet data
    const [showSuggestions, setShowSuggestions] = useState(true); // State to control visibility of suggestions

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Function to fetch suggestions from API
    const fetchSuggestions = async (searchTerm) => {
        setLoading(true);
        console.log(`Отправка запроса на сервер с запросом: ${searchTerm}`);

        try {
            const response = await fetch(`https://pets.сделай.site/api/search?query=${searchTerm}`);
            console.log(`Статус ответа API: ${response.status}`);

            if (response.status === 200) {
                const data = await response.json();
                console.log('Полученные данные:', data);
                setSuggestions(data.data.orders);
                setNoResults(false);
            } else if (response.status === 204) {
                console.log('Нет данных для данного запроса');
                setSuggestions([]);
                setNoResults(true);
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }

        setLoading(false);
    };

    const debouncedFetch = useCallback(debounce(fetchSuggestions, 1000), []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setShowCards(false);

        if (value.length > 2) {
            debouncedFetch(value); // Trigger fetch with debounce
            setShowSuggestions(true); // Reopen the suggestion list when user types
        } else {
            setSuggestions([]); // Clear suggestions if query is too short
            setNoResults(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchLoading(true);
        setShowCards(true); // Show cards when the search button is clicked
        setSearchLoading(false);
    };

    // Fetch detailed data for the selected ad
    const openAnimalCard = async (animalId) => {
        try {
            const response = await fetch(`https://pets.сделай.site/api/pets/${animalId}`);
            const data = await response.json();
            setSelectedAnimal(data.data.pet); // Assuming 'data.data.pet' contains the detailed pet data
            setShowModal(true); // Open modal after data is fetched
        } catch (error) {
            console.error('Error fetching detailed pet data:', error);
        }
    };

    const handleAdSelection = (ad) => {
        setQuery(ad.description); // Set the input value to the description
        setSuggestions([]); // Clear suggestions after selection
        
    };

    const closeAnimalCard = () => {
        setSelectedAnimal(null);
        setShowModal(false); // Close the modal
    };

    const handleFocus = () => {
        // Trigger suggestions if query is still valid
        if (query.length > 2) {
            debouncedFetch(query);
            setShowSuggestions(true); // Reopen suggestions list on focus
        }
    };

    const handleBlur = () => {
        // Set a timeout to hide the suggestions after 2 seconds (optional, not necessary if closing manually)
        // const timeout = setTimeout(() => {
        //     setSuggestions([]); // Hide suggestions after 2 seconds
        // }, 2000);
    };

    // Function to close suggestions list
    const closeSuggestions = () => {
        setShowSuggestions(false);
    };

    return (
        <div>
            <form className="d-flex mb-2 mb-lg-0" onSubmit={handleSearch}>
                <input
                    className="form-control me-2"
                    type="search"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}  // Trigger onFocus to re-fetch suggestions if needed
                    onBlur={handleBlur}    // Set a timeout to hide suggestions after 2 seconds
                    placeholder="Поиск"
                    aria-label="Search"
                />
                <button
                    className="btn btn-primary me-2"
                    disabled={searchLoading || query.length < 3}
                >
                    {'Поиск'}
                </button>
            </form>

            {query.length > 2 && !loading && showSuggestions && (
                <ul
                    className="list-group position-absolute"
                    style={{
                        maxWidth: '100%',
                        zIndex: 1,
                        width: '285px',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        marginTop: '10px',
                        position: 'relative',
                    }}
                >
                    {/* Close button inside the list */}
                    <button
                        className="btn btn-sm btn-danger position-flex"
                        style={{
                            bottom: '10px',
                            right: '10px',
                            zIndex: 2,
                        }}
                        onClick={closeSuggestions}
                    >
                        Закрыть
                    </button>

                    {/* Displaying suggestions */}
                    {!showCards && suggestions.length > 0 && !noResults && (
                        suggestions.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item"
                                onClick={() => handleAdSelection(item)} // Fetch detailed data when selected
                            >
                                {item.kind} - {item.description}
                            </li>
                        ))
                    )}

                    {/* Displaying cards */}
                    {showCards && suggestions.length > 0 && (
                        suggestions.map((item) => (
                            <li key={item.id} className="list-group-item">
                                <Card1 pet={item} onClick={() => openAnimalCard(item.id)} />
                            </li>
                        ))
                    )}

                    {/* No results */}
                    {noResults && !loading && (
                        <li className="list-group-item">Нет результатов</li>
                    )}
                </ul>
            )}

            {/* Modal for displaying ad details */}
            {showModal && selectedAnimal && (
                <Modal 
                    show={showModal} 
                    onHide={closeAnimalCard} 
                    centered
                    size="lg" 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Детали объявления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AdDetails key={selectedAnimal.id} selectedAd={selectedAnimal} closeAd={closeAnimalCard} />
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default Poisc;
