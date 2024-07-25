import { BrowserRouter as Router, Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const NavigationButtons = () => {
    const navigate = useNavigate();

    const handleWriteReview = () => {
        if (localStorage.getItem('token')) {
        navigate('/review');
        } else {
        navigate('/login');
        }
    };
    return(
        <div>
            <Link to="/home/info">
                <button>Info</button>
            </Link>
            <Link to="/home/characters">
                <button>Characters</button>
            </Link>
            <Link to="/home/reviews">
                <button>Reviews</button>
            </Link>
            <Link to="/home/fantheories">
                <button>Fan Theories</button>
            </Link>
            <Link to="/home/write">
                <button onClick={handleWriteReview}>Write</button>
            </Link>
        </div>
    )
}

export default NavigationButtons;