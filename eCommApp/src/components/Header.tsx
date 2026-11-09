import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="app-header">
            <h1>The Daily Harvest</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                <button type="button" onClick={() => navigate('/contact')}>Contact Us</button>
                <Link to="/login">
                    <button>Admin Login</button>
                </Link>
            </nav>
        </header>
    );
};

export default Header;
