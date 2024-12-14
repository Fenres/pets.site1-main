import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import './MyAkc.css'; // Подключаем CSS
import { useNavigate } from 'react-router-dom'; // Для редиректа после выхода

function MyAkc(props) {
    const navigate = useNavigate(); // Используем хук для навигации
    const [editingField, setEditingField] = useState(null); // Поле, которое редактируется
    const [editedValue, setEditedValue] = useState(''); // Новое значение поля
    const [successMessage, setSuccessMessage] = useState(''); // Сообщения об успешных действиях
    const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке

    if (!props.data) {
        return <div>Нет данных для отображения.</div>; // Проверка, если нет данных
    }

    // Функция для расчета количества дней на сайте
    const calculateDaysOnSite = (registrationDate) => {
        const currentDate = new Date();
        const regDate = new Date(registrationDate);
        const timeDiff = currentDate - regDate;
        return Math.floor(timeDiff / (1000 * 3600 * 24)); // Количество дней
    };

    // Функция для редактирования поля
    const handleEditClick = (field) => {
        setEditingField(field);
        setEditedValue(props.data[field]); // Используем props.data
    };

    // Функция для отправки обновленных данных на сервер
    const handleSaveEdit = async () => {
        if (editingField === 'phone' && !editedValue) {
            setErrorMessage("Телефон не может быть пустым");
            return;
        }
        if (editingField === 'email' && !editedValue) {
            setErrorMessage("Email не может быть пустым");
            return;
        }

        if (editingField === 'email' && !/\S+@\S+\.\S+/.test(editedValue)) {
            setErrorMessage("Введите правильный адрес электронной почты");
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            const url = editingField === 'phone' 
                ? 'https://pets.сделай.site/api/users/phone' 
                : 'https://pets.сделай.site/api/users/email';

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    [editingField]: editedValue, // Изменяем соответствующее поле
                }),
            });

            const result = await response.json();

            if (response.status === 200) {
                setSuccessMessage(`${editingField.charAt(0).toUpperCase() + editingField.slice(1)} успешно обновлено!`);
                setEditingField(null); // Закрыть режим редактирования
            } else if (response.status === 401) {
                setErrorMessage("Не авторизован");
            } else if (response.status === 422) {
                setErrorMessage(result.error?.message || "Ошибка валидации");
            }
        } catch (error) {
            setErrorMessage("Ошибка при обновлении данных. Пожалуйста, попробуйте позже.");
        }
    };

    // Функция для отмены редактирования
    const handleCancelEdit = () => {
        setEditingField(null); // Закрыть режим редактирования
    };

    return (
        <div>
            <h1 className="text-center text-white bg-primary m-2">Личный кабинет</h1>
            <h2 className="text-center text-white bg-primary m-2">Информация о пользователе</h2>

            <div className="container">
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                {editingField ? (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">{editingField.charAt(0).toUpperCase() + editingField.slice(1)}</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                        </div>
                        <Button variant="success" onClick={handleSaveEdit}>Сохранить</Button>
                        <Button variant="secondary" onClick={handleCancelEdit} className="ms-2">Отмена</Button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Имя:</strong> {props.data.name}</p>
                        <p>
                            <strong>Телефон:</strong> {props.data.phone}
                            <Button className="btn btn-primary me-2 p-1" onClick={() => handleEditClick('phone')}>Изменить</Button>
                        </p>
                        <p>
                            <strong>Email:</strong> {props.data.email}
                            <Button className="btn btn-primary me-3 p-1" onClick={() => handleEditClick('email')}>Изменить</Button>
                        </p>
                        <p><strong>Дата регистрации:</strong> {props.data.registrationDate}</p>
                        <p><strong>Дней на сайте:</strong> {calculateDaysOnSite(props.data.registrationDate)}</p>
                        <p><strong>Количество объявлений:</strong> {props.data.countOrder}</p>
                        <p><strong>Найденных животных:</strong> {props.data.countPets}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyAkc;
