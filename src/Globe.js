import { useEffect, useState } from 'react';
import ReactGlobeGl from 'react-globe.gl';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

const MAX_LOCATIONS_LENGTH = 50;

const Globe = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fetchLocations, setFetchLocations] = useState(false);
  const [gData, setGData] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (!isConnected || fetchLocations) return;

    const sendPing = () => {
      socket.emit('ping', 'hello');
      setFetchLocations(true);
    };

    sendPing();

    return () => {
      socket.off('ping');
    };
  }, [fetchLocations, isConnected]);

  useEffect(() => {
    socket.on('pong', (data) => {
      if (gData.length < MAX_LOCATIONS_LENGTH) {
        setGData([...gData, data]);
      } else {
        socket.emit('ping', 'stop');
      }
    });

    return () => {
      socket.off('pong');
      socket.off('disconnect');
    };
  }, [gData]);

  return (
    <ReactGlobeGl
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      pointsData={gData}
      pointAltitude="size"
    />
  );
};

export default Globe;
