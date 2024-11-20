import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import { DayData, CalendarData } from '../types';
import { getMonthData, formatDate } from '../utils/dateUtils';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('calendarData');
    if (savedData) {
      setCalendarData(JSON.parse(savedData));
    }
  }, []);

  const saveData = (date: Date, data: DayData) => {
    const newData = {
      ...calendarData,
      [formatDate(date)]: data,
    };
    setCalendarData(newData);
    localStorage.setItem('calendarData', JSON.stringify(newData));
  };

  const clearDayData = (date: Date) => {
    const newData = { ...calendarData };
    delete newData[formatDate(date)];
    setCalendarData(newData);
    localStorage.setItem('calendarData', JSON.stringify(newData));
    setIsModalOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { days, month, year } = getMonthData(currentDate);
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setCurrentDate(new Date());
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-800 p-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const isToday = day && 
            day.getDate() === today.getDate() && 
            day.getMonth() === today.getMonth() && 
            day.getFullYear() === today.getFullYear();
          
          const hasData = day && calendarData[formatDate(day)];
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 relative ${
                !day 
                  ? 'bg-gray-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'
              }`}
              onClick={() => {
                if (day) {
                  setSelectedDay(day);
                  setIsModalOpen(true);
                }
              }}
            >
              {day && (
                <>
                  <div
                    className={`flex items-center justify-between ${
                      isToday
                        ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className={`${isToday ? 'mx-auto' : 'font-medium'}`}>
                      {day.getDate()}
                    </span>
                    {hasData && !isToday && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  {hasData && (
                    <div className="mt-2 space-y-1">
                      {calendarData[formatDate(day)].note && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {calendarData[formatDate(day)].note}
                        </p>
                      )}
                      {calendarData[formatDate(day)].links?.length > 0 && (
                        <div className="text-xs text-blue-500 dark:text-blue-400">
                          {calendarData[formatDate(day)].links.length} link(s)
                        </div>
                      )}
                      {calendarData[formatDate(day)].photos?.length > 0 && (
                        <div className="text-xs text-green-500 dark:text-green-400">
                          {calendarData[formatDate(day)].photos.length} photo(s)
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDay(null);
          }}
          date={selectedDay}
          data={calendarData[formatDate(selectedDay)]}
          onSave={saveData}
          onClear={() => clearDayData(selectedDay)}
        />
      )}
    </div>
  );
}