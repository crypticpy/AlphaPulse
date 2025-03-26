import React, { useState, useEffect } from "react";
import KeyTermsCloud from "./KeyTermsCloud";
import ImpactChart from "./ImpactChart";
import BillTimeline from "./BillTimeline";
import AnalysisRadarChart from "./AnalysisRadarChart";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { FiBarChart2, FiClock, FiSearch, FiPieChart } from "react-icons/fi";
import logger from "../../utils/logger";

/**
 * Loading indicator component
 */
const LoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Message for when no data is available
 */
const NoDataMessage = ({ message }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm mt-2">
        No data available to generate this visualization
      </p>
    </div>
  </div>
);

/**
 * Tab button component
 */
const TabButton = ({ tab, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center mr-4 py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 
      ${!disabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
      ${
        isActive
          ? "border-blue-500 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    aria-current={isActive ? "page" : undefined}
  >
    <span className="mr-2">{tab.icon}</span>
    {tab.label}
  </button>
);

/**
 * Key Terms visualization component
 */
const KeyTermsVisualization = ({ analysisData, billData, isDarkMode }) => {
  // Merge the analysis data with bill data to provide access to bill text
  const enrichedAnalysisData = {
    ...analysisData,
    bill: billData, // Pass the entire bill object for text extraction
    latest_text: billData?.latest_text || analysisData?.latest_text,
  };

  console.log("KeyTermsVisualization: Passing data to KeyTermsCloud", {
    hasAnalysisData: !!analysisData,
    hasBillData: !!billData,
    billTextAvailable: !!billData?.latest_text?.text,
    analysisDataKeys: Object.keys(analysisData || {}),
  });

  return (
    <KeyTermsCloud
      analysisData={enrichedAnalysisData}
      height={300}
      width={600}
      isDarkMode={isDarkMode}
    />
  );
};

/**
 * Impact Assessment visualization component
 */
const ImpactAssessmentVisualization = ({ analysisData, isDarkMode }) => {
  return <ImpactChart analysisData={analysisData} isDarkMode={isDarkMode} />;
};

/**
 * Radar Chart visualization component
 */
const RadarVisualization = ({ analysisData, isDarkMode }) => {
  return (
    <AnalysisRadarChart analysisData={analysisData} isDarkMode={isDarkMode} />
  );
};

/**
 * Timeline visualization component
 */
const TimelineVisualization = ({ billData, isDarkMode }) => {
  return <BillTimeline billData={billData} isDarkMode={isDarkMode} />;
};

/**
 * Main visualization dashboard component
 */
const VisualizationDashboard = ({ bill }) => {
  const [activeTab, setActiveTab] = useState("keyTerms");
  const { preferences } = useUserPreferences();
  const isDarkMode = preferences.theme === "dark";

  // Extract the necessary data from the bill object
  const billData = bill || {};
  const analysisData = bill?.analysis || {};

  // Log available data for debugging
  console.log("VisualizationDashboard: Available data", {
    hasBill: !!bill,
    hasAnalysis: !!bill?.analysis,
    hasBillText: !!bill?.latest_text?.text,
    billKeys: Object.keys(billData),
    analysisKeys: Object.keys(analysisData),
  });

  // Check if we have valid data for each tab - be more lenient with KeyTerms
  const hasKeyTerms = !!bill; // Allow key terms as long as we have a bill object
  const hasImpactData = !!analysisData && Object.keys(analysisData).length > 0;
  const hasRadarData = !!analysisData && Object.keys(analysisData).length > 0;
  const hasTimelineData =
    !!billData &&
    Array.isArray(billData.history) &&
    billData.history.length > 0;

  const tabs = [
    {
      id: "keyTerms",
      label: "Key Terms",
      icon: <FiSearch className="w-4 h-4" />,
      enabled: hasKeyTerms,
    },
    {
      id: "impact",
      label: "Impact Assessment",
      icon: <FiBarChart2 className="w-4 h-4" />,
      enabled: hasImpactData,
    },
    {
      id: "radar",
      label: "Impact Radar",
      icon: <FiPieChart className="w-4 h-4" />,
      enabled: hasRadarData,
    },
    {
      id: "timeline",
      label: "Bill Timeline",
      icon: <FiClock className="w-4 h-4" />,
      enabled: hasTimelineData,
    },
  ];

  // If current active tab has no data, switch to first available tab
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (currentTab && !currentTab.enabled) {
      const firstEnabledTab = tabs.find((tab) => tab.enabled);
      if (firstEnabledTab) {
        setActiveTab(firstEnabledTab.id);
      }
    }
  }, [activeTab, tabs]);

  /**
   * Render the active visualization based on selected tab
   */
  const renderVisualization = () => {
    if (!billData) {
      return <LoadingIndicator />;
    }

    // No data state
    if (Object.keys(analysisData).length === 0 && !hasTimelineData) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No analysis data available</p>
            <p className="text-sm">
              Analysis data is required to generate visualizations
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "keyTerms":
        return hasKeyTerms ? (
          <KeyTermsVisualization
            analysisData={analysisData}
            billData={billData}
            isDarkMode={isDarkMode}
          />
        ) : (
          <NoDataMessage message="No key terms data available" />
        );

      case "impact":
        return hasImpactData ? (
          <ImpactAssessmentVisualization
            analysisData={analysisData}
            isDarkMode={isDarkMode}
          />
        ) : (
          <NoDataMessage message="No impact assessment data available" />
        );

      case "radar":
        return hasRadarData ? (
          <RadarVisualization
            analysisData={analysisData}
            isDarkMode={isDarkMode}
          />
        ) : (
          <NoDataMessage message="No radar chart data available" />
        );

      case "timeline":
        return hasTimelineData ? (
          <TimelineVisualization billData={billData} isDarkMode={isDarkMode} />
        ) : (
          <NoDataMessage message="No timeline data available" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg transition-colors duration-200">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={!tab.enabled}
          />
        ))}
      </div>

      <div className="visualization-container h-[400px] max-h-[400px] relative overflow-hidden">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationDashboard;
