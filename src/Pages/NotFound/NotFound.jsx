import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <section className="not-found">
            <div className="container">
                <h1>404 - Страница не найдена</h1>
                <p>Извините, запрашиваемая страница не существует.</p>
                <Link to="/">Перейти на главную страницу</Link>
            </div>
        </section>
    );
};

export default NotFound;