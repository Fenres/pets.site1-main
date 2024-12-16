import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';

const AdDetails = ({ selectedAd, closeAd, onEdit, onDelete, token }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletionSuccess, setDeletionSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { authToken, userId, setAuthToken } = useAuth();
    const [formData, setFormData] = useState({
        photos1: null,
        photos2: null,
        photos3: null,
        mark: '',
        description: ''
    });

    // Function to open the edit modal
    const handleShowModal = () => {
        if (selectedAd.userId !== userId) {
            setErrorMessage('Вы можете редактировать только свои объявления.');
            return;
        }

        // Prepopulate form fields with selected ad data
        setFormData({
            photos1: null,  // This is set to null initially, so the user can upload a new photo
            photos2: null,
            photos3: null,
            mark: selectedAd.mark || '',
            description: selectedAd.description || '',
            kind: selectedAd.kind || ''
        });

        setShowModal(true);  // Open modal
    };

    // Function to close the edit modal
    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessage(null);  // Clear any previous error message
        setSuccessMessage(null); // Clear success message
    };

    // Function to handle file input changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0] || prevData[name]
        }));
    };

    const handleSubmit = async () => {
        if (!formData.photos1) {
            setErrorMessage('Фото1 является обязательным.');
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('photos1', formData.photos1); // photo1 is required
        if (formData.photos2) formDataToSend.append('photos2', formData.photos2);
        if (formData.photos3) formDataToSend.append('photos3', formData.photos3);
        formDataToSend.append('mark', formData.mark);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('kind', formData.kind);
    
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formDataToSend,
        };
    
        try {
            const response = await fetch(`https://pets.сделай.site/api/pets/${selectedAd.id}`, options);
    
            const data = await response.json();
    
            if (response.status === 200) {
                onEdit(data); // Call onEdit with the updated ad data
                setSuccessMessage('Объявление успешно отредактировано.');
                handleCloseModal(); // Close modal on success
    
                // Перезагрузить страницу
                window.location.reload();
            } else if (response.status === 401) {
                setErrorMessage('Ошибка авторизации. Пожалуйста, войдите в систему.');
                setAuthToken(null);  // Clear invalid token
            } else if (response.status === 403) {
                setErrorMessage('Редактирование невозможно: доступ запрещен.');
            } else if (response.status === 422) {
                setErrorMessage('Ошибка валидации: Проверьте введенные данные.');
            } else {
                setErrorMessage('Произошла ошибка при редактировании.');
            }
        } catch (error) {
            console.error('Error during edit request:', error);
            setErrorMessage('Произошла ошибка при связи с сервером.');
        }
    };
    

    
    const handleDelete = async () => {
        const url = `https://pets.сделай.site/api/users/orders/${selectedAd.id}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Auth token in header
            },
        };
    
        // Log data being sent to the server
        console.log('Sending DELETE request to the server:', {
            url,
            options,
        });
    
        try {
            const response = await fetch(url, options);
    
            // Log server response
            const data = await response.json();
            console.log('Server response:', data);
    
            if (response.status === 200) {
                setDeletionSuccess(true);
                onEdit(data); // Call onEdit with the updated ad data
                setSuccessMessage('Объявление успешно удалено.');
    
                onDelete(selectedAd.id); // Trigger parent function to update the list
    
                setTimeout(() => {
                    setShowDeleteModal(false);
                    window.location.reload(); // Reload the page
                }, 1000);
            } else {
                setErrorMessage('Произошла ошибка при удалении.');
            }
        } catch (error) {
            console.error('Error during delete request:', error);
            setErrorMessage('Произошла ошибка при связи с сервером.');
        }
    };
    

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center p-2" style={{ minHeight: '45vh' }}>
                <div className="card-details d-flex flex-wrap align-items-center border p-2" style={{ width: '90%', maxWidth: '1200px', height: 'auto' }}>
                    <div className="image-container" style={{ width: '100%', maxWidth: '600px' }}>
                        {selectedAd.photos1 || selectedAd.photos2 || selectedAd.photos3 ? (
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                {[selectedAd.photos1, selectedAd.photos2, selectedAd.photos3].map((photos, index) => (
                                    photos && (
                                        <img
                                            key={index}
                                            src={`https://pets.сделай.site${photos}`}
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
                                    )
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

                        <div className="d-flex gap-3">
                            <button className="btn btn-primary" onClick={closeAd}>Назад к списку</button>
                            <button className="btn btn-info" onClick={handleShowModal}>Редактировать</button>
                            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>Удалить</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование объявления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form>
                        <Form.Group controlId="formKind">
                            <Form.Label>Вид</Form.Label>
                            <Form.Control
                                type="text"
                                name="kind"
                                value={formData.kind}
                                onChange={(e) => setFormData({ ...formData, kind: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMark">
                            <Form.Label>Номер чипа</Form.Label>
                            <Form.Control
                                type="text"
                                name="mark"
                                value={formData.mark}
                                onChange={(e) => setFormData({ ...formData, mark: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoto1">
                            <Form.Label>Фото 1</Form.Label>
                            <Form.Control
                                type="file"
                                name="photos1"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoto2">
                            <Form.Label>Фото 2</Form.Label>
                            <Form.Control
                                type="file"
                                name="photos2"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoto3">
                            <Form.Label>Фото 3</Form.Label>
                            <Form.Control
                                type="file"
                                name="photos3"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить объявление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите удалить это объявление?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdDetails;
