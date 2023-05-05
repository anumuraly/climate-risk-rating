import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export type MapProps = {
  data: DataItem[];
  decade: string;
};

export type DataItem = {
  'Asset Name': string;
  Lat: string;
  Long: string;
  'Business Category': string;
  'Risk Rating': string;
  'Risk Factors': string;
  Year: string;
};

export const getMarkerColor = (riskRating: string): string => {
  const rating = Number(riskRating);
  if (rating <= .3) {
    return '#00ff00'; // green
  } else if (rating <= .7) {
    return '#ffff00'; // yellow
  } else {
    return '#ff0000'; // red
  }
};

const Map = ({ data, decade }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!data.length || map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [Number(data[0].Long), Number(data[0].Lat)],
      zoom: 6,
      attributionControl: false,
      accessToken: 'pk.eyJ1IjoiYW51bXVyYWx5IiwiYSI6ImNsZ3diYTM3bzAyZ3Yzb21zZm1ld2ZrbjEifQ.Wrnk8ZCBuvMZadSJqsuPdg',
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
    
    const markers = data.map((item) => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item['Risk Rating']),
      })
      .setLngLat([Number(item.Long), Number(item.Lat)])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<div><b>${item['Asset Name']}</b></div><div>${item['Business Category']}</div>`))
      .addTo(map.current!);
      marker.getElement().addEventListener('mouseenter', () => {
        if (marker.getPopup()) {
          marker.togglePopup();
        }
      });
        marker.getElement().addEventListener('mouseleave', () => {
          if (marker.getPopup()) {
            marker.togglePopup();
          }
        });
      return marker;
    });

    map.current.on('zoomend', () => {
      const zoom = map.current!.getZoom();
      console.log(`Zoom level: ${zoom}`);
    });

    map.current.on('moveend', () => {
      const center = map.current!.getCenter();
      console.log(`Center: ${center.lng}, ${center.lat}`);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data]);

  useEffect(() => {
    markers.current.forEach((marker) => {
      marker.remove();
    });

    const filteredData = data.filter((item) => {
      const year = Number(item.Year);
      const startYear = Number(decade);
      const endYear = startYear + 9;
      return year >= startYear && year <= endYear;
    });

    markers.current = filteredData.map((item) => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item['Risk Rating']),
      })
      .setLngLat([Number(item.Long), Number(item.Lat)])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<div><b>${item['Asset Name']}</b></div><div>${item['Business Category']}</div>`))
      .addTo(map.current!);
        
      marker.getElement().addEventListener('mouseenter', () => {
        if (marker.getPopup()) {
          marker.togglePopup();
        }
      });
  
      marker.getElement().addEventListener('mouseleave', () => {
        if (marker.getPopup()) {
          marker.togglePopup();
        }
      });
      return marker;
    });
  }, [data, decade]);
  return <div ref={mapContainer} style={{ height: '96vh', width: '98vw' }} ></div>
};

export default Map;