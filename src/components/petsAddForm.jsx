import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

function PetsAddForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    register: false, // Состояние для чекбокса "Я хочу зарегистрироваться"
    password: '', // Поле пароля
    password_confirmation: '', // Поле подтверждения пароля
    photos1: null,
    photos2: null,
    photos3: null,
    kind: '',
    mark: '',
    description: '',
    confirm: false,
    district: '',
    wantToRemainAnonymous: false, // Чекбокс для анонимности
    wantToRegister: false, // Чекбокс для регистрации
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const authToken = localStorage.getItem('token');
      if (authToken) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${authToken}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        try {
          const response = await fetch("https://pets.сделай.site/api/users", requestOptions);
          if (response.ok) {
            const result = await response.json();
            setFormData((prevData) => ({
              ...prevData,
              name: result.name,
              phone: result.phone,
              email: result.email,
            }));
          } else {
            console.error("Error fetching user data: ", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setErrorMessage("Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже.");
        }
      }
    };

    loadUserData();
  }, []); // Runs once when the component mounts

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files : value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    const { name, phone, email, password, password_confirmation, photos1, confirm, kind, description, district } = formData;

    if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(name)) {
      formErrors.name = "Имя может содержать только буквы, пробел и дефис";
    }
    if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = "Номер телефона может содержать только цифры и символ +";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Введите корректный адрес электронной почты";
    }

    // Пароль и подтверждение пароля только если выбрана регистрация
    if (formData.wantToRegister && !formData.wantToRemainAnonymous) { 
      if (password.length < 7) {
        formErrors.password = "Пароль должен содержать не менее 7 символов";
      }
      if (!/[0-9]/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        formErrors.password = "Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву";
      }
      if (password !== password_confirmation) {
        formErrors.password_confirmation = "Пароли не совпадают";
      }
    }

    if (!photos1) {
      formErrors.photos1 = "Фото 1 обязательно";
    }
    if (!confirm) {
      formErrors.confirm = "Необходимо согласие на обработку данных";
    }
    if (!kind) {
      formErrors.kind = "Необходимо выбрать тип животного";
    }
    if (!description) {
      formErrors.description = "Необходимо указать описание";
    }
    if (!district) {
      formErrors.district = "Необходимо указать район";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare form data for sending including files (multipart/form-data)
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('kind', formData.kind);
    formDataToSubmit.append('mark', formData.mark);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('confirm', formData.confirm);
    formDataToSubmit.append('district', formData.district);

    if (formData.wantToRegister ) {
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('password_confirmation', formData.password_confirmation);
    }
    if (!formData.wantToRemainAnonymous)
      formDataToSubmit.append('password', formData.password);

    // Handle photos upload
    if (formData.photos1) formDataToSubmit.append('photos1', formData.photos1[0]);
    if (formData.photos2) formDataToSubmit.append('photos2', formData.photos2[0]);
    if (formData.photos3) formDataToSubmit.append('photos3', formData.photos3[0]);

    console.log("Data being sent to the server: ", formDataToSubmit);
    // Submit the form
    try {
      const petResponse = await fetch('https://pets.сделай.site/api/pets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSubmit,
      });

      const result = await petResponse.json();
      console.log("Response from the server: ", result);
      if (petResponse.status === 200) {
        setSuccessMessage("Объявление успешно добавлено!");
        setErrorMessage('');
      } else {
        setErrorMessage("Ошибка при добавлении объявления. Пожалуйста, попробуйте позже.");
      }
    } catch (error) {
      console.error("Error during pet advertisement submission: ", error);
      setErrorMessage("Ошибка при добавлении объявления. Пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div>
      <h1 className="text-white bg-primary m-2 text-center">Добавить объявление</h1>
      <div className="container">
        <form id="addPetForm" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Имя:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <Alert variant="danger">{errors.name}</Alert>}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Телефон:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && <Alert variant="danger">{errors.phone}</Alert>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <Alert variant="danger">{errors.email}</Alert>}
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="wantToRemainAnonymous"
              name="wantToRemainAnonymous"
              checked={formData.wantToRemainAnonymous}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="wantToRemainAnonymous">Я хочу остаться анонимным</label>
          </div>

          {/* Чекбокс "Я хочу зарегистрироваться" */}
        

          {!formData.wantToRemainAnonymous && (
            <>
 <div className="mb-3">
                <label htmlFor="password" className="form-label">Пароль:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && <Alert variant="danger">{errors.password}</Alert>}
              </div>
              </>

            )}


          {/* Поля для пароля и подтверждения пароля отображаются только если выбрана регистрация */}
          {formData.wantToRegister && !formData.wantToRemainAnonymous && (
            <>
             

              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">Подтверждение пароля:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                />
                {errors.password_confirmation && <Alert variant="danger">{errors.password_confirmation}</Alert>}
              </div>
            </>
          )}
  <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="wantToRegister"
              name="wantToRegister"
              checked={formData.wantToRegister}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="wantToRegister">Я хочу зарегистрироваться</label>
          </div>
          {/* Continue with other fields */}
          <div className="mb-3">
            <label htmlFor="kind" className="form-label">Тип животного:</label>
            <input
              type="text"
              className="form-control"
              id="kind"
              name="kind"
              value={formData.kind}
              onChange={handleInputChange}
              required
            />
            {errors.kind && <Alert variant="danger">{errors.kind}</Alert>}
          </div>
          <div className="mb-3">
            
  <label htmlFor="mark" className="form-label">Чип: (при наличии)</label>
  <input
    type="text"
    className="form-control"
    id="mark"
    name="mark"
    value={formData.mark}
    onChange={handleInputChange}
  />
  {errors.mark && <Alert variant="danger">{errors.mark}</Alert>}
  </div>
          {/* Upload photos */}
          <div className="mb-3">
            <label htmlFor="photos1" className="form-label">Фото 1 (обязательно):</label>
            <input
              type="file"
              className="form-control"
              id="photos1"
              name="photos1"
              onChange={handleInputChange}
              accept="image/*"
              required
            />
            {errors.photos1 && <Alert variant="danger">{errors.photos1}</Alert>}
          </div>

          <div className="mb-3">
            <label htmlFor="photos2" className="form-label">Фото 2:</label>
            <input
              type="file"
              className="form-control"
              id="photos2"
              name="photos2"
              onChange={handleInputChange}
              accept="image/*"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="photos3" className="form-label">Фото 3:</label>
            <input
              type="file"
              className="form-control"
              id="photos3"
              name="photos3"
              onChange={handleInputChange}
              accept="image/*"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Описание:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            {errors.description && <Alert variant="danger">{errors.description}</Alert>}
          </div>
          {/* District */}
          <div className="mb-3">
            <label htmlFor="district" className="form-label">Район:</label>
            <input
              type="text"
              className="form-control"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
            />
            {errors.district && <Alert variant="danger">{errors.district}</Alert>}
          </div>

          {/* Confirmation */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="confirm"
              name="confirm"
              checked={formData.confirm}
              onChange={handleInputChange}
              required
            />
            <label className="form-check-label" htmlFor="confirm">Согласие на обработку данных</label>
            {errors.confirm && <Alert variant="danger">{errors.confirm}</Alert>}
          </div>

          <Button type="submit" variant="primary">Отправить</Button>
        </form>

        {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
      </div>
    </div>
  );
}

export default PetsAddForm;
