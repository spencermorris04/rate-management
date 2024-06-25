"use client";

import { useState, useEffect } from 'react';

interface RateManagementItem {
  facility_name: string;
  group_name: string;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  historical_move_ins_last_60_days_group: number;
  move_ins_last_60_days_group: number;
  historical_move_ins_next_60_days_group: number;
  projected_move_ins_group: number;
  facility_projected_move_ins_scaled: number;
  blended_move_in_projection: number;
  blended_move_out_projection: number;
  projected_net_rentals: number;
  competitor_count: number;
  competitor_percentage_cheaper: number;
  mean_competitor_price: number;
  competitor_impact: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
  long_term_customer_average: number | null;
  average_web_rate: number;
  average_standard_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
}

const RateManagementPage: React.FC = () => {
  const [data, setData] = useState<RateManagementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/rate-management');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: RateManagementItem[] = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rate Management Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Facility Name</th>
              <th className="px-4 py-2 border">Group Name</th>
              <th className="px-4 py-2 border">Total Units</th>
              <th className="px-4 py-2 border">Occupied Units</th>
              <th className="px-4 py-2 border">Occupancy Rate</th>
              <th className="px-4 py-2 border">Historical Move-ins (Last 60 Days)</th>
              <th className="px-4 py-2 border">Move-ins (Last 60 Days)</th>
              <th className="px-4 py-2 border">Historical Move-ins (Next 60 Days)</th>
              <th className="px-4 py-2 border">Projected Move-ins</th>
              <th className="px-4 py-2 border">Facility Projected Move-ins (Scaled)</th>
              <th className="px-4 py-2 border">Blended Move-in Projection</th>
              <th className="px-4 py-2 border">Blended Move-out Projection</th>
              <th className="px-4 py-2 border">Projected Net Rentals</th>
              <th className="px-4 py-2 border">Competitor Count</th>
              <th className="px-4 py-2 border">Competitor % Cheaper</th>
              <th className="px-4 py-2 border">Mean Competitor Price</th>
              <th className="px-4 py-2 border">Competitor Impact</th>
              <th className="px-4 py-2 border">Projected Occupancy Impact</th>
              <th className="px-4 py-2 border">Leasing Velocity Impact</th>
              <th className="px-4 py-2 border">Long-term Customer Average</th>
              <th className="px-4 py-2 border">Average Web Rate</th>
              <th className="px-4 py-2 border">Average Standard Rate</th>
              <th className="px-4 py-2 border">Recent Period Average Move-in Rent</th>
              <th className="px-4 py-2 border">Suggested Web Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.facility_name}</td>
                <td className="px-4 py-2 border">{item.group_name}</td>
                <td className="px-4 py-2 border">{item.total_units}</td>
                <td className="px-4 py-2 border">{item.occupied_units}</td>
                <td className="px-4 py-2 border">{(item.occupancy_rate * 100).toFixed(2)}%</td>
                <td className="px-4 py-2 border">{item.historical_move_ins_last_60_days_group}</td>
                <td className="px-4 py-2 border">{item.move_ins_last_60_days_group}</td>
                <td className="px-4 py-2 border">{item.historical_move_ins_next_60_days_group}</td>
                <td className="px-4 py-2 border">{item.projected_move_ins_group}</td>
                <td className="px-4 py-2 border">{item.facility_projected_move_ins_scaled}</td>
                <td className="px-4 py-2 border">{item.blended_move_in_projection}</td>
                <td className="px-4 py-2 border">{item.blended_move_out_projection}</td>
                <td className="px-4 py-2 border">{item.projected_net_rentals}</td>
                <td className="px-4 py-2 border">{item.competitor_count}</td>
                <td className="px-4 py-2 border">{(item.competitor_percentage_cheaper * 100).toFixed(2)}%</td>
                <td className="px-4 py-2 border">${item.mean_competitor_price.toFixed(2)}</td>
                <td className="px-4 py-2 border">{item.competitor_impact}</td>
                <td className="px-4 py-2 border">{item.projected_occupancy_impact}</td>
                <td className="px-4 py-2 border">{item.leasing_velocity_impact}</td>
                <td className="px-4 py-2 border">{item.long_term_customer_average ?? 'N/A'}</td>
                <td className="px-4 py-2 border">${item.average_web_rate}</td>
                <td className="px-4 py-2 border">${item.average_standard_rate}</td>
                <td className="px-4 py-2 border">{item.recent_period_average_move_in_rent ? `$${item.recent_period_average_move_in_rent}` : 'N/A'}</td>
                <td className="px-4 py-2 border">{item.suggested_web_rate ? `$${item.suggested_web_rate.toFixed(2)}` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateManagementPage;