"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';

interface RateManagementItem {
  facility_name: string;
  area_bucket: string;
  most_common_description: string;
  group_name: string;
  group_type: string;
  unit_group_id: string;
  base_area: number;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  historical_move_ins_last_60_days_group: number;
  historical_move_ins_last_60_days_facility: number;
  historical_move_ins_last_60_days_company: number;
  move_ins_last_60_days_group: number;
  move_ins_last_60_days_facility: number;
  move_ins_last_60_days_company: number;
  historical_move_ins_next_60_days_group: number;
  historical_move_ins_next_60_days_facility: number;
  historical_move_ins_next_60_days_company: number;
  projected_move_ins_group: number;
  projected_move_ins_facility: number;
  facility_projected_move_ins_scaled: number;
  blended_move_in_projection: number;
  facility_current_move_out_occupied_ratio_last_60_days: number;
  facility_current_move_outs: number;
  facility_current_occupied_units: number;
  facility_average_historical_move_out_occupied_ratio_last_60_days: number;
  facility_historical_move_outs_last_60_days: number;
  facility_historical_occupied_units_last_60_days: number;
  facility_facility_current_vs_historical_move_out_occupied_ratio: number;
  group_current_move_out_occupied_ratio_last_60_days: number;
  group_current_move_outs: number;
  group_current_occupied_units: number;
  group_average_historical_move_out_occupied_ratio_next_60_days: number;
  group_historical_move_outs_next_60_days: number;
  group_historical_occupied_units_next_60_days: number;
  projected_move_out_occupied_ratio: number;
  projected_move_outs_next_60_days: number;
  historical_net_rentals: number;
  current_period_net_rentals: number;
  projected_net_rentals: number;
  competitor_count: number;
  competitor_percentage_cheaper: number;
  competitor_percentage_more_expensive: number;
  mean_competitor_price: number;
  median_competitor_price: number;
  long_term_customer_average: number | null;
  recent_period_average_move_in_rent: number | null;
  average_standard_rate: number;
  average_web_rate: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
  competitor_impact: number;
  suggested_web_rate: number | null;
  expected_web_rate: number | null;
}

interface GroupedData {
  items: RateManagementItem[];
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  historical_move_ins_last_60_days_group: number;
  historical_move_ins_last_60_days_facility: number;
  historical_move_ins_last_60_days_company: number;
  move_ins_last_60_days_group: number;
  move_ins_last_60_days_facility: number;
  move_ins_last_60_days_company: number;
  historical_move_ins_next_60_days_group: number;
  historical_move_ins_next_60_days_facility: number;
  historical_move_ins_next_60_days_company: number;
  projected_move_ins_group: number;
  projected_move_ins_facility: number;
  facility_projected_move_ins_scaled: number;
  blended_move_in_projection: number;
  facility_current_move_out_occupied_ratio_last_60_days: number;
  facility_current_move_outs: number;
  facility_current_occupied_units: number;
  facility_average_historical_move_out_occupied_ratio_last_60_days: number;
  facility_historical_move_outs_last_60_days: number;
  facility_historical_occupied_units_last_60_days: number;
  facility_facility_current_vs_historical_move_out_occupied_ratio: number;
  group_current_move_out_occupied_ratio_last_60_days: number;
  group_current_move_outs: number;
  group_current_occupied_units: number;
  group_average_historical_move_out_occupied_ratio_next_60_days: number;
  group_historical_move_outs_next_60_days: number;
  group_historical_occupied_units_next_60_days: number;
  projected_move_out_occupied_ratio: number;
  projected_move_outs_next_60_days: number;
  historical_net_rentals: number;
  current_period_net_rentals: number;
  projected_net_rentals: number;
  competitor_count: number;
  competitor_percentage_cheaper: number;
  competitor_percentage_more_expensive: number;
  mean_competitor_price: number;
  median_competitor_price: number;
  long_term_customer_average: number | null;
  recent_period_average_move_in_rent: number | null;
  average_standard_rate: number;
  average_web_rate: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
  competitor_impact: number;
  suggested_web_rate: number | null;
  expected_web_rate: number | null;
  subGroups?: { [key: string]: GroupedData };
}

const COLUMN_WIDTH = 150; // in pixels
const FIRST_COLUMN_WIDTH = COLUMN_WIDTH * 1.5;



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
  position: relative;
  scrollbar-width: none; // For Firefox
  -ms-overflow-style: none; // For Internet Explorer and Edge
  &::-webkit-scrollbar {
    width: 0 !important; // For Chrome, Safari, and Opera
    height: 0 !important; // For horizontal scrollbar
  }
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(213, 184, 255, 0.18);
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

const Th = styled.th<{ isSticky?: boolean; isStickyLeft?: boolean; minimized?: boolean; isGroupHeader?: boolean }>`
  background-color: ${({ minimized, isGroupHeader }) => (isGroupHeader ? 'darkgrey' : minimized ? '#FAC898' : '#f2f2f2')};
  border: none;
<<<<<<< HEAD
  padding: 16px 12px; /* Updated padding: 12px -> 16px */
=======
  padding: 12px;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
  text-align: center;
  width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  min-width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  max-width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  position: relative;
  color: ${({ minimized, isGroupHeader }) => (isGroupHeader ? 'white' : minimized ? '#FAC898' : '#000000')};
  border-left: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')}; /* Add left border */
  border-right: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')}; /* Add right border */

  ${({ isSticky, minimized }) =>
    isSticky &&
    `
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: ${minimized ? '#FAC898' : '#e6e6e6'};
  `}
  ${({ isStickyLeft, minimized }) =>
    isStickyLeft &&
    `
    position: sticky;
    left: 0;
    z-index: 11;
<<<<<<< HEAD
    width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
    min-width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
    max-width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
    font-size: 18px; /* Increase font size for Group header */
=======
    width: ${FIRST_COLUMN_WIDTH}px;
    min-width: ${FIRST_COLUMN_WIDTH}px;
    max-width: ${FIRST_COLUMN_WIDTH}px;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -20px;
      bottom: 0;
      width: 20px;
      background: linear-gradient(to left, transparent, ${minimized ? '#FAC898' : '#e6e6e6'});
      pointer-events: none;
    }
  `}
<<<<<<< HEAD

  .text-content {
    opacity: ${({ minimized }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')}; /* Hide the text content when minimized */
  }

  &::after {
    content: ${({ minimized }) => (minimized ? "'+'" : "''")}; /* Display '+' character when minimized */
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 16px;
    color: ${({ minimized }) => (minimized ? '#000' : 'transparent')}; /* Show the '+' character when minimized */
=======
  
  .text-content {
    opacity: ${({ minimized }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
  }
`;

const GroupHeaderTh = styled(Th)`
  background-color: #d9d9d9;
  color: black;
<<<<<<< HEAD
  font-size: 32px; /* Increase font size for Group header */
`;

const Td = styled.td<{ level?: number; isSticky?: boolean; minimized?: boolean }>`
  border: none;
  padding: 18px 8px;
=======
`;

const HeaderCell = ({ children, minimized, onToggle }: { children: React.ReactNode; minimized: boolean; onToggle: () => void }) => (
    <Th minimized={minimized}>
      {!minimized && children}
      <HideButton onClick={onToggle}>{minimized ? '+' : '-'}</HideButton>
    </Th>
  );
  

  const Td = styled.td<{ level?: number; isSticky?: boolean; minimized?: boolean }>`
  border: none;
  padding: 12px;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};
  width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  min-width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  max-width: ${({ minimized }) => (minimized ? '20px' : `${COLUMN_WIDTH}px`)};
  text-align: center;

  ${({ isSticky }) => isSticky && `
    position: sticky;
    left: 0;
    z-index: 5;
    background-color: inherit;
<<<<<<< HEAD
    width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
    min-width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
    max-width: ${FIRST_COLUMN_WIDTH * 1.5}px; /* Double the width for Group column */
=======
    width: ${FIRST_COLUMN_WIDTH}px;
    min-width: ${FIRST_COLUMN_WIDTH}px;
    max-width: ${FIRST_COLUMN_WIDTH}px;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
    text-align: left; /* Align the group column to the left */
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

<<<<<<< HEAD
const UpdateButton = styled.button`
  margin-left: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
`;

=======
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-block;
  width: 20px;
  text-align: center;
  transition: transform 0.3s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
`;

const HideButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 4px 0 0; /* Add 2px of padding to the right */
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
`;


