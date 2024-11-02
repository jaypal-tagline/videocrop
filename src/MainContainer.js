import React, { useState } from 'react';
import './App.css';
import SingleTrim30SecondVideo from './30SecondTrimVideo';
import SingleTrimVideo from './SingleTrimVideo';
import OneMinuteTrim from './OneMinuteTrimVideo';
import MultiTrimVideo from './VideoComponent';

const ThirtySecondTrim = () => (
  <div className="tab-content">
    <h3>30 Second Trim</h3>
    <SingleTrim30SecondVideo />
  </div>
);

const OneMinutesTrim = () => (
  <div className="tab-content">
    <h3>1 Minute Trim</h3>
    <OneMinuteTrim />
  </div>
);

const CustomTrim = () => (
  <div className="tab-content">
    <h3>Custom Trim</h3>
    <SingleTrimVideo />
  </div>
);

const MultipleCrop = () => (
  <div className="tab-content">
    <h3>Multiple Crop by Time Frame</h3>
    <MultiTrimVideo />
  </div>
);

const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('ThirtySecondTrim');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ThirtySecondTrim':
        return <ThirtySecondTrim />;
      case 'OneMinuteTrim':
        return <OneMinutesTrim />;
      case 'CustomTrim':
        return <CustomTrim />;
      case 'MultipleCrop':
        return <MultipleCrop />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="tab-header">
        <h2
          className={`tab ${activeTab === 'ThirtySecondTrim' ? 'active' : ''}`}
          onClick={() => setActiveTab('ThirtySecondTrim')}
        >
          30 Second Trim
        </h2>
        <h2
          className={`tab ${activeTab === 'OneMinuteTrim' ? 'active' : ''}`}
          onClick={() => setActiveTab('OneMinuteTrim')}
        >
          1 Minute Trim
        </h2>
        <h2
          className={`tab ${activeTab === 'CustomTrim' ? 'active' : ''}`}
          onClick={() => setActiveTab('CustomTrim')}
        >
          Custom Trim
        </h2>
        <h2
          className={`tab ${activeTab === 'MultipleCrop' ? 'active' : ''}`}
          onClick={() => setActiveTab('MultipleCrop')}
        >
          Multiple Crop by Time Frame
        </h2>
      </div>
      
      <div className="tab-content-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MainContainer;

