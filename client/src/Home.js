import DpBack from './file.png'
import Dp1 from './dp1.jpg'
import Dp2 from './dp2.png'
import Dp3 from './dp3.png'
import { useNavigate } from 'react-router-dom';

import './home.css'
const Home = () => {
    const navigate = useNavigate();
    return(
        <div className="home_div">
            <div className="img_dp">
                <div className="movie_logos">
                    <img src={Dp1} alt="" />
                    <img src={Dp2} alt="" />
                    <img src={Dp3} alt="" />
                </div>
                <div className="max_effort">MAXIMUM EFFORT...</div>
                <img src={DpBack} alt="" />
            </div>
            <div className="home_info_div">
            <div className="back_style"></div>
            <div className="deadpool_mayhem"></div>
                <div className="fanwiki_things">
                    <div className="fan_wiki_text">FAN WIKI</div>
                    <div className="fan_wiki_info">Dive into the Deadpool universe with detailed franchise info, movie reviews, and a vibrant fan theory discussion section!</div>
                    <div className="explore_button" onClick={() => navigate('/home/info')}>EXPLORE NOW...</div>
                </div>
            </div>
        </div>
    )
}

export default Home;