const GroupableTable: React.FC = () => {
  const [data, setData] = useState<RateManagementItem[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData>({
    items: [],
    total_units: 0,
    occupied_units: 0,
    occupancy_rate: 0,
    historical_move_ins_last_60_days_group: 0,
    historical_move_ins_last_60_days_facility: 0,
    historical_move_ins_last_60_days_company: 0,
    move_ins_last_60_days_group: 0,
    move_ins_last_60_days_facility: 0,
    move_ins_last_60_days_company: 0,
    historical_move_ins_next_60_days_group: 0,
    historical_move_ins_next_60_days_facility: 0,
    historical_move_ins_next_60_days_company: 0,
    projected_move_ins_group: 0,
    projected_move_ins_facility: 0,
    facility_projected_move_ins_scaled: 0,
    blended_move_in_projection: 0,
    facility_current_move_out_occupied_ratio_last_60_days: 0,
    facility_current_move_outs: 0,
    facility_current_occupied_units: 0,
    facility_average_historical_move_out_occupied_ratio_last_60_days: 0,
    facility_historical_move_outs_last_60_days: 0,
    facility_historical_occupied_units_last_60_days: 0,
    facility_facility_current_vs_historical_move_out_occupied_ratio: 0,
    group_current_move_out_occupied_ratio_last_60_days: 0,
    group_current_move_outs: 0,
    group_current_occupied_units: 0,
    group_average_historical_move_out_occupied_ratio_next_60_days: 0,
    group_historical_move_outs_next_60_days: 0,
    group_historical_occupied_units_next_60_days: 0,
    projected_move_out_occupied_ratio: 0,
    projected_move_outs_next_60_days: 0,
    historical_net_rentals: 0,
    current_period_net_rentals: 0,
    projected_net_rentals: 0,
    competitor_count: 0,
    competitor_percentage_cheaper: 0,
    competitor_percentage_more_expensive: 0,
    mean_competitor_price: 0,
    median_competitor_price: 0,
    long_term_customer_average: null,
    recent_period_average_move_in_rent: null,
    average_standard_rate: 0,
    average_web_rate: 0,
    projected_occupancy_impact: 0,
    leasing_velocity_impact: 0,
    competitor_impact: 0,
    suggested_web_rate: null,
    expected_web_rate: null,
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
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set([
    'projected_move_ins_group',
    'projected_move_ins_facility',
    'facility_projected_move_ins_scaled',
    'facility_current_move_outs',
    'facility_current_occupied_units',
    'facility_historical_move_outs_last_60_days',
    'facility_historical_occupied_units_last_60_days',
    'group_historical_move_outs_next_60_days',
    'group_historical_occupied_units_next_60_days',
    'group_current_move_outs',
    'group_current_occupied_units',
    'historical_net_rentals',
    'current_period_net_rentals',
    'competitor_percentage_more_expensive',
    'median_competitor_price',
    'historical_move_ins_next_60_days_facility',
    'historical_move_ins_next_60_days_company',
    'move_ins_last_60_days_facility',
    'move_ins_last_60_days_company',
    'historical_move_ins_last_60_days_facility',
    'historical_move_ins_last_60_days_company',
  ]));
<<<<<<< HEAD
=======
  
  
  
  

  const handleEffectiveWebRateUpdate = async (unitGroupId: string, value: number | null) => {
    // Ensure the value is rounded to 2 decimal places
    const formattedValue = value !== null ? Number(value.toFixed(2)) : null;

    // Optimistic update
    setEditingEffectiveWebRate((prev) => ({ ...prev, [unitGroupId]: formattedValue }));

    try {
      const response = await fetch('/api/update-rate-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            unit_group_id: unitGroupId,
            suggested_web_rate: formattedValue,
          },
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
      setEditingEffectiveWebRate((prev) => ({ ...prev, [unitGroupId]: null }));
      // Show error toast
      toast.error('Failed to update effective web rate');
    }
  };
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621

  useEffect(() => {
    fetch('/api/rate-management', { cache: 'no-store' })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('API Response:', responseData);
        if (responseData && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          throw new Error('Received data is not an array');
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      });
  }, []);

  useEffect(() => {
    const median = (numbers: number[]) => {
      if (numbers.length === 0) return 0;
      numbers.sort((a, b) => a - b);
      const middle = Math.floor(numbers.length / 2);
      if (numbers.length % 2 === 0) {
        return (numbers[middle - 1] + numbers[middle]) / 2;
      }
      return numbers[middle];
    };

    const groupData = (items: RateManagementItem[], levels: (keyof RateManagementItem)[]): GroupedData => {
<<<<<<< HEAD
      // Ensure items are filtered properly
      items = items.filter((item) => item.facility_name !== null);
    
=======
      // Filter out items with null facility names
      items = items.filter((item) => item.facility_name !== null);
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
      // Apply filters
      items = items.filter(
        (item) =>
          (filters.facility.size === 0 || filters.facility.has(item.facility_name)) &&
          (filters.type.size === 0 || filters.type.has(item.group_type)) &&
          (filters.area.size === 0 || filters.area.has(item.area_bucket))
      );
<<<<<<< HEAD
      
=======
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
      if (levels.length === 0) {
        const total_units = items.reduce((sum, item) => sum + item.total_units, 0);
        const occupied_units = items.reduce((sum, item) => sum + item.occupied_units, 0);
        const occupancy_rate = occupied_units / total_units;

        const historical_move_ins_last_60_days_group = items.reduce(
          (sum, item) => sum + item.historical_move_ins_last_60_days_group,
          0
        );
        const historical_move_ins_last_60_days_facility = median(
          items.map((item) => item.historical_move_ins_last_60_days_facility)
        );
        const historical_move_ins_last_60_days_company = median(
          items.map((item) => item.historical_move_ins_last_60_days_company)
        );

        const move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.move_ins_last_60_days_group, 0);
        const move_ins_last_60_days_facility = median(items.map((item) => item.move_ins_last_60_days_facility));
        const move_ins_last_60_days_company = median(items.map((item) => item.move_ins_last_60_days_company));

        const historical_move_ins_next_60_days_group = items.reduce(
          (sum, item) => sum + item.historical_move_ins_next_60_days_group,
          0
        );
        const historical_move_ins_next_60_days_facility = median(
          items.map((item) => item.historical_move_ins_next_60_days_facility)
        );
        const historical_move_ins_next_60_days_company = median(
          items.map((item) => item.historical_move_ins_next_60_days_company)
        );

        const projected_move_ins_group = items.reduce((sum, item) => sum + item.projected_move_ins_group, 0);
        const projected_move_ins_facility = median(items.map((item) => item.projected_move_ins_facility));
        const facility_projected_move_ins_scaled = items.reduce(
          (sum, item) => sum + item.facility_projected_move_ins_scaled,
          0
        );
        const blended_move_in_projection = items.reduce((sum, item) => sum + item.blended_move_in_projection, 0);

        const facility_current_move_out_occupied_ratio_last_60_days = median(
          items.map((item) => item.facility_current_move_out_occupied_ratio_last_60_days)
        );
        const facility_current_move_outs = median(items.map((item) => item.facility_current_move_outs));
        const facility_current_occupied_units = median(items.map((item) => item.facility_current_occupied_units));

        const facility_average_historical_move_out_occupied_ratio_last_60_days = median(
          items.map((item) => item.facility_average_historical_move_out_occupied_ratio_last_60_days)
        );
        const facility_historical_move_outs_last_60_days = median(
          items.map((item) => item.facility_historical_move_outs_last_60_days)
        );
        const facility_historical_occupied_units_last_60_days = median(
          items.map((item) => item.facility_historical_occupied_units_last_60_days)
        );

        const facility_facility_current_vs_historical_move_out_occupied_ratio = median(
          items.map((item) => item.facility_facility_current_vs_historical_move_out_occupied_ratio)
        );

        const group_current_move_out_occupied_ratio_last_60_days =
          items.reduce((sum, item) => sum + item.group_current_move_out_occupied_ratio_last_60_days, 0) / items.length;
        const group_current_move_outs = items.reduce((sum, item) => sum + item.group_current_move_outs, 0);
        const group_current_occupied_units = items.reduce((sum, item) => sum + item.group_current_occupied_units, 0);

        const group_average_historical_move_out_occupied_ratio_next_60_days =
          items.reduce((sum, item) => sum + item.group_average_historical_move_out_occupied_ratio_next_60_days, 0) /
          items.length;
        const group_historical_move_outs_next_60_days = items.reduce(
          (sum, item) => sum + item.group_historical_move_outs_next_60_days,
          0
        );
        const group_historical_occupied_units_next_60_days = items.reduce(
          (sum, item) => sum + item.group_historical_occupied_units_next_60_days,
          0
        );

        const projected_move_out_occupied_ratio =
          items.reduce((sum, item) => sum + item.projected_move_out_occupied_ratio, 0) / items.length;
        const projected_move_outs_next_60_days = items.reduce((sum, item) => sum + item.projected_move_outs_next_60_days, 0);

        const historical_net_rentals = items.reduce((sum, item) => sum + item.historical_net_rentals, 0);
        const current_period_net_rentals = items.reduce((sum, item) => sum + item.current_period_net_rentals, 0);
        const projected_net_rentals = items.reduce((sum, item) => sum + item.projected_net_rentals, 0);

        const competitor_count = items.reduce((sum, item) => sum + item.competitor_count, 0);
        const competitor_percentage_cheaper =
          items.reduce((sum, item) => sum + item.competitor_percentage_cheaper, 0) / items.length;
        const competitor_percentage_more_expensive =
          items.reduce((sum, item) => sum + item.competitor_percentage_more_expensive, 0) / items.length;
        const mean_competitor_price = items.reduce((sum, item) => sum + item.mean_competitor_price, 0) / items.length;
        const median_competitor_price = items.reduce((sum, item) => sum + item.median_competitor_price, 0) / items.length;

        const long_term_customer_average =
          items.reduce((sum, item) => sum + (item.long_term_customer_average || 0), 0) / items.length;
        const recent_period_average_move_in_rent =
          items.reduce((sum, item) => sum + (item.recent_period_average_move_in_rent || 0), 0) / items.length;
        const average_standard_rate = items.reduce((sum, item) => sum + item.average_standard_rate, 0) / items.length;
        const average_web_rate = items.reduce((sum, item) => sum + item.average_web_rate, 0) / items.length;

        const projected_occupancy_impact = items.reduce((sum, item) => sum + item.projected_occupancy_impact, 0);
        const leasing_velocity_impact =
          items.reduce((sum, item) => sum + (item.leasing_velocity_impact || 0), 0) / items.length;
        const competitor_impact = items.reduce((sum, item) => sum + item.competitor_impact, 0) / items.length;

        const suggested_web_rate =
          items.reduce((sum, item) => sum + (item.suggested_web_rate || 0), 0) / items.length;
        const expected_web_rate =
          items.reduce((sum, item) => sum + (item.expected_web_rate || 0), 0) / items.length;

        return {
          items,
          total_units,
          occupied_units,
          occupancy_rate,
          historical_move_ins_last_60_days_group,
          historical_move_ins_last_60_days_facility,
          historical_move_ins_last_60_days_company,
          move_ins_last_60_days_group,
          move_ins_last_60_days_facility,
          move_ins_last_60_days_company,
          historical_move_ins_next_60_days_group,
          historical_move_ins_next_60_days_facility,
          historical_move_ins_next_60_days_company,
          projected_move_ins_group,
          projected_move_ins_facility,
          facility_projected_move_ins_scaled,
          blended_move_in_projection,
          facility_current_move_out_occupied_ratio_last_60_days,
          facility_current_move_outs,
          facility_current_occupied_units,
          facility_average_historical_move_out_occupied_ratio_last_60_days,
          facility_historical_move_outs_last_60_days,
          facility_historical_occupied_units_last_60_days,
          facility_facility_current_vs_historical_move_out_occupied_ratio,
          group_current_move_out_occupied_ratio_last_60_days,
          group_current_move_outs,
          group_current_occupied_units,
          group_average_historical_move_out_occupied_ratio_next_60_days,
          group_historical_move_outs_next_60_days,
          group_historical_occupied_units_next_60_days,
          projected_move_out_occupied_ratio,
          projected_move_outs_next_60_days,
          historical_net_rentals,
          current_period_net_rentals,
          projected_net_rentals,
          competitor_count,
          competitor_percentage_cheaper,
          competitor_percentage_more_expensive,
          mean_competitor_price,
          median_competitor_price,
          long_term_customer_average,
          recent_period_average_move_in_rent,
          average_standard_rate,
          average_web_rate,
          projected_occupancy_impact,
          leasing_velocity_impact,
          competitor_impact,
          suggested_web_rate,
          expected_web_rate,
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

      const historical_move_ins_last_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.historical_move_ins_last_60_days_group,
        0
      );
      const historical_move_ins_last_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_facility, 0) /
        Object.values(subGroups).length;
      const historical_move_ins_last_60_days_company =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_company, 0) /
        Object.values(subGroups).length;

      const move_ins_last_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.move_ins_last_60_days_group,
        0
      );
      const move_ins_last_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_facility, 0) /
        Object.values(subGroups).length;
      const move_ins_last_60_days_company =
        Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_company, 0) /
        Object.values(subGroups).length;

      const historical_move_ins_next_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.historical_move_ins_next_60_days_group,
        0
      );
      const historical_move_ins_next_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_facility, 0) /
        Object.values(subGroups).length;
      const historical_move_ins_next_60_days_company =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_company, 0) /
        Object.values(subGroups).length;

      const projected_move_ins_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.projected_move_ins_group,
        0
      );
      const projected_move_ins_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_ins_facility, 0) /
        Object.values(subGroups).length;
      const facility_projected_move_ins_scaled = Object.values(subGroups).reduce(
        (sum, group) => sum + group.facility_projected_move_ins_scaled,
        0
      );
      const blended_move_in_projection = Object.values(subGroups).reduce(
        (sum, group) => sum + group.blended_move_in_projection,
        0
      );

      const facility_current_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.facility_current_move_out_occupied_ratio_last_60_days, 0) /
        Object.values(subGroups).length;
      const facility_current_move_outs = Object.values(subGroups).reduce(
        (sum, group) => sum + group.facility_current_move_outs,
        0
      );
      const facility_current_occupied_units = Object.values(subGroups).reduce(
        (sum, group) => sum + group.facility_current_occupied_units,
        0
      );

      const facility_average_historical_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce(
          (sum, group) => sum + group.facility_average_historical_move_out_occupied_ratio_last_60_days,
          0
        ) / Object.values(subGroups).length;
      const facility_historical_move_outs_last_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.facility_historical_move_outs_last_60_days,
        0
      ) / Object.values(subGroups).length;
      const facility_historical_occupied_units_last_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.facility_historical_occupied_units_last_60_days,
        0
      ) / Object.values(subGroups).length;

      const facility_facility_current_vs_historical_move_out_occupied_ratio =
        Object.values(subGroups).reduce((sum, group) => sum + group.facility_facility_current_vs_historical_move_out_occupied_ratio, 0) /
        Object.values(subGroups).length;

      const group_current_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.group_current_move_out_occupied_ratio_last_60_days, 0) /
        Object.values(subGroups).length;
      const group_current_move_outs = Object.values(subGroups).reduce((sum, group) => sum + group.group_current_move_outs, 0);
      const group_current_occupied_units = Object.values(subGroups).reduce(
        (sum, group) => sum + group.group_current_occupied_units,
        0
      );

      const group_average_historical_move_out_occupied_ratio_next_60_days =
        Object.values(subGroups).reduce(
          (sum, group) => sum + group.group_average_historical_move_out_occupied_ratio_next_60_days,
          0
        ) / Object.values(subGroups).length;
      const group_historical_move_outs_next_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.group_historical_move_outs_next_60_days,
        0
      );
      const group_historical_occupied_units_next_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.group_historical_occupied_units_next_60_days,
        0
      );

      const projected_move_out_occupied_ratio = Object.values(subGroups).reduce(
        (sum, group) => sum + group.projected_move_out_occupied_ratio,
        0
      );
      const projected_move_outs_next_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.projected_move_outs_next_60_days,
        0
      );

      const historical_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.historical_net_rentals, 0);
      const current_period_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.current_period_net_rentals, 0);
      const projected_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.projected_net_rentals, 0);

      const competitor_count = Object.values(subGroups).reduce((sum, group) => sum + group.competitor_count, 0);
      const competitor_percentage_cheaper =
        Object.values(subGroups).reduce((sum, group) => sum + group.competitor_percentage_cheaper, 0) / Object.values(subGroups).length;
      const competitor_percentage_more_expensive =
        Object.values(subGroups).reduce((sum, group) => sum + group.competitor_percentage_more_expensive, 0) /
        Object.values(subGroups).length;
      const mean_competitor_price = Object.values(subGroups).reduce((sum, group) => sum + group.mean_competitor_price, 0) /
        Object.values(subGroups).length;
      const median_competitor_price = Object.values(subGroups).reduce((sum, group) => sum + group.median_competitor_price, 0) /
        Object.values(subGroups).length;

      const long_term_customer_average =
        Object.values(subGroups).reduce((sum, group) => sum + (group.long_term_customer_average || 0), 0) / Object.values(subGroups).length;
      const recent_period_average_move_in_rent =
        Object.values(subGroups).reduce((sum, group) => sum + (group.recent_period_average_move_in_rent || 0), 0) /
        Object.values(subGroups).length;
      const average_standard_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.average_standard_rate || 0), 0) / Object.values(subGroups).length;
      const average_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.average_web_rate || 0), 0) / Object.values(subGroups).length;

      const projected_occupancy_impact = Object.values(subGroups).reduce((sum, group) => sum + group.projected_occupancy_impact, 0);
      const leasing_velocity_impact =
        Object.values(subGroups).reduce((sum, group) => sum + (group.leasing_velocity_impact || 0), 0) / Object.values(subGroups).length;
      const competitor_impact = Object.values(subGroups).reduce((sum, group) => sum + (group.competitor_impact || 0), 0) /
        Object.values(subGroups).length;

      const suggested_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.suggested_web_rate || 0), 0) / Object.values(subGroups).length;
      const expected_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.expected_web_rate || 0), 0) / Object.values(subGroups).length;

      return {
        items: [],
        total_units,
        occupied_units,
        occupancy_rate,
        historical_move_ins_last_60_days_group,
        historical_move_ins_last_60_days_facility,
        historical_move_ins_last_60_days_company,
        move_ins_last_60_days_group,
        move_ins_last_60_days_facility,
        move_ins_last_60_days_company,
        historical_move_ins_next_60_days_group,
        historical_move_ins_next_60_days_facility,
        historical_move_ins_next_60_days_company,
        projected_move_ins_group,
        projected_move_ins_facility,
        facility_projected_move_ins_scaled,
        blended_move_in_projection,
        facility_current_move_out_occupied_ratio_last_60_days,
        facility_current_move_outs,
        facility_current_occupied_units,
        facility_average_historical_move_out_occupied_ratio_last_60_days,
        facility_historical_move_outs_last_60_days,
        facility_historical_occupied_units_last_60_days,
        facility_facility_current_vs_historical_move_out_occupied_ratio,
        group_current_move_out_occupied_ratio_last_60_days,
        group_current_move_outs,
        group_current_occupied_units,
        group_average_historical_move_out_occupied_ratio_next_60_days,
        group_historical_move_outs_next_60_days,
        group_historical_occupied_units_next_60_days,
        projected_move_out_occupied_ratio,
        projected_move_outs_next_60_days,
        historical_net_rentals,
        current_period_net_rentals,
        projected_net_rentals,
        competitor_count,
        competitor_percentage_cheaper,
        competitor_percentage_more_expensive,
        mean_competitor_price,
        median_competitor_price,
        long_term_customer_average,
        recent_period_average_move_in_rent,
        average_standard_rate,
        average_web_rate,
        projected_occupancy_impact,
        leasing_velocity_impact,
        competitor_impact,
        suggested_web_rate,
        expected_web_rate,
        subGroups,
      };
    };

    if (data.length > 0) {
      const grouped = groupData(data, ['facility_name', 'group_type', 'area_bucket']);
      setGroupedData(grouped);
    }
  }, [data, filters]);

  const toggleGroup = (groupPath: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupPath)) {
        next.delete(groupPath);
      } else {
        next.add(groupPath);
      }
      return next;
    });
  };

  const toggleColumn = (column: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  };
