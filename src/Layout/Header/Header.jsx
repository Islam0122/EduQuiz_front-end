import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser} from '../../redux/slices/authSlice.js';
import './Header.scss';
import '../../App.scss';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <div className='container'>
            <div className='Header-block'>
                <div className='Header-logo'>
                    <img src="/icons/Union.svg" alt="Logo" />
                    <h1>EDUQUIZ</h1>
                </div>
                <div className='Header-div-button-text'>
                    <div className='Header-text'>
                        <p className={location.pathname === '/' ? 'active' : ''}>
                            <Link to="/">Главная</Link>
                        </p>
                        <p className={location.pathname === '/video' ? 'active' : ''}>
                            <Link to="/">Видео-уроки</Link>
                        </p>
                        <p className={location.pathname === '/questions' ? 'active' : ''}>
                            <Link to="/questions">Вопросы</Link>
                        </p>
                        <p className={location.pathname === '/groups' ? 'active' : ''}>
                            <Link to="/groups">Группы</Link>
                        </p>
                    </div>
                    <div>
                        {token ? (
                            <button className='Header-Botton' onClick={handleLogout}>Выйти из системы</button>
                        ) : (
                            <button className='Header-Botton'>
                                <Link to="/login" className='Header-Botton-Link'>Войти в систему</Link>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
