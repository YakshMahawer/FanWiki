import { BrowserRouter as Router, Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WidePoster from './deadpool_ver12_xlg.jpg'
import './NavigationButtons.css'
const NavigationButtons = () => {
    const navigate = useNavigate();

    const handleWriteReview = () => {
        if (localStorage.getItem('token')) {
        navigate('/review');
        } else {
        navigate('/login');
        }
    };

    const handleLogout = async () => {
    try {
        // Make a POST request to the logout endpoint
        await axios.post('http://localhost:5000/logout', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });
        
        // Clear token from local storage
        localStorage.removeItem('token');

        // Redirect to login page
        navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
    };
    return(
        <div>
            <div className="black_div"></div>
            <div className="wide_poster_div">
                <img src={WidePoster} alt="" srcset="" />
            </div>
            <div className="nav_buttons_div">
                <Link to="/home/info">
                    <button className={`button_class ${(window.location.href == "http://localhost:3000/home/info")? 'active_class': ''}`}>Info</button>
                </Link>
                <Link to="/home/characters">
                    <button className={`button_class ${(window.location.href == "http://localhost:3000/home/characters")? 'active_class': ''}`}>Characters</button>
                </Link>
                <Link to="/home/reviews">
                    <button className={`button_class ${(window.location.href == "http://localhost:3000/home/reviews")? 'active_class': ''}`}>Reviews</button>
                </Link>
                <Link to="/home/fantheories">
                    <button className={`button_class ${(window.location.href == "http://localhost:3000/home/fantheories")? 'active_class': ''}`}>Fan Theories</button>
                </Link>
                <Link to="/home/write">
                    <button className={`button_class ${(window.location.href == "http://localhost:3000/home/write")? 'active_class': ''}`} onClick={handleWriteReview}>Write</button>
                </Link>
                <button className="button_class" onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        </div>
    )
}

export default NavigationButtons;