<<<<<<< HEAD

  const handleUpdate = async (unitGroupId: string, effectiveWebRate: string | null) => {
    if (effectiveWebRate !== null) {
      const newRate = parseFloat(effectiveWebRate);
      const payload = {
        unit_group_id: unitGroupId,
        suggested_web_rate: newRate,
      };

      try {
        const response = await fetch('/api/update_rate_management', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([payload]),
        });

        if (response.ok) {
          toast.success('Effective web rate updated successfully');
        } else {
          toast.error('Failed to update effective web rate');
        }
      } catch (error) {
        toast.error('Failed to update effective web rate');
      }
    }
  };

  const [effectiveWebRates, setEffectiveWebRates] = useState<Record<string, string | null>>({});

  const handleEffectiveWebRateChange = (e: React.ChangeEvent<HTMLInputElement>, unitGroupId: string) => {
    const value = e.target.value.replace(/^\$/, '');
    setEffectiveWebRates(prevRates => ({ ...prevRates, [unitGroupId]: value }));
  };  
=======
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
  
  const renderGroup = (group: GroupedData, groupPath: string = '', level: number = 0): React.ReactNode => {
    if (group.items.length > 0) {
      return group.items.map((item, index) => {
<<<<<<< HEAD
        const effectiveWebRate = effectiveWebRates[item.unit_group_id] ?? (item.suggested_web_rate !== null ? item.suggested_web_rate.toFixed(2) : null);
=======
        const effectiveWebRate = editingEffectiveWebRate[item.unit_group_id] ?? item.suggested_web_rate ?? null;
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
  
        return (
          <DataRow key={item.unit_group_id} even={index % 2 === 0}>
            <Td level={level} isSticky minimized={hiddenColumns.has('group')}>{item.group_name}</Td>
            <Td minimized={hiddenColumns.has('total_units')}>{hiddenColumns.has('total_units') ? ' ' : item.total_units}</Td>
            <Td minimized={hiddenColumns.has('occupied_units')}>{hiddenColumns.has('occupied_units') ? ' ' : item.occupied_units}</Td>
            <Td minimized={hiddenColumns.has('occupancy_rate')}>{hiddenColumns.has('occupancy_rate') ? ' ' : (item.occupancy_rate * 100).toFixed(2) + '%'}</Td>
  
            <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_group')}>{hiddenColumns.has('historical_move_ins_last_60_days_group') ? ' ' : item.historical_move_ins_last_60_days_group.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_facility')}>{hiddenColumns.has('historical_move_ins_last_60_days_facility') ? ' ' : item.historical_move_ins_last_60_days_facility.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_company')}>{hiddenColumns.has('historical_move_ins_last_60_days_company') ? ' ' : item.historical_move_ins_last_60_days_company.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('move_ins_last_60_days_group')}>{hiddenColumns.has('move_ins_last_60_days_group') ? ' ' : item.move_ins_last_60_days_group.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('move_ins_last_60_days_facility')}>{hiddenColumns.has('move_ins_last_60_days_facility') ? ' ' : item.move_ins_last_60_days_facility.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('move_ins_last_60_days_company')}>{hiddenColumns.has('move_ins_last_60_days_company') ? ' ' : item.move_ins_last_60_days_company.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_group')}>{hiddenColumns.has('historical_move_ins_next_60_days_group') ? ' ' : item.historical_move_ins_next_60_days_group.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_facility')}>{hiddenColumns.has('historical_move_ins_next_60_days_facility') ? ' ' : item.historical_move_ins_next_60_days_facility.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_company')}>{hiddenColumns.has('historical_move_ins_next_60_days_company') ? ' ' : item.historical_move_ins_next_60_days_company.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('projected_move_ins_group')}>{hiddenColumns.has('projected_move_ins_group') ? ' ' : item.projected_move_ins_group.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('projected_move_ins_facility')}>{hiddenColumns.has('projected_move_ins_facility') ? ' ' : item.projected_move_ins_facility.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('facility_projected_move_ins_scaled')}>{hiddenColumns.has('facility_projected_move_ins_scaled') ? ' ' : item.facility_projected_move_ins_scaled.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('blended_move_in_projection')}>{hiddenColumns.has('blended_move_in_projection') ? ' ' : item.blended_move_in_projection.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days') ? ' ' : (item.facility_current_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('facility_current_move_outs')}>{hiddenColumns.has('facility_current_move_outs') ? ' ' : item.facility_current_move_outs}</Td>
            <Td minimized={hiddenColumns.has('facility_current_occupied_units')}>{hiddenColumns.has('facility_current_occupied_units') ? ' ' : item.facility_current_occupied_units}</Td>
  
            <Td minimized={hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days') ? ' ' : (item.facility_average_historical_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('facility_historical_move_outs_last_60_days')}>{hiddenColumns.has('facility_historical_move_outs_last_60_days') ? ' ' : item.facility_historical_move_outs_last_60_days.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('facility_historical_occupied_units_last_60_days')}>{hiddenColumns.has('facility_historical_occupied_units_last_60_days') ? ' ' : item.facility_historical_occupied_units_last_60_days.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio')}>{hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio') ? ' ' : item.facility_facility_current_vs_historical_move_out_occupied_ratio?.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days') ? ' ' : (item.group_current_move_out_occupied_ratio_last_60_days * 100)?.toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('group_current_move_outs')}>{hiddenColumns.has('group_current_move_outs') ? ' ' : item.group_current_move_outs}</Td>
            <Td minimized={hiddenColumns.has('group_current_occupied_units')}>{hiddenColumns.has('group_current_occupied_units') ? ' ' : item.group_current_occupied_units}</Td>
  
            <Td minimized={hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days')}>{hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days') ? ' ' : (item.group_average_historical_move_out_occupied_ratio_next_60_days * 100)?.toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('group_historical_move_outs_next_60_days')}>{hiddenColumns.has('group_historical_move_outs_next_60_days') ? ' ' : item.group_historical_move_outs_next_60_days?.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('group_historical_occupied_units_next_60_days')}>{hiddenColumns.has('group_historical_occupied_units_next_60_days') ? ' ' : item.group_historical_occupied_units_next_60_days?.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('projected_move_out_occupied_ratio')}>{hiddenColumns.has('projected_move_out_occupied_ratio') ? ' ' : (item.projected_move_out_occupied_ratio * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('projected_move_outs_next_60_days')}>{hiddenColumns.has('projected_move_outs_next_60_days') ? ' ' : item.projected_move_outs_next_60_days.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('historical_net_rentals')}>{hiddenColumns.has('historical_net_rentals') ? ' ' : item.historical_net_rentals.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('current_period_net_rentals')}>{hiddenColumns.has('current_period_net_rentals') ? ' ' : item.current_period_net_rentals.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('projected_net_rentals')}>{hiddenColumns.has('projected_net_rentals') ? ' ' : item.projected_net_rentals.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('competitor_count')}>{hiddenColumns.has('competitor_count') ? ' ' : item.competitor_count}</Td>
            <Td minimized={hiddenColumns.has('competitor_percentage_cheaper')}>{hiddenColumns.has('competitor_percentage_cheaper') ? ' ' : (item.competitor_percentage_cheaper * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('competitor_percentage_more_expensive')}>{hiddenColumns.has('competitor_percentage_more_expensive') ? ' ' : (item.competitor_percentage_more_expensive * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('mean_competitor_price')}>{hiddenColumns.has('mean_competitor_price') ? ' ' : '$' + item.mean_competitor_price.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('median_competitor_price')}>{hiddenColumns.has('median_competitor_price') ? ' ' : '$' + item.median_competitor_price.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('long_term_customer_average')}>{hiddenColumns.has('long_term_customer_average') ? ' ' : '$' + (item.long_term_customer_average?.toFixed(2) ?? ' ')}</Td>
            <Td minimized={hiddenColumns.has('recent_period_average_move_in_rent')}>{hiddenColumns.has('recent_period_average_move_in_rent') ? ' ' : '$' + (item.recent_period_average_move_in_rent?.toFixed(2) ?? ' ')}</Td>
            <Td minimized={hiddenColumns.has('average_standard_rate')}>{hiddenColumns.has('average_standard_rate') ? ' ' : '$' + item.average_standard_rate.toFixed(2)}</Td>
            <Td minimized={hiddenColumns.has('average_web_rate')}>{hiddenColumns.has('average_web_rate') ? ' ' : '$' + item.average_web_rate?.toFixed(2)}</Td>
  
            <Td minimized={hiddenColumns.has('projected_occupancy_impact')}>{hiddenColumns.has('projected_occupancy_impact') ? ' ' : (item.projected_occupancy_impact * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('leasing_velocity_impact')}>{hiddenColumns.has('leasing_velocity_impact') ? ' ' : (item.leasing_velocity_impact * 100).toFixed(2) + '%'}</Td>
            <Td minimized={hiddenColumns.has('competitor_impact')}>{hiddenColumns.has('competitor_impact') ? ' ' : (item.competitor_impact * 100).toFixed(2) + '%'}</Td>
  
            <Td minimized={hiddenColumns.has('suggested_web_rate')}>{hiddenColumns.has('suggested_web_rate') ? ' ' : '$' + (item.suggested_web_rate?.toFixed(2) ?? ' ')}</Td>
<<<<<<< HEAD
            <Td minimized={hiddenColumns.has('effective_web_rate')}>
              {hiddenColumns.has('effective_web_rate') ? ' ' : (
                <div>
                  <EffectiveWebRateInput
                    type="text"
                    value={effectiveWebRate !== null ? `$${effectiveWebRate}` : ''}
                    onChange={(e) => handleEffectiveWebRateChange(e, item.unit_group_id)}
                  />
                  <UpdateButton onClick={() => handleUpdate(item.unit_group_id, effectiveWebRate)}>Update</UpdateButton>
                </div>
              )}
            </Td>
=======
            <Td minimized={hiddenColumns.has('effective_web_rate')}>{hiddenColumns.has('effective_web_rate') ? ' ' : '$' + (effectiveWebRate !== null ? effectiveWebRate.toFixed(2) : '')}</Td>
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
          </DataRow>
        );
      });
    }
