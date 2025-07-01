// src/components/organisms/WeatherWidget.tsx
import React, { useEffect } from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Zap, Thermometer, Droplets } from 'lucide-react';

// Função para mapear o código do ícone da API para um componente de ícone
const getWeatherIcon = (iconCode: string, size: number) => {
  const code = iconCode.substring(0, 2); // Ex: '01d' -> '01'
  switch (code) {
    case '01': return <Sun size={size} className="text-yellow-500" />;
    case '02': case '03': case '04': return <Cloud size={size} className="text-gray-500 dark:text-gray-400" />;
    case '09': case '10': return <CloudRain size={size} className="text-blue-500" />;
    case '11': return <Zap size={size} className="text-yellow-400" />;
    case '13': return <CloudSnow size={size} className="text-blue-200" />;
    default: return <Cloud size={size} className="text-gray-500" />;
  }
};

export const WeatherWidget = () => {
  const { data, forecast, loading, error, fetchWeatherData } = useWeatherStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error("Erro ao obter geolocalização:", err);
          fetchWeatherData();
        }
      );
    } else {
      fetchWeatherData();
    }
  }, [fetchWeatherData]);

  const containerClass = "bg-white/10 dark:bg-slate-900/20 p-4 rounded-2xl shadow-lg flex flex-col h-full backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30";

  if (loading) {
    return (
      <div className={`${containerClass} items-center justify-center animate-pulse`}>
        <p className="text-slate-500 dark:text-slate-400">Carregando clima...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClass} items-center justify-center`}>
        <p className="font-bold text-red-500">Erro!</p>
        <p className="text-xs text-center text-red-500/80 mt-2">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={containerClass} >
      {/* Seção do Clima Atual */}
      <div className="flex justify-between items-start text-slate-800 dark:text-slate-100">
        <div>
          <h3 className="font-bold text-lg">{data.location}</h3>
          <p className="text-sm capitalize">{data.conditionDescription}</p>
        </div>
        {getWeatherIcon(data.icon, 48)}
      </div>
      <div className="flex justify-between items-end text-slate-800 dark:text-slate-100">
        <span className="text-5xl font-bold">{data.temperature}°C</span>
        <div className="text-right text-sm">
          <div className="flex items-center justify-end gap-1"><Thermometer size={16} /><span>{data.tempMax}° / {data.tempMin}°</span></div>
          <div className="flex items-center justify-end gap-1"><Droplets size={16} /><span>{data.humidity}% umidade</span></div>
        </div>
      </div>

      <hr className="my-3 border-slate-300/20 dark:border-gray-600/30" />
      
      {/* Seção de Previsão */}
      <div className="flex justify-around items-center text-center mt-auto">
        {forecast.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1 text-slate-800 dark:text-slate-200">
            <span className="text-sm font-bold uppercase">{item.day}</span>
            {getWeatherIcon(item.icon, 24)}
            <span className="text-md font-semibold">{item.temp}°</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};