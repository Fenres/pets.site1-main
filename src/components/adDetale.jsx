import React, { useEffect } from 'react';

const AdDetails = ({ selectedAd, closeAd }) => {

    // Log the selectedAd object to inspect the data
    useEffect(() => {
        if (selectedAd) {
            console.log('Selected Ad:', selectedAd); // Log the full selectedAd
            console.log('Photos:', [selectedAd.photos1, selectedAd.photos2, selectedAd.photos3]); // Log the photos
        }
    }, [selectedAd]);

    // Convert individual photo fields into an array
    const photos = [selectedAd.photos1, selectedAd.photos2, selectedAd.photos3].filter(photo => photo); // Filter out null or undefined photos

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center p-4" style={{ minHeight: '66vh' }}>
                <div className="card-details d-flex flex-wrap align-items-center border p-2" style={{ width: '90%', maxWidth: '1200px', height: 'auto' }}>
                    <div className="image-container" style={{ width: '100%', maxWidth: '600px' }}>
                        {photos.length > 0 ? (
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                {photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`https://pets.сделай.site${photo}`}  // Assuming `photo` contains a relative URL
                                        alt={`Изображение ${index + 1}`}
                                        style={{
                                            height: 'auto',
                                            width: '100%',
                                            objectFit: 'contain',
                                            maxHeight: '400px',
                                            maxWidth: '100%',
                                        }}
                                        className="animal-image"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Фото отсутствуют</p>
                        )}
                    </div>
                    <div className="text-container ms-4 mt-4 mt-md-0" style={{ flex: '1 1 auto' }}>
                        <h5>{selectedAd.kind}</h5>
                        <p><strong>ID:</strong> {selectedAd.id}</p>
                        <p><strong>Имя:</strong> {selectedAd.name}</p>
                        <p><strong>Телефон:</strong> {selectedAd.phone}</p>
                        <p><strong>Почта:</strong> {selectedAd.email || "почта не указана"}</p>
                        <p><strong>Описание:</strong> {selectedAd.description}</p>
                        <p><strong>Номер чипа:</strong> {selectedAd.mark || "Номер чипа не указан"}</p>
                        <p><strong>Район:</strong> {selectedAd.district}</p>
                        <p><strong>Дата:</strong> {selectedAd.date}</p>
                        <button className="btn btn-primary" onClick={closeAd}>Назад к списку</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;