<<<<<<< HEAD

=======
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
    if (group.subGroups) {
      return Object.entries(group.subGroups).map(([key, subGroup], index) => {
        const newGroupPath = groupPath ? `${groupPath}-${key}` : key;
        const isExpanded = expandedGroups.has(newGroupPath);
<<<<<<< HEAD

=======
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
        return (
          <React.Fragment key={newGroupPath}>
            {level === 0 && index > 0 && <SeparatorRow />}
            <GroupRow level={level} isExpanded={isExpanded} onClick={() => toggleGroup(newGroupPath)}>
              <Td level={level} isSticky minimized={hiddenColumns.has('group')}>
                <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
                {key}
              </Td>
              <Td minimized={hiddenColumns.has('total_units')}>{hiddenColumns.has('total_units') ? ' ' : subGroup.total_units}</Td>
              <Td minimized={hiddenColumns.has('occupied_units')}>{hiddenColumns.has('occupied_units') ? ' ' : subGroup.occupied_units}</Td>
              <Td minimized={hiddenColumns.has('occupancy_rate')}>{hiddenColumns.has('occupancy_rate') ? ' ' : (subGroup.occupancy_rate * 100).toFixed(2) + '%'}</Td>
<<<<<<< HEAD

              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_group')}>{hiddenColumns.has('historical_move_ins_last_60_days_group') ? ' ' : subGroup.historical_move_ins_last_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_facility')}>{hiddenColumns.has('historical_move_ins_last_60_days_facility') ? ' ' : subGroup.historical_move_ins_last_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_company')}>{hiddenColumns.has('historical_move_ins_last_60_days_company') ? ' ' : subGroup.historical_move_ins_last_60_days_company.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('move_ins_last_60_days_group')}>{hiddenColumns.has('move_ins_last_60_days_group') ? ' ' : subGroup.move_ins_last_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('move_ins_last_60_days_facility')}>{hiddenColumns.has('move_ins_last_60_days_facility') ? ' ' : subGroup.move_ins_last_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('move_ins_last_60_days_company')}>{hiddenColumns.has('move_ins_last_60_days_company') ? ' ' : subGroup.move_ins_last_60_days_company.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_group')}>{hiddenColumns.has('historical_move_ins_next_60_days_group') ? ' ' : subGroup.historical_move_ins_next_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_facility')}>{hiddenColumns.has('historical_move_ins_next_60_days_facility') ? ' ' : subGroup.historical_move_ins_next_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_company')}>{hiddenColumns.has('historical_move_ins_next_60_days_company') ? ' ' : subGroup.historical_move_ins_next_60_days_company.toFixed(2)}</Td>

