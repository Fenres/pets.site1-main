import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext'; 
import logo from '../png/logo.jpg';
import Poisc from './poisc';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginTabActive, setIsLoginTabActive] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const { authToken, setAuthToken } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  let debounceTimeout = null;

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://pets.сделай.site/api/search?query=${query}`);
      if (response.status === 200) {
        const data = await response.json();
        setSuggestions(data.data.orders || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки подсказок:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 3) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        fetchSuggestions(query);
      }, 1000);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/petsSearch?query=${searchQuery.trim()}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleCloseModal = () => {
    setShowModal(false);
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterPhone("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterPasswordConfirm("");
    setRegisterConfirm(false);
    setErrorMessages([]);
    setIsRegistered(false);
  };

  const handleShowModal = () => setShowModal(true);

  const handleTabSwitch = (isLogin) => setIsLoginTabActive(isLogin);

  const resetErrors = () => setErrorMessages([]);

  const validateRegistrationForm = () => {
    const errors = [];
    const nameRegex = /^[А-Яа-яёЁ\s\-]+$/;
    if (!nameRegex.test(registerName)) {
      errors.push("Имя должно содержать только кириллицу, пробелы и дефисы.");
    }
    const phoneRegex = /^\+7?[0-9]{10}/;
    if (!phoneRegex.test(registerPhone)) {
      errors.push("Телефон должен содержать только цифры и может начинаться с символа '+'.");
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(registerEmail)) {
      errors.push("Неверный формат email.");
    }
    const passwordRegex = /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)[A-Za-zА-Яа-я\d]{7,}$/;
    if (!passwordRegex.test(registerPassword)) {
      errors.push("Пароль должен быть не менее 7 символов, с одной цифрой, одной строчной и одной заглавной буквой.");
    }
    if (registerPassword !== registerPasswordConfirm) {
      errors.push("Пароли не совпадают.");
    }
    return errors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRegistrationForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }
  
    const registrationData = {
      name: registerName,
      phone: registerPhone,
      email: registerEmail,
      password: registerPassword,
      password_confirmation: registerPasswordConfirm,
      confirm: registerConfirm ? "true" : "false",
    };
  
    try {
      const response = await fetch('https://pets.сделай.site/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
  
      if (response.status === 204) {
        setIsRegistered(true);
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrorMessages(['Пользователь с такой почтой уже существует']);
      } else {
        throw new Error('Что-то пошло не так, попробуйте позже.');
      }
    } catch (error) {
      setErrorMessages([error.message]);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setErrorMessages(['Email и пароль обязательны для ввода']);
      return;
    }

    const loginData = { email: loginEmail, password: loginPassword };

    try {
      const response = await fetch('https://pets.сделай.site/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.data.token;
        localStorage.token = token;
        setAuthToken(token);
        handleCloseModal();
        navigate('/myAccount');
      } else {
        const errorData = await response.json();
        setErrorMessages([errorData.message || 'Ошибка входа']);
      }
    } catch (error) {
      setErrorMessages([error.message]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src={logo} className="w-25 rounded-3" alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-1 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive('/') ? 'disabled' : ''}`} aria-current="page">
                  Главная
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/myAccount" className={`nav-link ${isActive('/myAccount') ? 'disabled' : ''}`}>
                  Личный кабинет
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/petsAdd" className={`nav-link ${isActive('/petsAdd') ? 'disabled' : ''}`}>
                  Добавить объявление
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/petsSearch" className={`nav-link ${isActive('/petsSearch') ? 'disabled' : ''}`}>
                  Поиск по объявлениям
                </Link>
              </li>
            </ul>
            <Poisc />
            {!authToken ? (
              <Button className="btn btn-primary me-2 mb-2 mb-lg-0" onClick={handleShowModal}>
                Вход / Регистрация
              </Button>
            ) : (
              <Button className="btn btn-danger me-2 mb-2 mb-lg-0" onClick={handleLogout}>
                Выйти
              </Button>
            )}
          </div>
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isLoginTabActive ? 'Авторизация' : 'Регистрация'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="nav nav-tabs" id="authTabs" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${isLoginTabActive ? 'active' : ''}`}
                onClick={() => handleTabSwitch(true)}
              >
                Вход
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${!isLoginTabActive ? 'active' : ''}`}
                onClick={() => handleTabSwitch(false)}
              >
                Регистрация
              </button>
            </li>
          </ul>

          {errorMessages.length > 0 && (
            <Alert variant="danger">
              <ul>
                {errorMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </Alert>
          )}

          {isLoginTabActive ? (
            <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Почта</Form.Label>
                <Form.Control
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100">
                Войти
              </Button>
            </Form>
          ) : (
            // Registration Form
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  value={registerName}
                  onChange={(e) => { setRegisterName(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => { setRegisterPhone(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={registerEmail}
                  onChange={(e) => { setRegisterEmail(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={registerPassword}
                  onChange={(e) => { setRegisterPassword(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => { setRegisterPasswordConfirm(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Согласие на обработку данных"
                required
                checked={registerConfirm}
                onChange={() => setRegisterConfirm(!registerConfirm)}
              />
              {isRegistered ? (
                <Alert variant="success" className="w-100">
                  Регистрация успешна! Вы можете войти.
                </Alert>
              ) : (
                <Button type="submit" className="w-100">
                  Зарегистрироваться
                </Button>
              )}
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
