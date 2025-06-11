// useLocationPolling.js

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useLocationPolling(roomId) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('room_id', roomId);

      if (error) {
        console.error('Error fetching locations:', error.message);
      } else {
        setLocations(data);
      }
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [roomId]);

  return locations;
  console.log('Polled coordinates:', latitude, longitude);

}