=======
  
              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_group')}>{hiddenColumns.has('historical_move_ins_last_60_days_group') ? ' ' : subGroup.historical_move_ins_last_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_facility')}>{hiddenColumns.has('historical_move_ins_last_60_days_facility') ? ' ' : subGroup.historical_move_ins_last_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_last_60_days_company')}>{hiddenColumns.has('historical_move_ins_last_60_days_company') ? ' ' : subGroup.historical_move_ins_last_60_days_company.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('move_ins_last_60_days_group')}>{hiddenColumns.has('move_ins_last_60_days_group') ? ' ' : subGroup.move_ins_last_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('move_ins_last_60_days_facility')}>{hiddenColumns.has('move_ins_last_60_days_facility') ? ' ' : subGroup.move_ins_last_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('move_ins_last_60_days_company')}>{hiddenColumns.has('move_ins_last_60_days_company') ? ' ' : subGroup.move_ins_last_60_days_company.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_group')}>{hiddenColumns.has('historical_move_ins_next_60_days_group') ? ' ' : subGroup.historical_move_ins_next_60_days_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_facility')}>{hiddenColumns.has('historical_move_ins_next_60_days_facility') ? ' ' : subGroup.historical_move_ins_next_60_days_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('historical_move_ins_next_60_days_company')}>{hiddenColumns.has('historical_move_ins_next_60_days_company') ? ' ' : subGroup.historical_move_ins_next_60_days_company.toFixed(2)}</Td>
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
              <Td minimized={hiddenColumns.has('projected_move_ins_group')}>{hiddenColumns.has('projected_move_ins_group') ? ' ' : subGroup.projected_move_ins_group.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('projected_move_ins_facility')}>{hiddenColumns.has('projected_move_ins_facility') ? ' ' : subGroup.projected_move_ins_facility.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('facility_projected_move_ins_scaled')}>{hiddenColumns.has('facility_projected_move_ins_scaled') ? ' ' : subGroup.facility_projected_move_ins_scaled.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('blended_move_in_projection')}>{hiddenColumns.has('blended_move_in_projection') ? ' ' : subGroup.blended_move_in_projection.toFixed(2)}</Td>
<<<<<<< HEAD

              <Td minimized={hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.facility_current_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('facility_current_move_outs')}>{hiddenColumns.has('facility_current_move_outs') ? ' ' : subGroup.facility_current_move_outs}</Td>
              <Td minimized={hiddenColumns.has('facility_current_occupied_units')}>{hiddenColumns.has('facility_current_occupied_units') ? ' ' : subGroup.facility_current_occupied_units}</Td>

              <Td minimized={hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.facility_average_historical_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('facility_historical_move_outs_last_60_days')}>{hiddenColumns.has('facility_historical_move_outs_last_60_days') ? ' ' : subGroup.facility_historical_move_outs_last_60_days.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('facility_historical_occupied_units_last_60_days')}>{hiddenColumns.has('facility_historical_occupied_units_last_60_days') ? ' ' : subGroup.facility_historical_occupied_units_last_60_days.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio')}>{hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio') ? ' ' : subGroup.facility_facility_current_vs_historical_move_out_occupied_ratio?.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.group_current_move_out_occupied_ratio_last_60_days * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('group_current_move_outs')}>{hiddenColumns.has('group_current_move_outs') ? ' ' : subGroup.group_current_move_outs}</Td>
              <Td minimized={hiddenColumns.has('group_current_occupied_units')}>{hiddenColumns.has('group_current_occupied_units') ? ' ' : subGroup.group_current_occupied_units}</Td>

              <Td minimized={hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days')}>{hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days') ? ' ' : (subGroup.group_average_historical_move_out_occupied_ratio_next_60_days * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('group_historical_move_outs_next_60_days')}>{hiddenColumns.has('group_historical_move_outs_next_60_days') ? ' ' : subGroup.group_historical_move_outs_next_60_days?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('group_historical_occupied_units_next_60_days')}>{hiddenColumns.has('group_historical_occupied_units_next_60_days') ? ' ' : subGroup.group_historical_occupied_units_next_60_days?.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('projected_move_out_occupied_ratio')}>{hiddenColumns.has('projected_move_out_occupied_ratio') ? ' ' : (subGroup.projected_move_out_occupied_ratio * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('projected_move_outs_next_60_days')}>{hiddenColumns.has('projected_move_outs_next_60_days') ? ' ' : subGroup.projected_move_outs_next_60_days?.toFixed(2)}</Td>

              <Td minimized={hiddenColumns.has('historical_net_rentals')}>{hiddenColumns.has('historical_net_rentals') ? ' ' : subGroup.historical_net_rentals?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('current_period_net_rentals')}>{hiddenColumns.has('current_period_net_rentals') ? ' ' : subGroup.current_period_net_rentals?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('projected_net_rentals')}>{hiddenColumns.has('projected_net_rentals') ? ' ' : subGroup.projected_net_rentals?.toFixed(2)}</Td>

=======
  
              <Td minimized={hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.facility_current_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('facility_current_move_outs')}>{hiddenColumns.has('facility_current_move_outs') ? ' ' : subGroup.facility_current_move_outs}</Td>
              <Td minimized={hiddenColumns.has('facility_current_occupied_units')}>{hiddenColumns.has('facility_current_occupied_units') ? ' ' : subGroup.facility_current_occupied_units}</Td>
  
              <Td minimized={hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.facility_average_historical_move_out_occupied_ratio_last_60_days * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('facility_historical_move_outs_last_60_days')}>{hiddenColumns.has('facility_historical_move_outs_last_60_days') ? ' ' : subGroup.facility_historical_move_outs_last_60_days.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('facility_historical_occupied_units_last_60_days')}>{hiddenColumns.has('facility_historical_occupied_units_last_60_days') ? ' ' : subGroup.facility_historical_occupied_units_last_60_days.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio')}>{hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio') ? ' ' : subGroup.facility_facility_current_vs_historical_move_out_occupied_ratio?.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days')}>{hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days') ? ' ' : (subGroup.group_current_move_out_occupied_ratio_last_60_days * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('group_current_move_outs')}>{hiddenColumns.has('group_current_move_outs') ? ' ' : subGroup.group_current_move_outs}</Td>
              <Td minimized={hiddenColumns.has('group_current_occupied_units')}>{hiddenColumns.has('group_current_occupied_units') ? ' ' : subGroup.group_current_occupied_units}</Td>
  
              <Td minimized={hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days')}>{hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days') ? ' ' : (subGroup.group_average_historical_move_out_occupied_ratio_next_60_days * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('group_historical_move_outs_next_60_days')}>{hiddenColumns.has('group_historical_move_outs_next_60_days') ? ' ' : subGroup.group_historical_move_outs_next_60_days?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('group_historical_occupied_units_next_60_days')}>{hiddenColumns.has('group_historical_occupied_units_next_60_days') ? ' ' : subGroup.group_historical_occupied_units_next_60_days?.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('projected_move_out_occupied_ratio')}>{hiddenColumns.has('projected_move_out_occupied_ratio') ? ' ' : (subGroup.projected_move_out_occupied_ratio * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('projected_move_outs_next_60_days')}>{hiddenColumns.has('projected_move_outs_next_60_days') ? ' ' : subGroup.projected_move_outs_next_60_days?.toFixed(2)}</Td>
  
              <Td minimized={hiddenColumns.has('historical_net_rentals')}>{hiddenColumns.has('historical_net_rentals') ? ' ' : subGroup.historical_net_rentals?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('current_period_net_rentals')}>{hiddenColumns.has('current_period_net_rentals') ? ' ' : subGroup.current_period_net_rentals?.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('projected_net_rentals')}>{hiddenColumns.has('projected_net_rentals') ? ' ' : subGroup.projected_net_rentals?.toFixed(2)}</Td>
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
              <Td minimized={hiddenColumns.has('competitor_count')}>{hiddenColumns.has('competitor_count') ? ' ' : subGroup.competitor_count}</Td>
              <Td minimized={hiddenColumns.has('competitor_percentage_cheaper')}>{hiddenColumns.has('competitor_percentage_cheaper') ? ' ' : (subGroup.competitor_percentage_cheaper * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('competitor_percentage_more_expensive')}>{hiddenColumns.has('competitor_percentage_more_expensive') ? ' ' : (subGroup.competitor_percentage_more_expensive * 100)?.toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('mean_competitor_price')}>{hiddenColumns.has('mean_competitor_price') ? ' ' : '$' + subGroup.mean_competitor_price.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('median_competitor_price')}>{hiddenColumns.has('median_competitor_price') ? ' ' : '$' + subGroup.median_competitor_price.toFixed(2)}</Td>
<<<<<<< HEAD

=======
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
              <Td minimized={hiddenColumns.has('long_term_customer_average')}>{hiddenColumns.has('long_term_customer_average') ? ' ' : '$' + (subGroup.long_term_customer_average?.toFixed(2) ?? ' ')}</Td>
              <Td minimized={hiddenColumns.has('recent_period_average_move_in_rent')}>{hiddenColumns.has('recent_period_average_move_in_rent') ? ' ' : '$' + (subGroup.recent_period_average_move_in_rent?.toFixed(2) ?? ' ')}</Td>
              <Td minimized={hiddenColumns.has('average_standard_rate')}>{hiddenColumns.has('average_standard_rate') ? ' ' : '$' + subGroup.average_standard_rate.toFixed(2)}</Td>
              <Td minimized={hiddenColumns.has('average_web_rate')}>{hiddenColumns.has('average_web_rate') ? ' ' : '$' + subGroup.average_web_rate.toFixed(2)}</Td>
<<<<<<< HEAD

              <Td minimized={hiddenColumns.has('projected_occupancy_impact')}>{hiddenColumns.has('projected_occupancy_impact') ? ' ' : (subGroup.projected_occupancy_impact * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('leasing_velocity_impact')}>{hiddenColumns.has('leasing_velocity_impact') ? ' ' : (subGroup.leasing_velocity_impact * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('competitor_impact')}>{hiddenColumns.has('competitor_impact') ? ' ' : (subGroup.competitor_impact * 100).toFixed(2) + '%'}</Td>

=======
  
              <Td minimized={hiddenColumns.has('projected_occupancy_impact')}>{hiddenColumns.has('projected_occupancy_impact') ? ' ' : (subGroup.projected_occupancy_impact * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('leasing_velocity_impact')}>{hiddenColumns.has('leasing_velocity_impact') ? ' ' : (subGroup.leasing_velocity_impact * 100).toFixed(2) + '%'}</Td>
              <Td minimized={hiddenColumns.has('competitor_impact')}>{hiddenColumns.has('competitor_impact') ? ' ' : (subGroup.competitor_impact * 100).toFixed(2) + '%'}</Td>
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
              <Td minimized={hiddenColumns.has('suggested_web_rate')}>{hiddenColumns.has('suggested_web_rate') ? ' ' : '$' + (subGroup.suggested_web_rate?.toFixed(2) ?? ' ')}</Td>
            </GroupRow>
            {isExpanded && renderGroup(subGroup, newGroupPath, level + 1)}
          </React.Fragment>
        );
      });
    }
<<<<<<< HEAD

    return null;
  };
