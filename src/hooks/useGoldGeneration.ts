import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateGoldCoins } from '../store/gameSlice';

const UPDATE_INTERVAL = 1000; // Update every second

export const useGoldGeneration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateGoldCoins());
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useGoldGeneration; 