import React, { useState, useEffect } from 'react';
import Slider from './propsSlid';
import './sliderCss1.css';  // Your custom CSS file

function Slid() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [isEmpty, setIsEmpty] = useState(false); 

  // Fetch the data from the API
  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const response = await fetch('https://pets.сделай.site/api/pets/slider');
        const data = await response.json();

        if (data.data.pets.length === 0) {
          setIsEmpty(true);
        } else {
          setSlides(data.data.pets); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);  
      }
    };

    fetchSlidesData();
  }, []); 

  if (isLoading) {
    return (
      <div className="loader ">
        <div className=" text-center tst  bg-success bg-opacity-25 w-100">Загрузка...</div>
      </div>
    );
  }

  // If no pets are found, display empty state
  if (isEmpty) {
    return (
      <div className="text-center">
        <h2 className="text-danger">Никаких найденных животных не обнаружено</h2>
      </div>
    );
  }

  return (
    <div>
      
      <Slider slides={slides} />
    </div>
  );
}

export default Slid;
