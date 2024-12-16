import React, { useState, useEffect, useCallback } from 'react';
import Card1 from './cart1'; 
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import AdDetails from './adDetale'; 

function Poisc() {
    const [showModal, setShowModal] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [mas, setmas] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null); 
    const [showSuggestions, setShowSuggestions] = useState(true);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

 
    const fetchSuggestions = async (searchTerm) => {
        setLoading(true);
        console.log(`Отправка запроса на сервер с запросом: ${searchTerm}`);

        try {
            const response = await fetch(`https://pets.сделай.site/api/search?query=${searchTerm}`);
            console.log(`Статус ответа API: ${response.status}`);

            if (response.status === 200) {
                const data = await response.json();
                console.log('Полученные данные:', data);
                // debugger;

                let tmpSet = new Set(data.data.orders.map(elem=>elem.description))
                setmas([...tmpSet] );
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
            debouncedFetch(value);
            setShowSuggestions(true); 
        } else {
            setSuggestions([]); 
            setNoResults(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchLoading(true);
        setShowCards(true);
        setSearchLoading(false);
    };


    const openAnimalCard = async (animalId) => {
        try {
            const response = await fetch(`https://pets.сделай.site/api/pets/${animalId}`);
            const data = await response.json();
            setSelectedAnimal(data.data.pet); 
            setShowModal(true); 
        } catch (error) {
            console.error('Error fetching detailed pet data:', error);
        }
    };

    const handleAdSelection = (ad) => {
        setQuery(ad.description); 
        setSuggestions([]); 

        setSearchLoading(true);
        setShowCards(true); 
        setSearchLoading(false);
    };

    const closeAnimalCard = () => {
        setSelectedAnimal(null);
        setShowModal(false); 
    };

    const handleFocus = () => {
       
        if (query.length > 2) {
            debouncedFetch(query);
            setShowSuggestions(true); 
        }
    };

    const handleBlur = () => {
     
        // const timeout = setTimeout(() => {
        //     setSuggestions([]);
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
                    onFocus={handleFocus} 
                    onBlur={handleBlur}    
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

                        
                    
                    {!showCards && suggestions.length > 0 && !noResults && (                        
                        
                        suggestions.map((item) => (
                            <li                                
                                key={item.id}
                               
                                
                                className="list-group-item"
                                onClick={() => handleAdSelection(item)} 
                            >
                               {item.description}
                            </li>                            
                        ))
                    )}

                 
                    {showCards && suggestions.length > 0 && (
                        suggestions.map((item) => (
                            <li key={item.id} className="list-group-item">
                                <Card1 pet={item} onClick={() => openAnimalCard(item.id)} />
                            </li>
                        ))
                    )}

             
                    {noResults && !loading && (
                        <li className="list-group-item">Нет результатов</li>
                    )}
                </ul>
            )}

       
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
