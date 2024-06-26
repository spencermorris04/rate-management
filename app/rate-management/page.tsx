"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface RateManagementItem {
  facility_name: string;
  most_common_area_bucket: string;
  most_common_description: string;
  group_name: string;
  group_type: string;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
  // Additional numerical columns
  average_standard_rate: number;
  average_web_rate: number;
  blended_move_in_projection: number;
  blended_move_out_projection: number;
  competitor_count: number;
  competitor_impact: number;
  current_period_net_rentals: number;
  historical_move_ins_last_60_days_facility: number;
  historical_move_ins_last_60_days_group: number;
  historical_move_ins_next_60_days_facility: number;
  historical_move_ins_next_60_days_group: number;
  historical_move_outs_last_60_days_facility: number;
  historical_move_outs_last_60_days_group: number;
  historical_move_outs_next_60_days_facility: number;
  historical_move_outs_next_60_days_group: number;
  historical_net_rentals: number;
  move_ins_last_60_days_facility: number;
  move_ins_last_60_days_group: number;
  move_outs_last_60_days_facility: number;
  move_outs_last_60_days_group: number;
  projected_move_ins_facility: number;
  projected_move_ins_group: number;
  projected_move_outs_facility: number;
  projected_move_outs_group: number;
  projected_net_rentals: number;
  long_term_customer_average: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
}

interface GroupedData {
  items: RateManagementItem[];
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
  // Additional aggregated numerical columns
  average_standard_rate: number;
  average_web_rate: number;
  blended_move_in_projection: number;
  blended_move_out_projection: number;
  competitor_count: number;
  competitor_impact: number;
  current_period_net_rentals: number;
  historical_move_ins_last_60_days_facility: number;
  historical_move_ins_last_60_days_group: number;
  historical_move_ins_next_60_days_facility: number;
  historical_move_ins_next_60_days_group: number;
  historical_move_outs_last_60_days_facility: number;
  historical_move_outs_last_60_days_group: number;
  historical_move_outs_next_60_days_facility: number;
  historical_move_outs_next_60_days_group: number;
  historical_net_rentals: number;
  move_ins_last_60_days_facility: number;
  move_ins_last_60_days_group: number;
  move_outs_last_60_days_facility: number;
  move_outs_last_60_days_group: number;
  projected_move_ins_facility: number;
  projected_move_ins_group: number;
  projected_move_outs_facility: number;
  projected_move_outs_group: number;
  projected_net_rentals: number;
  long_term_customer_average: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
  subGroups?: { [key: string]: GroupedData };
}

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td<{ level?: number }>`
  border: 1px solid #ddd;
  padding: 12px;
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};
`;

const GroupRow = styled.tr<{ level: number; isExpanded: boolean }>`
  background-color: ${({ level }) => {
    const colors = ['#e6f3ff', '#ffe6e6', '#e6ffe6', '#fff5e6'];
    return colors[level % colors.length];
  }};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ level }) => {
      const colors = ['#ccebff', '#ffcccc', '#ccffcc', '#ffe6cc'];
      return colors[level % colors.length];
    }};
  }

  ${Td} {
    font-weight: bold;
  }
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-block;
  width: 20px;
  text-align: center;
  transition: transform 0.3s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
`;