=======
  
    return null;
  };
    
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderFilters = () => {
    let filterValues: string[] = [];
    let filterKey: 'facility' | 'type' | 'area';

    if (activeTab === 'facility') {
      filterValues = Array.from(new Set(data.map((item) => item.facility_name).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );
      filterKey = 'facility';
    } else if (activeTab === 'type') {
      filterValues = Array.from(new Set(data.map((item) => item.group_type).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );
      filterKey = 'type';
    } else {
      filterValues = Array.from(new Set(data.map((item) => item.area_bucket))).sort((a, b) => {
        const itemA = data.find((item) => item.area_bucket === a);
        const itemB = data.find((item) => item.area_bucket === b);
        return (itemA?.base_area || 0) - (itemB?.base_area || 0);
      });
      filterKey = 'area';
    }

    return (
      <FilterContainer>
        <TabContainer>
          <Tab active={activeTab === 'facility'} onClick={() => setActiveTab('facility')}>
            Facility
          </Tab>
          <Tab active={activeTab === 'type'} onClick={() => setActiveTab('type')}>
            Type
          </Tab>
          <Tab active={activeTab === 'area'} onClick={() => setActiveTab('area')}>
            Area
          </Tab>
        </TabContainer>
        <CheckboxContainer>
          {filterValues.map((value) => (
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

<<<<<<< HEAD
  const renderHeader = () => (
    <thead>
      <tr>
        <GroupHeaderTh
          isSticky={true}
          isStickyLeft={true}
          minimized={hiddenColumns.has('group')}
          onClick={() => toggleColumn('group')}
          isGroupHeader={true}
          title="test explanation"
        >
          <span className="text-content">Group</span>
        </GroupHeaderTh>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('total_units')}
          onClick={() => toggleColumn('total_units')}
          title="The total number of units in a particular group."
        >
          <span className="text-content">Total Units</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('occupied_units')}
          onClick={() => toggleColumn('occupied_units')}
          title="The number of units currently occupied in a particular group."
        >
          <span className="text-content">Occupied Units</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('occupancy_rate')}
          onClick={() => toggleColumn('occupancy_rate')}
          title="The ratio of occupied units to total units in a particular group."
        >
          <span className="text-content">Occupancy Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_last_60_days_group')}
          onClick={() => toggleColumn('historical_move_ins_last_60_days_group')}
          title="The average number of move-ins for the group in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Last 60 Days (Group)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_last_60_days_facility')}
          onClick={() => toggleColumn('historical_move_ins_last_60_days_facility')}
          title="The average number of move-ins for the facility in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Last 60 Days (Facility)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_last_60_days_company')}
          onClick={() => toggleColumn('historical_move_ins_last_60_days_company')}
          title="The average number of move-ins for the area bucket and group type across the company in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Last 60 Days (Company)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('move_ins_last_60_days_group')}
          onClick={() => toggleColumn('move_ins_last_60_days_group')}
          title="The actual number of move-ins for the group in the last 60 days."
        >
          <span className="text-content">Move-Ins Last 60 Days (Group)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('move_ins_last_60_days_facility')}
          onClick={() => toggleColumn('move_ins_last_60_days_facility')}
          title="The actual number of move-ins for the facility in the last 60 days."
        >
          <span className="text-content">Move-Ins Last 60 Days (Facility)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('move_ins_last_60_days_company')}
          onClick={() => toggleColumn('move_ins_last_60_days_company')}
          title="The actual number of move-ins for the area bucket and group type across the company in the last 60 days."
        >
          <span className="text-content">Move-Ins Last 60 Days (Company)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_next_60_days_group')}
          onClick={() => toggleColumn('historical_move_ins_next_60_days_group')}
          title="The average number of move-ins for the group in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Next 60 Days (Group)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_next_60_days_facility')}
          onClick={() => toggleColumn('historical_move_ins_next_60_days_facility')}
          title="The average number of move-ins for the facility in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Next 60 Days (Facility)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_move_ins_next_60_days_company')}
          onClick={() => toggleColumn('historical_move_ins_next_60_days_company')}
          title="The average number of move-ins for the area bucket and group type across the company in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Historical Move-Ins Next 60 Days (Company)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_move_ins_group')}
          onClick={() => toggleColumn('projected_move_ins_group')}
          title="The projected number of move-ins for the group in the next 60 days, based on historical trends and current data."
        >
          <span className="text-content">Projected Move-Ins (Group)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_move_ins_facility')}
          onClick={() => toggleColumn('projected_move_ins_facility')}
          title="The projected number of move-ins for the facility in the next 60 days, based on historical trends and current data."
        >
          <span className="text-content">Projected Move-Ins (Facility)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_projected_move_ins_scaled')}
          onClick={() => toggleColumn('facility_projected_move_ins_scaled')}
          title="The projected number of move-ins for the facility, scaled to account for the total units in the group."
        >
          <span className="text-content">Facility Projected Move-Ins (Scaled)</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('blended_move_in_projection')}
          onClick={() => toggleColumn('blended_move_in_projection')}
          title="The average of the projected move-ins for the group and the scaled projected move-ins for the facility."
        >
          <span className="text-content">Blended Move-In Projection</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days')}
          onClick={() => toggleColumn('facility_current_move_out_occupied_ratio_last_60_days')}
          title="The ratio of move-outs to occupied units for the facility in the last 60 days."
        >
          <span className="text-content">Facility Current Move-Out Occupied Ratio Last 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_current_move_outs')}
          onClick={() => toggleColumn('facility_current_move_outs')}
          title="The actual number of move-outs for the facility in the last 60 days."
        >
          <span className="text-content">Facility Current Move-Outs</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_current_occupied_units')}
          onClick={() => toggleColumn('facility_current_occupied_units')}
          title="The number of units currently occupied in the facility."
        >
          <span className="text-content">Facility Current Occupied Units</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days')}
          onClick={() => toggleColumn('facility_average_historical_move_out_occupied_ratio_last_60_days')}
          title="The average ratio of move-outs to occupied units for the facility in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Facility Average Historical Move-Out Occupied Ratio Last 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_historical_move_outs_last_60_days')}
          onClick={() => toggleColumn('facility_historical_move_outs_last_60_days')}
          title="The average number of move-outs for the facility in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Facility Historical Move-Outs Last 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_historical_occupied_units_last_60_days')}
          onClick={() => toggleColumn('facility_historical_occupied_units_last_60_days')}
          title="The average number of occupied units in the facility in the last 60 days, calculated over the past four years."
        >
          <span className="text-content">Facility Historical Occupied Units Last 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio')}
          onClick={() => toggleColumn('facility_facility_current_vs_historical_move_out_occupied_ratio')}
          title="The ratio of the current move-out occupied ratio to the historical average for the facility."
        >
          <span className="text-content">Facility Current vs Historical Move-Out Occupied Ratio</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days')}
          onClick={() => toggleColumn('group_current_move_out_occupied_ratio_last_60_days')}
          title="The ratio of move-outs to occupied units for the group in the last 60 days."
        >
          <span className="text-content">Group Current Move-Out Occupied Ratio Last 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_current_move_outs')}
          onClick={() => toggleColumn('group_current_move_outs')}
          title="The actual number of move-outs for the group in the last 60 days."
        >
          <span className="text-content">Group Current Move-Outs</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_current_occupied_units')}
          onClick={() => toggleColumn('group_current_occupied_units')}
          title="The number of units currently occupied in the group."
        >
          <span className="text-content">Group Current Occupied Units</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days')}
          onClick={() => toggleColumn('group_average_historical_move_out_occupied_ratio_next_60_days')}
          title="The average ratio of move-outs to occupied units for the group in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Group Average Historical Move-Out Occupied Ratio Next 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_historical_move_outs_next_60_days')}
          onClick={() => toggleColumn('group_historical_move_outs_next_60_days')}
          title="The average number of move-outs for the group in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Group Historical Move-Outs Next 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('group_historical_occupied_units_next_60_days')}
          onClick={() => toggleColumn('group_historical_occupied_units_next_60_days')}
          title="The average number of occupied units in the group in the next 60 days, calculated over the past four years."
        >
          <span className="text-content">Group Historical Occupied Units Next 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_move_out_occupied_ratio')}
          onClick={() => toggleColumn('projected_move_out_occupied_ratio')}
          title="The projected ratio of move-outs to occupied units in the next 60 days."
        >
          <span className="text-content">Projected Move-Out Occupied Ratio</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_move_outs_next_60_days')}
          onClick={() => toggleColumn('projected_move_outs_next_60_days')}
          title="The projected number of move-outs in the next 60 days."
        >
          <span className="text-content">Projected Move-Outs Next 60 Days</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('historical_net_rentals')}
          onClick={() => toggleColumn('historical_net_rentals')}
          title="The difference between historical move-ins and move-outs for the group in the last 60 days."
        >
          <span className="text-content">Historical Net Rentals</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('current_period_net_rentals')}
          onClick={() => toggleColumn('current_period_net_rentals')}
          title="The difference between actual move-ins and move-outs for the group in the last 60 days."
        >
          <span className="text-content">Current Period Net Rentals</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_net_rentals')}
          onClick={() => toggleColumn('projected_net_rentals')}
          title="The projected difference between move-ins and move-outs for the group in the next 60 days."
        >
          <span className="text-content">Projected Net Rentals</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('competitor_count')}
          onClick={() => toggleColumn('competitor_count')}
          title="The number of competitors for the group. A single competitor facility could have multiple groups that match ours."
        >
          <span className="text-content">Competitor Count</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('competitor_percentage_cheaper')}
          onClick={() => toggleColumn('competitor_percentage_cheaper')}
          title="The percentage of competitors with lower prices than the current web rate for the group."
        >
          <span className="text-content">Competitor % Cheaper</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('competitor_percentage_more_expensive')}
          onClick={() => toggleColumn('competitor_percentage_more_expensive')}
          title="The percentage of competitors with higher prices than the current web rate for the group."
        >
          <span className="text-content">Competitor % More Expensive</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('mean_competitor_price')}
          onClick={() => toggleColumn('mean_competitor_price')}
          title="The average price of competitors for the group."
        >
          <span className="text-content">Mean Competitor Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('median_competitor_price')}
          onClick={() => toggleColumn('median_competitor_price')}
          title="The median price of competitors for the group."
        >
          <span className="text-content">Median Competitor Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('long_term_customer_average')}
          onClick={() => toggleColumn('long_term_customer_average')}
          title="The average rate paid by customers who have been in the units for more than a year."
        >
          <span className="text-content">Long Term Customer Average</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('recent_period_average_move_in_rent')}
          onClick={() => toggleColumn('recent_period_average_move_in_rent')}
          title="The average rent for recent move-ins in the last 60 days."
        >
          <span className="text-content">Recent Period Average Move-In Rent</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('average_standard_rate')}
          onClick={() => toggleColumn('average_standard_rate')}
          title="The current standard rate for the group."
        >
          <span className="text-content">Current Standard Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('average_web_rate')}
          onClick={() => toggleColumn('average_web_rate')}
          title="The current web rate for the group."
        >
          <span className="text-content">Current Web Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('projected_occupancy_impact')}
          onClick={() => toggleColumn('projected_occupancy_impact')}
          title="The projected occupancy impact measures the difference between a target occupancy rate and the company's projected occupancy, adjusted for unit group performance. The company group projected occupancy is calculated using (company_group_projected_move_ins - company_group_projected_move_outs + company_group_occupied_units) / company_group_total_units. The target occupancy is set at 92%, and adjusted by halving the difference between this target and the projected occupancy. The unit group's performance is calculated as (unit_group_projected_move_ins - unit_group_projected_move_outs) / unit_group_total_units. The impact is then determined: if the occupancy difference is greater than 0.1, the impact is 0.05; if less than -0.1, the impact is -0.05; otherwise, it is the occupancy difference divided by 2. This impact is scaled by multiplying it with the square root of the absolute value of the unit group versus company group performance comparison."
        >
          <span className="text-content">Projected Occupancy Impact</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('leasing_velocity_impact')}
          onClick={() => toggleColumn('leasing_velocity_impact')}
          title="The leasing velocity impact is calculated by comparing the unit group's leasing speed to the company's historical averages. The unit group’s leasing velocity is (move_ins_last_60_days / 60 * 365) / total_units, while the company-level leasing velocity step 1 is historical_average_move_ins_company / 60, and step 2 is (leasing_velocity_step_1 * 365) / total_units_irrespective. If the total units are less than 15, the impact is set to 0. If the unit group's leasing velocity exceeds the company-level step 2 velocity, the impact is (leasing_velocity - leasing_velocity_step_2) / 3; otherwise, it is (leasing_velocity - leasing_velocity_step_2) / 2, ensuring the impact reflects the relative leasing speeds."
        >
          <span className="text-content">Leasing Velocity Impact</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('competitor_impact')}
          onClick={() => toggleColumn('competitor_impact')}
          title="The competitor impact assesses how competitor pricing affects the unit group's rates. It begins by calculating the number of competitors (competitor_count) and comparing their prices to the unit group's current web rate (current_web_rate). The percentages of competitors with cheaper (competitor_percentage_cheaper) and more expensive (competitor_percentage_more_expensive) rates are determined, followed by calculating the mean and median competitor prices. The raw impact is derived based on competitor price distribution: if over 60% are more expensive, it is (competitor_percentage_more_expensive - 0.6); if under 40%, it is (competitor_percentage_more_expensive - 0.4); otherwise, it is 0. This raw impact is normalized using (math.sqrt(raw_competitor_impact + 1) - 1) * (competitor_count / 8), and clamped between 0 and 1 to yield the final competitor impact."
        >
          <span className="text-content">Competitor Impact</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('suggested_web_rate')}
          onClick={() => toggleColumn('suggested_web_rate')}
          title="The suggested web rate combines the impacts from leasing velocity, projected occupancy, and competitor pricing to adjust the unit group's base rate. The base rate is derived from the most relevant available metric: recent period average move-in rent, long-term customer average, or average web rate. The suggested web rate formula is base_rate * (1 + leasing_velocity_impact) * (1 + projected_occupancy_impact) * (1 + competitor_impact), which multiplies the base rate by factors reflecting each impact. This ensures the suggested web rate dynamically adjusts to current market conditions and performance metrics, providing an optimized pricing strategy."
        >
          <span className="text-content">Suggested Web Rate</span>
        </Th>
        <Th
          isSticky={true}
          minimized={hiddenColumns.has('effective_web_rate')}
          onClick={() => toggleColumn('effective_web_rate')}
          title="test explanation"
        >
          <span className="text-content">Effective Web Rate</span>
