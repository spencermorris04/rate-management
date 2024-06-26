"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer  } from 'react-toastify';

interface RateManagementItem {
  facility_name: string;
  area_bucket: string;
  most_common_description: string;
  group_name: string;
  group_type: string;
  unit_group_id: string;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
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
  competitor_percentage_cheaper: number;
  mean_competitor_price: number;
  historical_move_ins_last_60_days_company: number;
  base_area: number;
}

interface GroupedData {
  items: RateManagementItem[];
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
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
  competitor_percentage_cheaper: number;
  mean_competitor_price: number;
  historical_move_ins_last_60_days_company: number;
  subGroups?: { [key: string]: GroupedData };
}

const COLUMN_WIDTH = 150; // in pixels
const FIRST_COLUMN_WIDTH = COLUMN_WIDTH * 1.5;

const sortAreaBuckets = (a: string, b: string) => {
    const getBaseArea = (str: string) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    return getBaseArea(a) - getBaseArea(b);
  };


const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  padding: 20px;
  overflow: hidden;
  opacity: 0.8;
`;

const TableWrapper = styled.div`
  width: 75vw;
  height: 90vh;
  overflow: auto;
  scrollbar-width: thin;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(213, 184, 255, 0.18);
  position: relative;
  opacity: 0.95;
`;

const FadeBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  pointer-events: none;
`;

const FadeRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to left, #e6e6e6, transparent);
  pointer-events: none;
`;

const FilterContainer = styled.div`
  width: 20vw;
  height: 90vh;
  background-color: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  opacity: 1;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background-color: ${({ active }) => (active ? '#007bff' : '#e0e0e0')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const EffectiveWebRateInput = styled.input`
  width: 80px;
  text-align: right;
  padding-right: 15px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  font-family: Arial, sans-serif;
  background-color: white;
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const SeparatorRow = styled.tr`
  height: 2px;
  background-color: black;
`;

const Th = styled.th<{ isSticky?: boolean; isStickyLeft?: boolean }>`
  background-color: #f2f2f2;
  border: none;
  padding: 12px;
  text-align: left;
  width: ${COLUMN_WIDTH}px;
  min-width: ${COLUMN_WIDTH}px;
  max-width: ${COLUMN_WIDTH}px;
  ${({ isSticky }) => isSticky && `
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #e6e6e6;
  `}
  ${({ isStickyLeft }) => isStickyLeft && `
    position: sticky;
    left: 0;
    z-index: 11;
    width: ${FIRST_COLUMN_WIDTH}px;
    min-width: ${FIRST_COLUMN_WIDTH}px;
    max-width: ${FIRST_COLUMN_WIDTH}px;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -20px;
      bottom: 0;
      width: 20px;
      background: linear-gradient(to left, transparent, #e6e6e6);
      pointer-events: none;
    }
  `}
`;

const Td = styled.td<{ level?: number; isSticky?: boolean }>`
  border: none;
  padding: 12px;
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};
  width: ${COLUMN_WIDTH}px;
  min-width: ${COLUMN_WIDTH}px;
  max-width: ${COLUMN_WIDTH}px;
  ${({ isSticky }) => isSticky && `
    position: sticky;
    left: 0;
    z-index: 5;
    background-color: inherit;
    width: ${FIRST_COLUMN_WIDTH}px;
    min-width: ${FIRST_COLUMN_WIDTH}px;
    max-width: ${FIRST_COLUMN_WIDTH}px;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -20px;
      bottom: 0;
      width: 20px;
      background: linear-gradient(to left, transparent, inherit);
      pointer-events: none;
    }
  `}
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