const DataRow = styled.tr<{ even: boolean }>`
  background-color: ${({ even }) => (even ? '#f9f9f9' : 'white')};
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const GroupableTable: React.FC = () => {
  const [data, setData] = useState<RateManagementItem[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData>({
    items: [],
    total_units: 0,
    occupied_units: 0,
    occupancy_rate: 0,
    recent_period_average_move_in_rent: null,
    suggested_web_rate: null,
    // Initialize additional columns
    average_standard_rate: 0,
    average_web_rate: 0,
    blended_move_in_projection: 0,
    blended_move_out_projection: 0,
    competitor_count: 0,
    competitor_impact: 0,
    current_period_net_rentals: 0,
    historical_move_ins_last_60_days_facility: 0,
    historical_move_ins_last_60_days_group: 0,
    historical_move_ins_next_60_days_facility: 0,
    historical_move_ins_next_60_days_group: 0,
    historical_move_outs_last_60_days_facility: 0,
    historical_move_outs_last_60_days_group: 0,
    historical_move_outs_next_60_days_facility: 0,
    historical_move_outs_next_60_days_group: 0,
    historical_net_rentals: 0,
    move_ins_last_60_days_facility: 0,
    move_ins_last_60_days_group: 0,
    move_outs_last_60_days_facility: 0,
    move_outs_last_60_days_group: 0,
    projected_move_ins_facility: 0,
    projected_move_ins_group: 0,
    projected_move_outs_facility: 0,
    projected_move_outs_group: 0,
    projected_net_rentals: 0,
    long_term_customer_average: 0,
    projected_occupancy_impact: 0,
    leasing_velocity_impact: 0,
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/rate-management', { cache: 'no-store' })
      .then(response => response.json())
      .then(responseData => {
        console.log('API Response:', responseData);
        if (responseData && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          throw new Error('Received data is not an array');
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      });
  }, []);

  useEffect(() => {
    const compareBaseArea = (a: string, b: string) => {
      const areaA = parseFloat(a.match(/\d+/)?.[0] || '0');
      const areaB = parseFloat(b.match(/\d+/)?.[0] || '0');
      return areaA - areaB;
    };

    const groupData = (items: RateManagementItem[], levels: (keyof RateManagementItem)[]): GroupedData => {
      if (levels.length === 0) {
        const total_units = items.reduce((sum, item) => sum + item.total_units, 0);
        const occupied_units = items.reduce((sum, item) => sum + item.occupied_units, 0);
        const occupancy_rate = occupied_units / total_units;
        const recent_period_average_move_in_rent = items.reduce((sum, item) => sum + (item.recent_period_average_move_in_rent || 0), 0) / items.length;
        const suggested_web_rate = items.reduce((sum, item) => sum + (item.suggested_web_rate || 0), 0) / items.length;
        // Aggregate additional columns
        const average_standard_rate = items.reduce((sum, item) => sum + item.average_standard_rate, 0) / items.length;
        const average_web_rate = items.reduce((sum, item) => sum + item.average_web_rate, 0) / items.length;
        const blended_move_in_projection = items.reduce((sum, item) => sum + item.blended_move_in_projection, 0);
        const blended_move_out_projection = items.reduce((sum, item) => sum + item.blended_move_out_projection, 0);
        const competitor_count = items.reduce((sum, item) => sum + item.competitor_count, 0);
        const competitor_impact = items.reduce((sum, item) => sum + item.competitor_impact, 0) / items.length;
        const current_period_net_rentals = items.reduce((sum, item) => sum + item.current_period_net_rentals, 0);
        const historical_move_ins_last_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_ins_last_60_days_facility, 0);
        const historical_move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.historical_move_ins_last_60_days_group, 0);
        const historical_move_ins_next_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_ins_next_60_days_facility, 0);
        const historical_move_ins_next_60_days_group = items.reduce((sum, item) => sum + item.historical_move_ins_next_60_days_group, 0);
        const historical_move_outs_last_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_outs_last_60_days_facility, 0);
        const historical_move_outs_last_60_days_group = items.reduce((sum, item) => sum + item.historical_move_outs_last_60_days_group, 0);
        const historical_move_outs_next_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_outs_next_60_days_facility, 0);
        const historical_move_outs_next_60_days_group = items.reduce((sum, item) => sum + item.historical_move_outs_next_60_days_group, 0);
        const historical_net_rentals = items.reduce((sum, item) => sum + item.historical_net_rentals, 0);
        const move_ins_last_60_days_facility = items.reduce((sum, item) => sum + item.move_ins_last_60_days_facility, 0);
        const move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.move_ins_last_60_days_group, 0);
        const move_outs_last_60_days_facility = items.reduce((sum, item) => sum + item.move_outs_last_60_days_facility, 0);
        const move_outs_last_60_days_group = items.reduce((sum, item) => sum + item.move_outs_last_60_days_group, 0);
        const projected_move_ins_facility = items.reduce((sum, item) => sum + item.projected_move_ins_facility, 0);
        const projected_move_ins_group = items.reduce((sum, item) => sum + item.projected_move_ins_group, 0);
        const projected_move_outs_facility = items.reduce((sum, item) => sum + item.projected_move_outs_facility, 0);
        const projected_move_outs_group = items.reduce((sum, item) => sum + item.projected_move_outs_group, 0);
        const projected_net_rentals = items.reduce((sum, item) => sum + item.projected_net_rentals, 0);
        const leasing_velocity_impact = items.reduce((sum, item) => sum + (item.leasing_velocity_impact || 0), 0) / items.length;
        const projected_occupancy_impact = items.reduce((sum, item) => sum + item.projected_occupancy_impact, 0);
        const long_term_customer_average = items.reduce((sum, item) => sum + (item.long_term_customer_average || 0), 0) / items.length;        

        return { 
          items, 
          total_units, 
          occupied_units, 
          occupancy_rate, 
          recent_period_average_move_in_rent, 
          suggested_web_rate, 
          average_standard_rate, 
          average_web_rate, 
          blended_move_in_projection, 
          blended_move_out_projection, 
          competitor_count, 
          competitor_impact, 
          current_period_net_rentals, 
          historical_move_ins_last_60_days_facility, 
          historical_move_ins_last_60_days_group, 
          historical_move_ins_next_60_days_facility, 
          historical_move_ins_next_60_days_group, 
          historical_move_outs_last_60_days_facility, 
          historical_move_outs_last_60_days_group, 
          historical_move_outs_next_60_days_facility, 
          historical_move_outs_next_60_days_group, 
          historical_net_rentals, 
          move_ins_last_60_days_facility, 
          move_ins_last_60_days_group, 
          move_outs_last_60_days_facility, 
          move_outs_last_60_days_group, 
          projected_move_ins_facility, 
          projected_move_ins_group, 
          projected_move_outs_facility, 
          projected_move_outs_group, 
          projected_net_rentals,
          long_term_customer_average,
          projected_occupancy_impact,
          leasing_velocity_impact
        };
      }

      const grouped = items.reduce((acc, item) => {
        const key = item[levels[0]] as string;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {} as { [key: string]: RateManagementItem[] });

      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        if (levels[0] === 'facility_name' || levels[0] === 'group_type' || levels[0] === 'most_common_description') {
          return a.localeCompare(b);
        } else if (levels[0] === 'most_common_area_bucket') {
          return compareBaseArea(a, b);
        }
        return 0;
      });

      const subGroups = sortedKeys.reduce((acc, key) => {
        acc[key] = groupData(grouped[key], levels.slice(1));
        return acc;
      }, {} as { [key: string]: GroupedData });

      const total_units = Object.values(subGroups).reduce((sum, group) => sum + group.total_units, 0);
      const occupied_units = Object.values(subGroups).reduce((sum, group) => sum + group.occupied_units, 0);
      const occupancy_rate = occupied_units / total_units;
      const recent_period_average_move_in_rent = Object.values(subGroups).reduce((sum, group) => sum + (group.recent_period_average_move_in_rent || 0), 0) / Object.values(subGroups).length;
      const suggested_web_rate = Object.values(subGroups).reduce((sum, group) => sum + (group.suggested_web_rate || 0), 0) / Object.values(subGroups).length;
      // Aggregate additional columns for subgroups
      const average_standard_rate = Object.values(subGroups).reduce((sum, group) => sum + (group.average_standard_rate || 0), 0) / Object.values(subGroups).length;
      const average_web_rate = Object.values(subGroups).reduce((sum, group) => sum + (group.average_web_rate || 0), 0) / Object.values(subGroups).length;
      const blended_move_in_projection = Object.values(subGroups).reduce((sum, group) => sum + group.blended_move_in_projection, 0);
      const blended_move_out_projection = Object.values(subGroups).reduce((sum, group) => sum + group.blended_move_out_projection, 0);
      const competitor_count = Object.values(subGroups).reduce((sum, group) => sum + group.competitor_count, 0);
      const competitor_impact = Object.values(subGroups).reduce((sum, group) => sum + (group.competitor_impact || 0), 0) / Object.values(subGroups).length;
      const current_period_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.current_period_net_rentals, 0);
      const historical_move_ins_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_facility, 0);
      const historical_move_ins_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_group, 0);
      const historical_move_ins_next_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_facility, 0);
      const historical_move_ins_next_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_group, 0);
      const historical_move_outs_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_last_60_days_facility, 0);
      const historical_move_outs_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_last_60_days_group, 0);
      const historical_move_outs_next_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_next_60_days_facility, 0);
      const historical_move_outs_next_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_next_60_days_group, 0);
      const historical_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.historical_net_rentals, 0);
      const move_ins_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_facility, 0);
      const move_ins_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_group, 0);
      const move_outs_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.move_outs_last_60_days_facility, 0);
      const move_outs_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.move_outs_last_60_days_group, 0);
      const projected_move_ins_facility = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_ins_facility, 0);
      const projected_move_ins_group = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_ins_group, 0);
      const projected_move_outs_facility = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_outs_facility, 0);
      const projected_move_outs_group = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_outs_group, 0);
      const projected_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.projected_net_rentals, 0);
      const long_term_customer_average = Object.values(subGroups).reduce((sum, group) => sum + (group.long_term_customer_average || 0), 0) / Object.values(subGroups).length;
      const projected_occupancy_impact = Object.values(subGroups).reduce((sum, group) => sum + group.projected_occupancy_impact, 0);
      const leasing_velocity_impact = Object.values(subGroups).reduce((sum, group) => sum + (group.leasing_velocity_impact || 0), 0) / Object.values(subGroups).length;      

      return { 
        items: [], 
        total_units, 
        occupied_units, 
        occupancy_rate, 
        recent_period_average_move_in_rent, 
        suggested_web_rate, 
        average_standard_rate, 
        average_web_rate, 
        blended_move_in_projection, 
        blended_move_out_projection, 
        competitor_count, 
        competitor_impact, 
        current_period_net_rentals, 
        historical_move_ins_last_60_days_facility, 
        historical_move_ins_last_60_days_group, 
        historical_move_ins_next_60_days_facility, 
        historical_move_ins_next_60_days_group, 
        historical_move_outs_last_60_days_facility, 
        historical_move_outs_last_60_days_group, 
        historical_move_outs_next_60_days_facility, 
        historical_move_outs_next_60_days_group, 
        historical_net_rentals, 
        move_ins_last_60_days_facility, 
        move_ins_last_60_days_group, 
        move_outs_last_60_days_facility, 
        move_outs_last_60_days_group, 
        projected_move_ins_facility, 
        projected_move_ins_group, 
        projected_move_outs_facility, 
        projected_move_outs_group, 
        projected_net_rentals, 
        long_term_customer_average,
        leasing_velocity_impact,
        projected_occupancy_impact,
        subGroups 
      };
    };

    if (data.length > 0) {
      const grouped = groupData(data, ['facility_name', 'group_type', 'most_common_area_bucket', 'most_common_description']);
      console.log('Grouped Data:', grouped);
      setGroupedData(grouped);
    }
  }, [data]);

  const toggleGroup = (groupPath: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupPath)) {
        next.delete(groupPath);
      } else {
        next.add(groupPath);
      }
      return next;
    });
  };

  const renderGroup = (group: GroupedData, groupPath: string = '', level: number = 0): React.ReactNode => {
    if (group.items.length > 0) {
      return group.items.map((item, index) => (
        <DataRow key={`${groupPath}-${index}`} even={index % 2 === 0}>
          <Td level={level}>{item.group_name}</Td>
          <Td>{item.total_units}</Td>
          <Td>{item.occupied_units}</Td>
          <Td>{(item.occupancy_rate * 100).toFixed(2)}%</Td>

          <Td>{item.historical_move_ins_last_60_days_group}</Td>
          <Td>{item.move_ins_last_60_days_group}</Td>
          <Td>{item.historical_move_ins_next_60_days_group}</Td>
          <Td>{item.projected_move_ins_group}</Td>

          <Td>{item.historical_move_ins_last_60_days_facility}</Td>
          <Td>{item.move_ins_last_60_days_facility}</Td>
          <Td>{item.historical_move_ins_next_60_days_facility}</Td>
          <Td>{item.projected_move_ins_facility}</Td>
          <Td>{item.blended_move_in_projection}</Td>

          <Td>{item.historical_move_outs_last_60_days_group}</Td>
          <Td>{item.move_outs_last_60_days_group}</Td>
          <Td>{item.historical_move_outs_next_60_days_group}</Td>
          <Td>{item.projected_move_outs_group}</Td>

          <Td>{item.historical_move_outs_last_60_days_facility}</Td>
          <Td>{item.move_outs_last_60_days_facility}</Td>
          <Td>{item.historical_move_outs_next_60_days_facility}</Td>
          <Td>{item.projected_move_outs_facility}</Td>
          <Td>{item.blended_move_out_projection}</Td>

          <Td>{item.current_period_net_rentals}</Td>
          <Td>{item.historical_net_rentals}</Td>
          <Td>{item.projected_net_rentals}</Td>

          <Td>{item.competitor_count}</Td>
          <Td>{item.competitor_impact}</Td>
          <Td>{item.leasing_velocity_impact}</Td>
          <Td>{item.projected_occupancy_impact}</Td>

          <Td>{item.average_standard_rate}</Td>
          <Td>{item.average_web_rate}</Td>
          <Td>${item.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.long_term_customer_average.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.suggested_web_rate?.toFixed(2) ?? 'N/A'}</Td>
        </DataRow>
      ));
    }

    if (group.subGroups) {
      return Object.entries(group.subGroups).map(([key, subGroup]) => {
        const newGroupPath = groupPath ? `${groupPath}-${key}` : key;
        const isExpanded = expandedGroups.has(newGroupPath);

        return (
          <React.Fragment key={newGroupPath}>
            <GroupRow
              level={level}
              isExpanded={isExpanded}
              onClick={() => toggleGroup(newGroupPath)}
            >
              <Td level={level}>
                <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
                {key}
              </Td>
              <Td>{subGroup.total_units}</Td>
              <Td>{subGroup.occupied_units}</Td>
              <Td>{(subGroup.occupancy_rate * 100).toFixed(2)}%</Td>

              <Td>{subGroup.historical_move_ins_last_60_days_group}</Td>
              <Td>{subGroup.move_ins_last_60_days_group}</Td>
              <Td>{subGroup.historical_move_ins_next_60_days_group}</Td>
              <Td>{subGroup.projected_move_ins_group}</Td>

              <Td>{subGroup.historical_move_ins_last_60_days_facility}</Td>
              <Td>{subGroup.move_ins_last_60_days_facility}</Td>
              <Td>{subGroup.historical_move_ins_next_60_days_facility}</Td>
              <Td>{subGroup.projected_move_ins_facility}</Td>
              <Td>{subGroup.blended_move_in_projection}</Td>

              <Td>{subGroup.historical_move_outs_last_60_days_group}</Td>
              <Td>{subGroup.move_outs_last_60_days_group}</Td>
              <Td>{subGroup.historical_move_outs_next_60_days_group}</Td>
              <Td>{subGroup.projected_move_outs_group}</Td>

              <Td>{subGroup.historical_move_outs_last_60_days_facility}</Td>
              <Td>{subGroup.move_outs_last_60_days_facility}</Td>
              <Td>{subGroup.historical_move_outs_next_60_days_facility}</Td>
              <Td>{subGroup.projected_move_outs_facility}</Td>
              <Td>{subGroup.blended_move_out_projection}</Td>

              <Td>{subGroup.current_period_net_rentals}</Td>
              <Td>{subGroup.historical_net_rentals}</Td>
              <Td>{subGroup.projected_net_rentals}</Td>

              <Td>{subGroup.competitor_count}</Td>
              <Td>{subGroup.competitor_impact}</Td>
              <Td>{subGroup.leasing_velocity_impact}</Td>
              <Td>{subGroup.projected_occupancy_impact}</Td>

              <Td>{subGroup.average_standard_rate}</Td>
              <Td>{subGroup.average_web_rate}</Td>
              <Td>${subGroup.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.long_term_customer_average.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.suggested_web_rate?.toFixed(2) ?? 'N/A'}</Td>
            </GroupRow>
            {isExpanded && renderGroup(subGroup, newGroupPath, level + 1)}
          </React.Fragment>
        );
      });
    }

    return null;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Group</Th>
          <Th>Total Units</Th>
          <Th>Occupied Units</Th>
          <Th>Occupancy Rate</Th>


          <Th>Historical Move-Ins Last 60 Days (Group)</Th>
          <Th>Move-Ins Last 60 Days (Group)</Th>
          <Th>Historical Move-Ins Next 60 Days (Group)</Th>
          <Th>Projected Move-Ins (Group)</Th>

          <Th>Historical Move-Ins Last 60 Days (Facility)</Th>
          <Th>Move-Ins Last 60 Days (Facility)</Th>
          <Th>Historical Move-Ins Next 60 Days (Facility)</Th>
          <Th>Projected Move-Ins (Facility)</Th>
          <Th>Blended Move-In Projection</Th>


          <Th>Historical Move-Outs Last 60 Days (Group)</Th>
          <Th>Move-Outs Last 60 Days (Group)</Th>
          <Th>Historical Move-Outs Next 60 Days (Group)</Th>
          <Th>Projected Move-Outs (Group)</Th>

          <Th>Historical Move-Outs Last 60 Days (Facility)</Th>
          <Th>Move-Outs Last 60 Days (Facility)</Th>
          <Th>Historical Move-Outs Next 60 Days (Facility)</Th>
          <Th>Projected Move-Outs (Facility)</Th>
          <Th>Blended Move-Out Projection</Th>

          <Th>Current Period Net Rentals</Th>
          <Th>Historical Net Rentals</Th>
          <Th>Projected Net Rentals</Th>

          <Th>Competitor Count</Th>
          <Th>Competitor Impact</Th>
          <Th>Leasing Velocity Impact</Th>
          <Th>Projected Occupancy Impact</Th>

          <Th>Avg Standard Rate</Th>
          <Th>Avg Web Rate</Th>
          <Th>Long Term Customer Average</Th>
          <Th>Recent Avg Move-In Rent</Th>
          <Th>Suggested Web Rate</Th>
        </tr>
      </thead>
      <tbody>
        {renderGroup(groupedData)}
      </tbody>
    </Table>
  );
};

export default GroupableTable;
