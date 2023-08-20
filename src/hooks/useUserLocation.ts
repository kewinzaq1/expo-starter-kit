import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const useUserLocation = () => {
  const [error, setError] = useState<string>();
  const [location, setLocation] = useState<Location.LocationObject>();

  const init = useCallback(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    })();
  }, []);

  useEffect(() => {
    init();
  }, []);

  return {
    error,
    location,
    reset: init,
  };
};