=======
const renderHeader = () => (
  <thead>
    <tr>
      <GroupHeaderTh isSticky={true} isStickyLeft={true} minimized={hiddenColumns.has('group')} onClick={() => toggleColumn('group')} isGroupHeader={true}>
        Group
      </GroupHeaderTh>
        <Th isSticky={true} minimized={hiddenColumns.has('total_units')} onClick={() => toggleColumn('total_units')}>
          Total Units
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('occupied_units')} onClick={() => toggleColumn('occupied_units')}>
          Occupied Units
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('occupancy_rate')} onClick={() => toggleColumn('occupancy_rate')}>
          Occupancy Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_last_60_days_group')} onClick={() => toggleColumn('historical_move_ins_last_60_days_group')}>
          Historical Move-Ins Last 60 Days (Group)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_last_60_days_facility')} onClick={() => toggleColumn('historical_move_ins_last_60_days_facility')}>
          Historical Move-Ins Last 60 Days (Facility)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_last_60_days_company')} onClick={() => toggleColumn('historical_move_ins_last_60_days_company')}>
          Historical Move-Ins Last 60 Days (Company)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('move_ins_last_60_days_group')} onClick={() => toggleColumn('move_ins_last_60_days_group')}>
          Move-Ins Last 60 Days (Group)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('move_ins_last_60_days_facility')} onClick={() => toggleColumn('move_ins_last_60_days_facility')}>
          Move-Ins Last 60 Days (Facility)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('move_ins_last_60_days_company')} onClick={() => toggleColumn('move_ins_last_60_days_company')}>
          Move-Ins Last 60 Days (Company)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_next_60_days_group')} onClick={() => toggleColumn('historical_move_ins_next_60_days_group')}>
          Historical Move-Ins Next 60 Days (Group)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_next_60_days_facility')} onClick={() => toggleColumn('historical_move_ins_next_60_days_facility')}>
          Historical Move-Ins Next 60 Days (Facility)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_move_ins_next_60_days_company')} onClick={() => toggleColumn('historical_move_ins_next_60_days_company')}>
          Historical Move-Ins Next 60 Days (Company)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_move_ins_group')} onClick={() => toggleColumn('projected_move_ins_group')}>
          Projected Move-Ins (Group)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_move_ins_facility')} onClick={() => toggleColumn('projected_move_ins_facility')}>
          Projected Move-Ins (Facility)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_projected_move_ins_scaled')} onClick={() => toggleColumn('facility_projected_move_ins_scaled')}>
          Facility Projected Move-Ins (Scaled)
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('blended_move_in_projection')} onClick={() => toggleColumn('blended_move_in_projection')}>
          Blended Move-In Projection
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_current_move_out_occupied_ratio_last_60_days')} onClick={() => toggleColumn('facility_current_move_out_occupied_ratio_last_60_days')}>
          Facility Current Move-Out Occupied Ratio Last 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_current_move_outs')} onClick={() => toggleColumn('facility_current_move_outs')}>
          Facility Current Move-Outs
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_current_occupied_units')} onClick={() => toggleColumn('facility_current_occupied_units')}>
          Facility Current Occupied Units
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_average_historical_move_out_occupied_ratio_last_60_days')} onClick={() => toggleColumn('facility_average_historical_move_out_occupied_ratio_last_60_days')}>
          Facility Average Historical Move-Out Occupied Ratio Last 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_historical_move_outs_last_60_days')} onClick={() => toggleColumn('facility_historical_move_outs_last_60_days')}>
          Facility Historical Move-Outs Last 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_historical_occupied_units_last_60_days')} onClick={() => toggleColumn('facility_historical_occupied_units_last_60_days')}>
          Facility Historical Occupied Units Last 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('facility_facility_current_vs_historical_move_out_occupied_ratio')} onClick={() => toggleColumn('facility_facility_current_vs_historical_move_out_occupied_ratio')}>
          Facility Current vs Historical Move-Out Occupied Ratio
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_current_move_out_occupied_ratio_last_60_days')} onClick={() => toggleColumn('group_current_move_out_occupied_ratio_last_60_days')}>
          Group Current Move-Out Occupied Ratio Last 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_current_move_outs')} onClick={() => toggleColumn('group_current_move_outs')}>
          Group Current Move-Outs
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_current_occupied_units')} onClick={() => toggleColumn('group_current_occupied_units')}>
          Group Current Occupied Units
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_average_historical_move_out_occupied_ratio_next_60_days')} onClick={() => toggleColumn('group_average_historical_move_out_occupied_ratio_next_60_days')}>
          Group Average Historical Move-Out Occupied Ratio Next 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_historical_move_outs_next_60_days')} onClick={() => toggleColumn('group_historical_move_outs_next_60_days')}>
          Group Historical Move-Outs Next 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('group_historical_occupied_units_next_60_days')} onClick={() => toggleColumn('group_historical_occupied_units_next_60_days')}>
          Group Historical Occupied Units Next 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_move_out_occupied_ratio')} onClick={() => toggleColumn('projected_move_out_occupied_ratio')}>
          Projected Move-Out Occupied Ratio
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_move_outs_next_60_days')} onClick={() => toggleColumn('projected_move_outs_next_60_days')}>
          Projected Move-Outs Next 60 Days
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('historical_net_rentals')} onClick={() => toggleColumn('historical_net_rentals')}>
          Historical Net Rentals
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('current_period_net_rentals')} onClick={() => toggleColumn('current_period_net_rentals')}>
          Current Period Net Rentals
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_net_rentals')} onClick={() => toggleColumn('projected_net_rentals')}>
          Projected Net Rentals
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('competitor_count')} onClick={() => toggleColumn('competitor_count')}>
          Competitor Count
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('competitor_percentage_cheaper')} onClick={() => toggleColumn('competitor_percentage_cheaper')}>
          Competitor % Cheaper
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('competitor_percentage_more_expensive')} onClick={() => toggleColumn('competitor_percentage_more_expensive')}>
          Competitor % More Expensive
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('mean_competitor_price')} onClick={() => toggleColumn('mean_competitor_price')}>
          Mean Competitor Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('median_competitor_price')} onClick={() => toggleColumn('median_competitor_price')}>
          Median Competitor Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('long_term_customer_average')} onClick={() => toggleColumn('long_term_customer_average')}>
          Long Term Customer Average
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('recent_period_average_move_in_rent')} onClick={() => toggleColumn('recent_period_average_move_in_rent')}>
          Recent Period Average Move-In Rent
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('average_standard_rate')} onClick={() => toggleColumn('average_standard_rate')}>
          Current Standard Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('average_web_rate')} onClick={() => toggleColumn('average_web_rate')}>
          Current Web Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('projected_occupancy_impact')} onClick={() => toggleColumn('projected_occupancy_impact')}>
          Projected Occupancy Impact
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('leasing_velocity_impact')} onClick={() => toggleColumn('leasing_velocity_impact')}>
          Leasing Velocity Impact
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('competitor_impact')} onClick={() => toggleColumn('competitor_impact')}>
          Competitor Impact
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('suggested_web_rate')} onClick={() => toggleColumn('suggested_web_rate')}>
          Suggested Web Rate
        </Th>
        <Th isSticky={true} minimized={hiddenColumns.has('effective_web_rate')} onClick={() => toggleColumn('effective_web_rate')}>
          Effective Web Rate
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621
        </Th>
      </tr>
    </thead>
  );
<<<<<<< HEAD
=======
  
  
>>>>>>> 05d0832867e788a89b59fa390c1a2b5aac578621

  return (
    <PageContainer>
      <ToastContainer />
      <TableWrapper>
        <Table>
          {renderHeader()}
          <tbody>{renderGroup(groupedData)}</tbody>
        </Table>
      </TableWrapper>
      {renderFilters()}
    </PageContainer>
  );
};

export default GroupableTable;