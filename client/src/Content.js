import {BrowserRouter, Router, Routes, Route} from 'react-router-dom';
import Info from './Info';
import Chracters from './Chracters';
import FanTheories from './FanTheories';
import Review from './Review';
import Write from './Write';
const Content = () => {
    return(
        <div>
        <Routes>
            <Route path="info" element={<Info />} />
            <Route path="characters" element={<Chracters />} />
            <Route path="fantheories" element={<FanTheories />} />
            <Route path="reviews" element={<Review />} />
            <Route path="write" element={<Write />} />
        </Routes>
        </div>
    )
}

export default Content;