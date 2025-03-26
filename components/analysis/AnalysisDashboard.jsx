import React, { useState } from 'react';
import AnalysisSummary from './AnalysisSummary';
import SentimentAnalysis from './SentimentAnalysis';
import TopicsAnalysis from './TopicsAnalysis';
import StakeholderImpact from './StakeholderImpact';

// Fully implemented component replacements for placeholders
const AnalysisSummaryPlaceholder = ({ data }) => (
  <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Analysis Summary</h3>
    <div className="prose dark:prose-invert">
      <p className="text-gray-700 dark:text-gray-300">{data?.summary || 'No summary available.'}</p>
      {data?.key_points && data.key_points.length > 0 && (
        <div className="mt-3">
          <h4 className="text-md font-medium mb-1 text-gray-700 dark:text-gray-300">Key Points:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.key_points.slice(0, 3).map((point, idx) => (
              <li key={idx} className="text-gray-600 dark:text-gray-400">
                {typeof point === 'string' ? point : point.point}
              </li>
            ))}
            {data.key_points.length > 3 && (
              <li className="text-gray-500 dark:text-gray-500 italic">
                +{data.key_points.length - 3} more points
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const SentimentAnalysisPlaceholder = ({ data }) => {
  // Calculate sentiment score and determine color
  const sentimentScore = data?.sentiment_score || 0;
  const sentimentLabel =
    sentimentScore > 0.5 ? 'Positive' :
    sentimentScore > 0 ? 'Slightly Positive' :
    sentimentScore === 0 ? 'Neutral' :
    sentimentScore > -0.5 ? 'Slightly Negative' : 'Negative';
  
  const sentimentColor =
    sentimentScore > 0.5 ? 'text-green-600 dark:text-green-400' :
    sentimentScore > 0 ? 'text-green-500 dark:text-green-300' :
    sentimentScore === 0 ? 'text-gray-500 dark:text-gray-400' :
    sentimentScore > -0.5 ? 'text-red-500 dark:text-red-300' : 'text-red-600 dark:text-red-400';
  
  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Sentiment Analysis</h3>
      <div className="flex flex-col items-center">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
          <div
            className={`h-4 rounded-full ${sentimentScore >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.abs(sentimentScore * 100)}%`, marginLeft: sentimentScore < 0 ? 0 : '50%', marginRight: sentimentScore >= 0 ? 0 : '50%' }}
          ></div>
        </div>
        <div className="text-center">
          <span className={`text-xl font-bold ${sentimentColor}`}>{sentimentLabel}</span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Score: {sentimentScore.toFixed(2)} ({Math.abs(sentimentScore * 100).toFixed(0)}% {sentimentScore >= 0 ? 'Positive' : 'Negative'})
          </p>
        </div>
      </div>
    </div>
  );
};

const TopicsAnalysisPlaceholder = ({ data }) => {
  // Extract topics from key_terms or topics field
  const topics = data?.key_terms || data?.topics || [];
  const formattedTopics = Array.isArray(topics)
    ? topics.map(t => typeof t === 'string' ? t : t.term || t.topic || '')
    : Object.keys(topics);
  
  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Topics Analysis</h3>
      {formattedTopics.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {formattedTopics.slice(0, 8).map((topic, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
          {formattedTopics.length > 8 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm">
              +{formattedTopics.length - 8} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No key topics identified</p>
      )}
    </div>
  );
};

const StakeholderImpactPlaceholder = ({ data }) => {
  // Extract stakeholder impacts from various fields
  const stakeholders = [];
  
  if (data?.public_health_impacts?.vulnerable_populations) {
    stakeholders.push(...data.public_health_impacts.vulnerable_populations.map(p => ({
      name: p,
      type: 'Vulnerable Population',
      impact: 'Health'
    })));
  }
  
  if (data?.stakeholder_impacts) {
    Object.entries(data.stakeholder_impacts).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        stakeholders.push(...value.map(v => ({
          name: typeof v === 'string' ? v : v.name || key,
          type: 'Stakeholder',
          impact: typeof v === 'string' ? 'Affected' : v.impact || 'Affected'
        })));
      }
    });
  }
  
  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Stakeholder Impact</h3>
      {stakeholders.length > 0 ? (
        <div className="space-y-2">
          {stakeholders.slice(0, 5).map((stakeholder, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{stakeholder.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">({stakeholder.type})</span>
              </div>
              <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                {stakeholder.impact}
              </span>
            </div>
          ))}
          {stakeholders.length > 5 && (
            <p className="text-sm text-gray-500 dark:text-gray-500 italic text-center">
              +{stakeholders.length - 5} more stakeholders affected
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No stakeholder impacts identified</p>
      )}
    </div>
  );
};

const AnalysisDashboard = ({ analysisData }) => {
  // Use actual components if they exist, otherwise use placeholders
  const SummaryComponent = typeof AnalysisSummary === 'function' ? AnalysisSummary : AnalysisSummaryPlaceholder;
  const SentimentComponent = typeof SentimentAnalysis === 'function' ? SentimentAnalysis : SentimentAnalysisPlaceholder;
  const TopicsComponent = typeof TopicsAnalysis === 'function' ? TopicsAnalysis : TopicsAnalysisPlaceholder;
  const ImpactComponent = typeof StakeholderImpact === 'function' ? StakeholderImpact : StakeholderImpactPlaceholder;

  return (
    <div className="analysis-dashboard">
      <h2 className="text-2xl font-bold mb-4">Bill Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryComponent data={analysisData} />
        <SentimentComponent data={analysisData} />
        <TopicsComponent data={analysisData} />
        <ImpactComponent data={analysisData} />
      </div>
    </div>
  );
};

export default AnalysisDashboard;