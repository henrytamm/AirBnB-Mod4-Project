import './SpotPage.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { allSpots } from '../../store/spots';
import SpotList from '../SpotList';
import CreateSpotButton from '../CreateSpotButton';

function SpotPage() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(allSpots());
    }, []);

    return (
        <div>
            <CreateSpotButton />
            <SpotList />
        </div>
    )
}


export default SpotPage;