const DataRow = styled.tr<{ even: boolean }>`
  background-color: ${({ even }) => (even ? '#f9f9f9' : 'white')};
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-block;
  width: 20px;
  text-align: center;
  transition: transform 0.3s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
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
    historical_move_ins_last_60_days_company: 0,
    leasing_velocity_impact: 0,
    competitor_percentage_cheaper: 0,
    mean_competitor_price: 0,
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    facility: new Set<string>(),
    type: new Set<string>(),
    area: new Set<string>(),
  });
  const [activeTab, setActiveTab] = useState<'facility' | 'type' | 'area'>('facility');
  const [editingEffectiveWebRate, setEditingEffectiveWebRate] = useState<{ [key: string]: number | null }>({});

  const handleEffectiveWebRateUpdate = async (unitGroupId: string, value: number | null) => {
    // Ensure the value is rounded to 2 decimal places
    const formattedValue = value !== null ? Number(value.toFixed(2)) : null;
  
    // Optimistic update
    setEditingEffectiveWebRate(prev => ({ ...prev, [unitGroupId]: formattedValue }));
  
    try {
      const response = await fetch('/api/update-rate-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            unit_group_id: unitGroupId,
            suggested_web_rate: formattedValue
          }
        ]),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update effective web rate');
      }
  
      const result = await response.json();
      console.log('Update result:', result);
  
      // Show success toast
      toast.success('Effective web rate updated successfully');
    } catch (error) {
      console.error('Error updating effective web rate:', error);
      // Revert the change
      setEditingEffectiveWebRate(prev => ({ ...prev, [unitGroupId]: null }));
      // Show error toast
      toast.error('Failed to update effective web rate');
    }
  };

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
        // Filter out items with null facility names
        items = items.filter(item => item.facility_name !== null);
        // Apply filters
        items = items.filter(item => 
          (filters.facility.size === 0 || filters.facility.has(item.facility_name)) &&
          (filters.type.size === 0 || filters.type.has(item.group_type)) &&
          (filters.area.size === 0 || filters.area.has(item.area_bucket))
        );
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
        const historical_move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.historical_move_ins_last_60_days_group, 0);
        const historical_move_ins_next_60_days_group = items.reduce((sum, item) => sum + item.historical_move_ins_next_60_days_group, 0);
        const historical_move_outs_last_60_days_group = items.reduce((sum, item) => sum + item.historical_move_outs_last_60_days_group, 0);
        const historical_move_outs_next_60_days_group = items.reduce((sum, item) => sum + item.historical_move_outs_next_60_days_group, 0);
        const historical_net_rentals = items.reduce((sum, item) => sum + item.historical_net_rentals, 0);
        const move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.move_ins_last_60_days_group, 0);
        const move_outs_last_60_days_group = items.reduce((sum, item) => sum + item.move_outs_last_60_days_group, 0);
        const projected_move_ins_group = items.reduce((sum, item) => sum + item.projected_move_ins_group, 0);
        const projected_move_outs_group = items.reduce((sum, item) => sum + item.projected_move_outs_group, 0);
        const projected_net_rentals = items.reduce((sum, item) => sum + item.projected_net_rentals, 0);
        const leasing_velocity_impact = items.reduce((sum, item) => sum + (item.leasing_velocity_impact || 0), 0) / items.length;
        const projected_occupancy_impact = items.reduce((sum, item) => sum + item.projected_occupancy_impact, 0);
        const long_term_customer_average = items.reduce((sum, item) => sum + (item.long_term_customer_average || 0), 0) / items.length;        
        const competitor_percentage_cheaper = items.reduce((sum, item) => sum + item.competitor_percentage_cheaper, 0) / items.length;
        const historical_move_ins_last_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_ins_last_60_days_facility, 0) / items.length;
        const historical_move_ins_last_60_days_company = items.reduce((sum, item) => sum + item.historical_move_ins_last_60_days_company, 0) / items.length;
        const historical_move_ins_next_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_ins_next_60_days_facility, 0) / items.length;
        const historical_move_outs_last_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_outs_last_60_days_facility, 0) / items.length;
        const historical_move_outs_next_60_days_facility = items.reduce((sum, item) => sum + item.historical_move_outs_next_60_days_facility, 0) / items.length;
        const move_ins_last_60_days_facility = items.reduce((sum, item) => sum + item.move_ins_last_60_days_facility, 0) / items.length;
        const move_outs_last_60_days_facility = items.reduce((sum, item) => sum + item.move_outs_last_60_days_facility, 0) / items.length;
        const projected_move_ins_facility = items.reduce((sum, item) => sum + item.projected_move_ins_facility, 0) / items.length;
        const projected_move_outs_facility = items.reduce((sum, item) => sum + item.projected_move_outs_facility, 0) / items.length;
        const mean_competitor_price = items.reduce((sum, item) => sum + item.mean_competitor_price, 0) / items.length;

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
          historical_move_ins_last_60_days_company,
          leasing_velocity_impact,
          competitor_percentage_cheaper,
          mean_competitor_price
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
    
      let sortedKeys: string[];
      if (levels[0] === 'facility_name' || levels[0] === 'group_type') {
        sortedKeys = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
      } else if (levels[0] === 'area_bucket') {
        sortedKeys = Object.keys(grouped).sort((a, b) => {
          const itemA = grouped[a][0];
          const itemB = grouped[b][0];
          return itemA.base_area - itemB.base_area;
        });
      } else {
        sortedKeys = Object.keys(grouped);
      }
    
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
      const historical_move_ins_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_group, 0);
      const historical_move_ins_next_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_group, 0);
      const historical_move_outs_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_last_60_days_group, 0);
      const historical_move_outs_next_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_next_60_days_group, 0);
      const historical_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.historical_net_rentals, 0);
      const move_ins_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_group, 0);
      const move_outs_last_60_days_group = Object.values(subGroups).reduce((sum, group) => sum + group.move_outs_last_60_days_group, 0);
      const projected_move_ins_group = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_ins_group, 0);
      const projected_move_outs_group = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_outs_group, 0);
      const projected_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.projected_net_rentals, 0);
      const long_term_customer_average = Object.values(subGroups).reduce((sum, group) => sum + (group.long_term_customer_average || 0), 0) / Object.values(subGroups).length;
      const projected_occupancy_impact = Object.values(subGroups).reduce((sum, group) => sum + group.projected_occupancy_impact, 0);
      const leasing_velocity_impact = Object.values(subGroups).reduce((sum, group) => sum + (group.leasing_velocity_impact || 0), 0) / Object.values(subGroups).length;      
      const competitor_percentage_cheaper = Object.values(subGroups).reduce((sum, group) => sum + group.competitor_percentage_cheaper, 0) / Object.values(subGroups).length;
      const historical_move_ins_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_facility, 0) / Object.values(subGroups).length;
      const historical_move_ins_last_60_days_company = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_company, 0) / Object.values(subGroups).length;
      const historical_move_ins_next_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_facility, 0) / Object.values(subGroups).length;
      const historical_move_outs_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_last_60_days_facility, 0) / Object.values(subGroups).length;
      const historical_move_outs_next_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_outs_next_60_days_facility, 0) / Object.values(subGroups).length;
      const move_ins_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_facility, 0) / Object.values(subGroups).length;
      const move_outs_last_60_days_facility = Object.values(subGroups).reduce((sum, group) => sum + group.move_outs_last_60_days_facility, 0) / Object.values(subGroups).length;
      const projected_move_ins_facility = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_ins_facility, 0) / Object.values(subGroups).length;
      const projected_move_outs_facility = Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_outs_facility, 0) / Object.values(subGroups).length;
      const mean_competitor_price = Object.values(subGroups).reduce((sum, group) => sum + group.mean_competitor_price, 0) / Object.values(subGroups).length;

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
        historical_move_ins_last_60_days_company,
        leasing_velocity_impact,
        projected_occupancy_impact,
        competitor_percentage_cheaper,
        mean_competitor_price,
        subGroups 
      };
    };

    if (data.length > 0) {
      const grouped = groupData(data, ['facility_name', 'group_type', 'area_bucket']);
      setGroupedData(grouped);
    }
  }, [data, filters]);

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
      return group.items.map((item, index) => {
        const effectiveWebRate = editingEffectiveWebRate[item.unit_group_id] ?? item.suggested_web_rate ?? null;
  
        return (
          <DataRow key={item.unit_group_id} even={index % 2 === 0}>
            <Td level={level} isSticky>{item.group_name}</Td>
          <Td>{item.total_units}</Td>
          <Td>{item.occupied_units}</Td>
          <Td>{(item.occupancy_rate * 100).toFixed(2)}%</Td>

          <Td>{item.historical_move_ins_last_60_days_group.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.move_ins_last_60_days_group}</Td>
          <Td>{item.historical_move_ins_next_60_days_group.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.projected_move_ins_group.toFixed(2) ?? 'N/A'}</Td>

          <Td>{item.historical_move_ins_last_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.move_ins_last_60_days_facility}</Td>
          <Td>{item.historical_move_ins_next_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.projected_move_ins_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.blended_move_in_projection.toFixed(2) ?? 'N/A'}</Td>

          <Td>{item.historical_move_outs_last_60_days_group.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.move_outs_last_60_days_group}</Td>
          <Td>{item.historical_move_outs_next_60_days_group.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.projected_move_outs_group.toFixed(2) ?? 'N/A'}</Td>

          <Td>{item.historical_move_outs_last_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.move_outs_last_60_days_facility}</Td>
          <Td>{item.historical_move_outs_next_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.projected_move_outs_facility.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.blended_move_out_projection.toFixed(2) ?? 'N/A'}</Td>

          <Td>{item.current_period_net_rentals}</Td>
          <Td>{item.historical_net_rentals.toFixed(2) ?? 'N/A'}</Td>
          <Td>{item.projected_net_rentals.toFixed(2) ?? 'N/A'}</Td>

          <Td>{item.competitor_count}</Td>
          <Td>{(item.competitor_percentage_cheaper * 100).toFixed(2)}%</Td>
          <Td>${(item.mean_competitor_price).toFixed(2)}</Td>
          <Td>{(item.competitor_impact * 100).toFixed(2) ?? 'N/A'}%</Td>
          <Td>{item.historical_move_ins_last_60_days_company?.toFixed(2) ?? 'N/A'}</Td>
          <Td>{(item.leasing_velocity_impact * 100).toFixed(2) ?? 'N/A'}%</Td>
          <Td>{(item.projected_occupancy_impact * 100).toFixed(2) ?? 'N/A'}%</Td>

          <Td>${item.average_standard_rate.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.average_web_rate.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.long_term_customer_average?.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
          <Td>${item.suggested_web_rate?.toFixed(2) ?? 'N/A'}</Td>
          <Td>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)' }}>$</span>
              <EffectiveWebRateInput
                type="number"
                value={effectiveWebRate !== null ? effectiveWebRate.toFixed(2) : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = parseFloat(value);
                  if (!isNaN(numericValue)) {
                    setEditingEffectiveWebRate(prev => ({ ...prev, [item.unit_group_id]: numericValue }));
                  }
                }}
                onBlur={() => handleEffectiveWebRateUpdate(item.unit_group_id, effectiveWebRate)}
                step="0.01"
                min="0"
              />
            </div>
            <button onClick={() => handleEffectiveWebRateUpdate(item.unit_group_id, effectiveWebRate)}>
              Send
            </button>
          </Td>
        </DataRow>
      );
    });
  }

  if (group.subGroups) {
    return Object.entries(group.subGroups).map(([key, subGroup], index) => {
      const newGroupPath = groupPath ? `${groupPath}-${key}` : key;
      const isExpanded = expandedGroups.has(newGroupPath);

      return (
        <React.Fragment key={newGroupPath}>
          {level === 0 && index > 0 && <SeparatorRow />}
          <GroupRow
            level={level}
            isExpanded={isExpanded}
            onClick={() => toggleGroup(newGroupPath)}
          >
            <Td level={level} isSticky>
              <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
              {key}
            </Td>
              <Td>{subGroup.total_units}</Td>
              <Td>{subGroup.occupied_units}</Td>
              <Td>{(subGroup.occupancy_rate * 100).toFixed(2)}%</Td>

              <Td>{subGroup.historical_move_ins_last_60_days_group.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.move_ins_last_60_days_group}</Td>
              <Td>{subGroup.historical_move_ins_next_60_days_group.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.projected_move_ins_group.toFixed(2) ?? 'N/A'}</Td>

              <Td>{subGroup.historical_move_ins_last_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.move_ins_last_60_days_facility}</Td>
              <Td>{subGroup.historical_move_ins_next_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.projected_move_ins_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.blended_move_in_projection.toFixed(2) ?? 'N/A'}</Td>

              <Td>{subGroup.historical_move_outs_last_60_days_group.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.move_outs_last_60_days_group}</Td>
              <Td>{subGroup.historical_move_outs_next_60_days_group.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.projected_move_outs_group.toFixed(2) ?? 'N/A'}</Td>

              <Td>{subGroup.historical_move_outs_last_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.move_outs_last_60_days_facility}</Td>
              <Td>{subGroup.historical_move_outs_next_60_days_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.projected_move_outs_facility.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.blended_move_out_projection.toFixed(2) ?? 'N/A'}</Td>

              <Td>{subGroup.current_period_net_rentals}</Td>
              <Td>{subGroup.historical_net_rentals.toFixed(2) ?? 'N/A'}</Td>
              <Td>{subGroup.projected_net_rentals.toFixed(2) ?? 'N/A'}</Td>

              <Td>{subGroup.competitor_count}</Td>
              <Td>{(subGroup.competitor_percentage_cheaper * 100).toFixed(2)}%</Td>
              <Td>${(subGroup.mean_competitor_price).toFixed(2)}</Td>
              <Td>{(subGroup.competitor_impact * 100).toFixed(2) ?? 'N/A'}%</Td>
              <Td>{subGroup.historical_move_ins_last_60_days_company?.toFixed(2) ?? 'N/A'}</Td>
              <Td>{(subGroup.leasing_velocity_impact* 100).toFixed(2) ?? 'N/A'}%</Td>
              <Td>{(subGroup.projected_occupancy_impact * 100).toFixed(2) ?? 'N/A'}%</Td>

              <Td>${subGroup.average_standard_rate.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.average_web_rate.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.long_term_customer_average.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
              <Td>${subGroup.suggested_web_rate?.toFixed(2) ?? 'N/A'}</Td>
              <Td>N/A</Td>
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

  const renderFilters = () => {
    let filterValues: string[] = [];
    let filterKey: 'facility' | 'type' | 'area';
    
    if (activeTab === 'facility') {
      filterValues = Array.from(new Set(data.map(item => item.facility_name).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b));
      filterKey = 'facility';
    } else if (activeTab === 'type') {
      filterValues = Array.from(new Set(data.map(item => item.group_type).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b));
      filterKey = 'type';
    } else {
      filterValues = Array.from(new Set(data.map(item => item.area_bucket)))
        .sort((a, b) => {
          const itemA = data.find(item => item.area_bucket === a);
          const itemB = data.find(item => item.area_bucket === b);
          return (itemA?.base_area || 0) - (itemB?.base_area || 0);
        });
      filterKey = 'area';
    }
  
    return (
      <FilterContainer>
        <TabContainer>
          <Tab active={activeTab === 'facility'} onClick={() => setActiveTab('facility')}>Facility</Tab>
          <Tab active={activeTab === 'type'} onClick={() => setActiveTab('type')}>Type</Tab>
          <Tab active={activeTab === 'area'} onClick={() => setActiveTab('area')}>Area</Tab>
        </TabContainer>
        <CheckboxContainer>
          {filterValues.map(value => (
            <CheckboxLabel key={value}>
              <input
                type="checkbox"
                checked={filters[filterKey].has(value)}
                onChange={() => {
                  const newFilters = new Set(filters[filterKey]);
                  if (newFilters.has(value)) {
                    newFilters.delete(value);
                  } else {
                    newFilters.add(value);
                  }
                  setFilters({ ...filters, [filterKey]: newFilters });
                }}
              />
              {value}
            </CheckboxLabel>
          ))}
        </CheckboxContainer>
      </FilterContainer>
    );
  };

return (
  <PageContainer>
    <ToastContainer />
    <TableWrapper>
     <Table>
     <thead>
        <tr>
          <Th isSticky isStickyLeft>Group</Th>
          <Th isSticky>Total Units</Th>
          <Th isSticky>Occupied Units</Th>
          <Th isSticky>Occupancy Rate</Th>


          <Th isSticky>Historical Move-Ins Last 60 Days (Group)</Th>
          <Th isSticky>Move-Ins Last 60 Days (Group)</Th>
          <Th isSticky>Historical Move-Ins Next 60 Days (Group)</Th>
          <Th isSticky>Projected Move-Ins (Group)</Th>

          <Th isSticky>Historical Move-Ins Last 60 Days (Facility)</Th>
          <Th isSticky>Move-Ins Last 60 Days (Facility)</Th>
          <Th isSticky>Historical Move-Ins Next 60 Days (Facility)</Th>
          <Th isSticky>Projected Move-Ins (Facility)</Th>
          <Th isSticky>Blended Move-In Projection</Th>


          <Th isSticky>Historical Move-Outs Last 60 Days (Group)</Th>
          <Th isSticky>Move-Outs Last 60 Days (Group)</Th>
          <Th isSticky>Historical Move-Outs Next 60 Days (Group)</Th>
          <Th isSticky>Projected Move-Outs (Group)</Th>

          <Th isSticky>Historical Move-Outs Last 60 Days (Facility)</Th>
          <Th isSticky>Move-Outs Last 60 Days (Facility)</Th>
          <Th isSticky>Historical Move-Outs Next 60 Days (Facility)</Th>
          <Th isSticky>Projected Move-Outs (Facility)</Th>
          <Th isSticky>Blended Move-Out Projection</Th>

          <Th isSticky>Current Period Net Rentals</Th>
          <Th isSticky>Historical Net Rentals</Th>
          <Th isSticky>Projected Net Rentals</Th>

          <Th isSticky>Competitor Count</Th>
          <Th isSticky>Competitor % Cheaper</Th>
          <Th isSticky>Mean Competitor Rate</Th>
          <Th isSticky>Competitor Impact</Th>

          <Th isSticky>Historical Move-Ins Last 60 Days (Company by Group)</Th>

          <Th isSticky>Leasing Velocity Impact</Th>
          <Th isSticky>Projected Occupancy Impact</Th>

          <Th isSticky>Current Standard Rate</Th>
          <Th isSticky>Current Web Rate</Th>
          <Th isSticky>Long Term Customer Average</Th>
          <Th isSticky>Recent Avg Move-In Rent</Th>
          <Th isSticky>Suggested Web Rate</Th>
          <Th isSticky>Effective Web Rate</Th>
        </tr>
        </thead>
        <tbody>
        {renderGroup(groupedData)}
        </tbody>
    </Table>
    </TableWrapper>
    {renderFilters()}
  </PageContainer>
);
};

export default GroupableTable;
