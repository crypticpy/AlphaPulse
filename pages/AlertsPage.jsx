import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { billService } from "../services/api";
import Card from "../components/ui/Card";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import ImpactBadge from "../components/ui/ImpactBadge";
import PrimaryImpactDisplay from "../components/ui/PrimaryImpactDisplay";
import logger from "../utils/logger";

/**
 * AlertsPage - Displays all high-impact bills and executive orders
 * sorted from latest to oldest
 */
const AlertsPage = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, bills, executive-orders

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would call a specific endpoint for high-impact bills
        // For now, we'll use the mockHighImpactBills for demonstration

        // This would be the actual service call:
        // const data = await billService.getHighImpactBills();

        // Using mock data for demonstration
        const data = getMockHighImpactBills();
        setAlerts(data);
      } catch (err) {
        logger.error("Error fetching alerts", { error: err });
        setError(err.message || "Failed to load alerts");
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return filter === alert.type;
  });

  // Sort by date, newest first
  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { path: "/", label: "Home" },
          { path: "/alerts", label: "High-Impact Alerts", isLast: true },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-2">
          High-Impact Alerts
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track important bills and executive orders with significant potential
          impact.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setFilter("all")}
            className={`inline-block py-2 px-4 text-sm font-medium ${
              filter === "all"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter("bill")}
            className={`inline-block py-2 px-4 text-sm font-medium ${
              filter === "bill"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Bills
          </button>
          <button
            onClick={() => setFilter("executive-order")}
            className={`inline-block py-2 px-4 text-sm font-medium ${
              filter === "executive-order"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Executive Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : sortedAlerts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No alerts found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no high-impact{" "}
            {filter !== "all"
              ? filter === "bill"
                ? "bills"
                : "executive orders"
              : "alerts"}{" "}
            at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedAlerts.map((alert) => (
            <Card
              key={alert.id}
              className="shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        alert.type === "bill"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {alert.type === "bill" ? "Bill" : "Executive Order"}
                    </span>
                    <ImpactBadge impact={alert.impactLevel} />
                    <span className="text-xs text-gray-500">
                      {new Date(alert.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-x-3 mb-2">
                    <h2 className="text-lg font-semibold text-primary-700">
                      <Link
                        to={`/bills/${alert.id}`}
                        className="hover:underline"
                      >
                        {alert.title}
                      </Link>
                    </h2>
                    {alert.impactDetails && (
                      <PrimaryImpactDisplay
                        impactDetails={alert.impactDetails}
                      />
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {alert.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <BookmarkButton bill={alert} size="md" showText={false} />
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <Link
                  to={`/bills/${alert.id}`}
                  className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock data function for high-impact bills and executive orders
const getMockHighImpactBills = () => [
  {
    id: "HR1234",
    title: "HR 1234 - Critical Healthcare Reform Act",
    description:
      "Comprehensive reform of healthcare systems with potential significant impacts on service delivery and costs.",
    type: "bill",
    impactLevel: "critical",
    date: "2023-03-15",
    categories: ["Healthcare", "Public Health", "Finance"],
    impactDetails: "Healthcare system restructuring",
    status: "In Committee",
  },
  {
    id: "EO2023-04",
    title: "Executive Order 2023-04: Emergency Climate Response",
    description:
      "Presidential executive order establishing new regulations for industries to address climate change.",
    type: "executive-order",
    impactLevel: "high",
    date: "2023-04-22",
    categories: ["Environment", "Industry", "Energy"],
    impactDetails: "Regulatory changes for emissions",
    status: "Active",
  },
  {
    id: "SB5678",
    title: "SB 5678 - Education Funding Emergency Act",
    description:
      "Immediate reallocation of budget resources to address education funding shortfalls nationwide.",
    type: "bill",
    impactLevel: "high",
    date: "2023-02-28",
    categories: ["Education", "Budget", "Local Government"],
    impactDetails: "Budget reallocation and funding",
    status: "Passed Committee",
  },
  {
    id: "EO2023-02",
    title: "Executive Order 2023-02: Border Security Directive",
    description:
      "New border security measures with significant changes to immigration processes and enforcement.",
    type: "executive-order",
    impactLevel: "critical",
    date: "2023-01-20",
    categories: ["Immigration", "National Security", "Law Enforcement"],
    impactDetails: "Border security and immigration",
    status: "Active",
  },
  {
    id: "HR7890",
    title: "HR 7890 - Infrastructure Investment and Jobs Act",
    description:
      "Major infrastructure investment bill with significant funding for roads, bridges, and public works projects.",
    type: "bill",
    impactLevel: "high",
    date: "2023-03-01",
    categories: ["Infrastructure", "Jobs", "Transportation"],
    impactDetails: "National infrastructure development",
    status: "Floor Vote Scheduled",
  },
];

export default AlertsPage;
