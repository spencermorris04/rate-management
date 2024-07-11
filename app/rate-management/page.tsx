"use client";

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';


// Define the types for the styled components
interface StyledComponentProps {
  pinnedIndex?: number;
  isSticky?: boolean;
  minimized?: boolean;
  isGroupHeader?: boolean;
  isStickyLeft?: boolean;
  isPinned?: boolean;
  level?: number;
  even?: boolean;
}

interface RateManagementItem {
  [key: string]: string | number | null | undefined; // Add this line
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
  company_current_move_out_occupied_ratio_last_60_days: number;
  company_current_move_outs: number;
  company_current_occupied_units: number;
  company_average_historical_move_out_occupied_ratio_last_60_days: number;
  company_historical_move_outs_last_60_days: number;
  company_historical_occupied_units_last_60_days: number;
  company_current_vs_historical_move_out_occupied_ratio: number;
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
  net_available_units_last_60_days: number;
  days_since_last_rental: number; // New field
  third_quartile_occupancy: number;
  unit_group_leasing_velocity: number;
  unit_group_projected_occupancy: number;
  company_group_leasing_velocity: number;
  unrentable_count: number;
  reserved_count: number;
  damaged_count: number;
  otherwise_unrentable_count: number;
  available_units: number;
  days_with_zero_availability: number;
  days_with_low_availability: number;
}

interface GroupedData {
  [key: string]: any; // Add this line
  items: RateManagementItem[];
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  historical_move_ins_last_60_days_group: number;
  historical_move_ins_last_60_days_facility: number;
  move_ins_last_60_days_group: number;
  move_ins_last_60_days_facility: number;
  historical_move_ins_next_60_days_group: number;
  historical_move_ins_next_60_days_facility: number;
  projected_move_ins_group: number;
  projected_move_ins_facility: number;
  facility_projected_move_ins_scaled: number;
  blended_move_in_projection: number;
  company_current_move_out_occupied_ratio_last_60_days: number;
  company_current_move_outs: number;
  company_current_occupied_units: number;
  company_average_historical_move_out_occupied_ratio_last_60_days: number;
  company_historical_move_outs_last_60_days: number;
  company_historical_occupied_units_last_60_days: number;
  company_current_vs_historical_move_out_occupied_ratio: number;
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
  competitor_percentage_cheaper: number;
  competitor_percentage_more_expensive: number;
  recent_period_average_move_in_rent: number | null;
  average_standard_rate: number;
  average_web_rate: number;
  projected_occupancy_impact: number;
  leasing_velocity_impact: number;
  competitor_impact: number;
  suggested_web_rate: number | null;
  expected_web_rate: number | null;
  net_available_units_last_60_days: number;
  unit_group_leasing_velocity: number;
  company_group_leasing_velocity: number;
  unit_group_projected_occupancy: number;
  third_quartile_occupancy: number;
  unrentable_count: number;
  reserved_count: number;
  damaged_count: number;
  otherwise_unrentable_count: number;
  available_units: number;
  subGroups?: { [key: string]: GroupedData };
}


interface CompetitorPricingItem {
  Area: number;
  Climate: string;
  Covered: number;
  Drive_Up: string;
  Elevator: number;
  Floor: number;
  Online_Price: number;
  Our_Facility: string;
  Outdoor_Access: number;
  Parking: string | null;
  Promotion_Price: number;
  Regular_Price: number;
  Size: string;
  Size_1: number;
  Size_2: number;
  Store_Name: string;
  Unit: string;
  group_key: string;
}

const COLUMN_WIDTH = 150; // in pixels
const FIRST_COLUMN_WIDTH = COLUMN_WIDTH * 1.48;

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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;


const TableWrapper = styled.div<StyledComponentProps>`
  width: 100vw;
  height: 90vh;
  overflow: auto;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(213, 184, 255, 0.18);
  opacity: 0.95;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }

  th {
    &.pinned {
      position: sticky;
      left: ${({ pinnedIndex }) => pinnedIndex ? pinnedIndex * COLUMN_WIDTH + FIRST_COLUMN_WIDTH : 0}px;
      z-index: 15;
      background-color: #d9d9d9;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }
  }
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

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 200px; /* Set max height for mobile view */
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 20px 20px 0 0;
    overflow-y: scroll; /* Enable scrolling for excess content */
  }
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


const Th = styled.th<StyledComponentProps>`
  background-color: ${({ minimized, isGroupHeader }) => (isGroupHeader ? 'darkgrey' : minimized ? '#FAC898' : '#f2f2f2')};
  border: none;
  padding: 16px 12px;
  text-align: center;
  width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  min-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  max-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  position: relative;
  color: ${({ minimized, isGroupHeader }) => (isGroupHeader ? 'white' : minimized ? '#FAC898' : '#000000')};
  border-left: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')};
  border-right: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')};

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
    width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    min-width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    max-width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    font-size: 18px;
  `}

  .text-content {
    opacity: ${({ minimized }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')};
  }

  &::after {
    content: ${({ minimized }) => (minimized ? "'+'" : "''")};
    position: absolute;
    left: 0;
    right: 0;
    padding: 0px 0px; 
    text-align: center;
    font-size: 14px;
    color: ${({ minimized }) => (minimized ? '#000' : 'transparent')};
  }

  @media (max-width: 768px) {
    width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
    min-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
    max-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
    font-size: 12px; /* Smaller font size for mobile view */
  }
  ${({ isPinned, pinnedIndex }) =>
    isPinned &&
    `
    position: sticky;
    left: ${pinnedIndex ? pinnedIndex * COLUMN_WIDTH + COLUMN_WIDTH : 0}px;
    z-index: 15;
    background-color: #d9d9d9;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  `}

  .pin-icon {
    position: absolute;
    top: 2px;
    right: 6px;
    font-size: 8px;
    cursor: pointer;
  }
`;

const Td = styled.td<{ level?: number; isSticky?: boolean; minimized?: boolean; isPinned?: boolean; pinnedIndex?: number; even?: boolean }>`
  border: none;
  padding: 18px 8px;
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};
  width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  min-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  max-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH}px`)};
  text-align: center;
  background-color: ${({ even }) => (even ? '#f9f9f9' : 'white')}; /* Apply even and odd background color */

  ${({ isSticky }) => isSticky && `
    position: sticky;
    left: 0;
    z-index: 5;
    width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    min-width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    max-width: ${FIRST_COLUMN_WIDTH * 1.48}px;
    text-align: left;
  `}

  ${({ isPinned, pinnedIndex }) =>
    isPinned && pinnedIndex !== undefined &&
    `
    position: sticky;
    left: ${pinnedIndex * COLUMN_WIDTH + COLUMN_WIDTH}px;
    z-index: 5;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  `}

  @media (max-width: 768px) {
    width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
    min-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
    max-width: ${({ minimized }) => (minimized ? '5px' : `${COLUMN_WIDTH / 2}px`)};
  }
`;












const GroupHeaderTh = styled(Th)`
  background-color: #d9d9d9;
  color: black;
  font-size: 32px; /* Increase font size for Group header */
`;




const GroupRow = styled.tr<{ level: number; isExpanded: boolean }>`
  background-color: ${({ level }) => {
    const colors = [
      'rgba(230, 243, 255, 0.95)', 
      'rgba(255, 230, 230, 0.95)', 
      'rgba(230, 255, 230, 0.95)', 
      'rgba(255, 245, 230, 0.95)'
    ];
    return colors[level % colors.length];
  }};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ level }) => {
      const colors = [
        'rgba(204, 235, 255, 1)', 
        'rgba(255, 204, 204, 1)', 
        'rgba(204, 255, 204, 1)', 
        'rgba(255, 230, 204, 1)'
      ];
      return colors[level % colors.length];
    }};
  }

  ${Td} {
    font-weight: bold;
    background-color: inherit; /* Ensure the background color is inherited */
  }
`;





const DataRow = styled.tr<{ even: boolean }>`
  background-color: ${({ even }) => (even ? 'rgba(249, 249, 249, 0.85)' : 'rgba(255, 255, 255, 0.85)')};
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(245, 245, 245, 0.9);
  }
`;



const UpdateButton = styled.button`
  margin-left: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
`;

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
  padding: 0 0px 0 0; /* Add 2px of padding to the right */
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
    unrentable_count: 0,
    reserved_count: 0,
    damaged_count: 0,
    otherwise_unrentable_count: 0,
    available_units: 0,
    days_with_zero_availability: 0,
    days_with_low_availability: 0,
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
    company_current_move_out_occupied_ratio_last_60_days: 0,
    company_current_move_outs: 0,
    company_current_occupied_units: 0,
    company_average_historical_move_out_occupied_ratio_last_60_days: 0,
    company_historical_move_outs_last_60_days: 0,
    company_historical_occupied_units_last_60_days: 0,
    company_current_vs_historical_move_out_occupied_ratio: 0,
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
    net_available_units_last_60_days: 0,
    days_since_last_rental: 0,
    competitor_count: 0,
    competitor_percentage_cheaper: 0,
    competitor_percentage_more_expensive: 0,
    mean_competitor_price: 0,
    median_competitor_price: 0,
    long_term_customer_average: null,
    recent_period_average_move_in_rent: null,
    average_standard_rate: 0,
    average_web_rate: 0,
    third_quartile_occupancy: 0,
    unit_group_projected_occupancy: 0,
    projected_occupancy_impact: 0,
    unit_group_leasing_velocity: 0,
    company_group_leasing_velocity: 0,
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
    'reserved_count',
    'damaged_count',
    'otherwise_unrentable_count',
    'projected_move_ins_facility',
    'company_current_move_outs',
    'company_current_occupied_units',
    'company_historical_move_outs_last_60_days',
    'company_historical_occupied_units_last_60_days',
    'group_historical_move_outs_next_60_days',
    'group_historical_occupied_units_next_60_days',
    'group_current_move_outs',
    'group_current_occupied_units',
    'historical_net_rentals',
    'current_period_net_rentals',
    'competitor_percentage_cheaper',
    'median_competitor_price',
    'historical_move_ins_next_60_days_facility',
    'historical_move_ins_next_60_days_company',
    'move_ins_last_60_days_facility',
    'move_ins_last_60_days_company',
    'historical_move_ins_last_60_days_facility',
    'historical_move_ins_last_60_days_company',
    'average_standard_rate',
    'unit_group_leasing_velocity',
    'company_group_leasing_velocity',
    'days_since_last_rental',
    'days_with_zero_availability',
    'days_with_low_availability'
  ]));

  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [competitorPricing, setCompetitorPricing] = useState<CompetitorPricingItem[]>([]);

  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);

  const togglePinColumn = (column: string) => {
    setPinnedColumns(prevPinned => {
      const newPinnedColumns = prevPinned.includes(column)
        ? prevPinned.filter(col => col !== column)
        : [...prevPinned, column];
      
      // Limit the number of pinned columns to 4
      if (newPinnedColumns.length > 4) {
        return prevPinned;
      }
  
      return newPinnedColumns;
    });
  };
  
  
  const toggleGroup = (groupPath: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(groupPath) ? next.delete(groupPath) : next.add(groupPath);
      return next;
    });
  };

  const toggleColumn = (column: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      next.has(column) ? next.delete(column) : next.add(column);
      return next;
    });
  };

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
    fetch('/api/competitor-pricing', { cache: 'no-store' })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Competitor Pricing API Response:', responseData);
        if (responseData && Array.isArray(responseData.data)) {
          setCompetitorPricing(responseData.data);
        } else {
          throw new Error('Received data is not an array');
        }
      })
      .catch((err) => {
        console.error('Error fetching competitor pricing data:', err);
        setError('Failed to fetch competitor pricing data. Please try again later.');
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
      // Ensure items are filtered properly
      items = items.filter((item) => item.facility_name !== null);
    
      // Apply filters
      items = items.filter(
        (item) =>
          (filters.facility.size === 0 || filters.facility.has(item.facility_name)) &&
          (filters.type.size === 0 || filters.type.has(item.group_type)) &&
          (filters.area.size === 0 || filters.area.has(item.area_bucket))
      );
    
      if (levels.length === 0) {
        const total_units = items.reduce((sum, item) => sum + item.total_units, 0);
        const occupied_units = items.reduce((sum, item) => sum + item.occupied_units, 0);
        const occupancy_rate = occupied_units / total_units;

        const unrentable_count = items.reduce((sum, item) => sum + item.unrentable_count, 0);
        const reserved_count = items.reduce((sum, item) => sum + item.reserved_count, 0);
        const damaged_count = items.reduce((sum, item) => sum + item.damaged_count, 0);
        const otherwise_unrentable_count = items.reduce((sum, item) => sum + item.otherwise_unrentable_count, 0);
        const available_units = items.reduce((sum, item) => sum + item.available_units, 0);
    
        const historical_move_ins_last_60_days_group = items.reduce(
          (sum, item) => sum + item.historical_move_ins_last_60_days_group,
          0
        );
        const historical_move_ins_last_60_days_facility = median(
          items.map((item) => item.historical_move_ins_last_60_days_facility)
        );
    
        const move_ins_last_60_days_group = items.reduce((sum, item) => sum + item.move_ins_last_60_days_group, 0);
        const move_ins_last_60_days_facility = median(items.map((item) => item.move_ins_last_60_days_facility));
    
        const historical_move_ins_next_60_days_group = items.reduce(
          (sum, item) => sum + item.historical_move_ins_next_60_days_group,
          0
        );
        const historical_move_ins_next_60_days_facility = median(
          items.map((item) => item.historical_move_ins_next_60_days_facility)
        );
    
        const projected_move_ins_group = items.reduce((sum, item) => sum + item.projected_move_ins_group, 0);
        const projected_move_ins_facility = median(items.map((item) => item.projected_move_ins_facility));
        const facility_projected_move_ins_scaled = items.reduce(
          (sum, item) => sum + item.facility_projected_move_ins_scaled,
          0
        );
        const blended_move_in_projection = items.reduce((sum, item) => sum + item.blended_move_in_projection, 0);
    
        const company_current_move_out_occupied_ratio_last_60_days =
          items.reduce((sum, item) => sum + item.company_current_move_outs, 0) /
          items.reduce((sum, item) => sum + item.company_current_occupied_units, 0);
        
        const company_current_move_outs = items.reduce((sum, item) => sum + item.company_current_move_outs, 0);
        const company_current_occupied_units = items.reduce((sum, item) => sum + item.company_current_occupied_units, 0);
    
        const company_average_historical_move_out_occupied_ratio_last_60_days =
          items.reduce((sum, item) => sum + item.company_historical_move_outs_last_60_days, 0) /
          items.reduce((sum, item) => sum + item.company_historical_occupied_units_last_60_days, 0);
        
        const company_historical_move_outs_last_60_days = items.reduce(
          (sum, item) => sum + item.company_historical_move_outs_last_60_days,
          0
        );
        const company_historical_occupied_units_last_60_days = items.reduce(
          (sum, item) => sum + item.company_historical_occupied_units_last_60_days,
          0
        );
    
        const company_current_vs_historical_move_out_occupied_ratio =
          items.reduce((sum, item) => sum + item.company_current_move_outs, 0) /
          items.reduce((sum, item) => sum + item.company_current_occupied_units, 0) /
          (
            items.reduce((sum, item) => sum + item.company_historical_move_outs_last_60_days, 0) /
            items.reduce((sum, item) => sum + item.company_historical_occupied_units_last_60_days, 0)
          );
    
        const group_current_move_out_occupied_ratio_last_60_days =
          items.reduce((sum, item) => sum + item.group_current_move_outs, 0) /
          items.reduce((sum, item) => sum + item.group_current_occupied_units, 0);
        
        const group_current_move_outs = items.reduce((sum, item) => sum + item.group_current_move_outs, 0);
        const group_current_occupied_units = items.reduce((sum, item) => sum + item.group_current_occupied_units, 0);
    
        const group_average_historical_move_out_occupied_ratio_next_60_days =
          items.reduce((sum, item) => sum + item.group_historical_move_outs_next_60_days, 0) /
          items.reduce((sum, item) => sum + item.group_historical_occupied_units_next_60_days, 0);
        
        const group_historical_move_outs_next_60_days = items.reduce(
          (sum, item) => sum + item.group_historical_move_outs_next_60_days,
          0
        );
        const group_historical_occupied_units_next_60_days = items.reduce(
          (sum, item) => sum + item.group_historical_occupied_units_next_60_days,
          0
        );
    
        const projected_move_out_occupied_ratio =
          items.reduce((sum, item) => sum + item.projected_move_outs_next_60_days, 0) /
          items.reduce((sum, item) => sum + item.group_current_occupied_units, 0);
        
        const projected_move_outs_next_60_days = items.reduce((sum, item) => sum + item.projected_move_outs_next_60_days, 0);
    
        const historical_net_rentals = items.reduce((sum, item) => sum + item.historical_net_rentals, 0);
        const current_period_net_rentals = items.reduce((sum, item) => sum + item.current_period_net_rentals, 0);
        const projected_net_rentals = items.reduce((sum, item) => sum + item.projected_net_rentals, 0);

        const unit_group_projected_occupancy = (
          items.reduce((sum, item) => sum + item.occupied_units, 0) + items.reduce((sum, item) => sum + item.projected_net_rentals, 0)
        ) / total_units;
    
        const net_available_units_last_60_days = (
          items.reduce((sum, item) => sum + item.net_available_units_last_60_days, 0) / items.length
        );
        const competitor_count = items.reduce((sum, item) => sum + item.competitor_count, 0);
        const competitor_percentage_cheaper =
          items.reduce((sum, item) => sum + item.competitor_percentage_cheaper, 0) / items.length;
        const competitor_percentage_more_expensive =
          items.reduce((sum, item) => sum + item.competitor_percentage_more_expensive, 0) / items.length;

        const average_standard_rate = items.reduce((sum, item) => sum + item.average_standard_rate, 0) / items.length;
        const average_web_rate = items.reduce((sum, item) => sum + item.average_web_rate, 0) / items.length;
    
        const third_quartile_occupancy = items.reduce((sum, item) => sum + item.third_quartile_occupancy, 0);

    
        const projected_occupancy_impact = items.reduce((sum, item) => sum + (item.projected_occupancy_impact || 0), 0) / items.length;
    
        const unit_group_leasing_velocity =
          items.reduce((sum, item) => sum + (item.unit_group_leasing_velocity || 0), 0) / items.length;
        const company_group_leasing_velocity =
          items.reduce((sum, item) => sum + (item.company_group_leasing_velocity || 0), 0) / items.length;
        const leasing_velocity_impact =
          items.reduce((sum, item) => sum + (item.leasing_velocity_impact || 0), 0) / items.length;
        const competitor_impact = items.reduce((sum, item) => sum + (item.competitor_impact || 0), 0) / items.length;

        const recent_period_average_move_in_rent = items.reduce((sum, item) => sum + (item.recent_period_average_move_in_rent ?? 0), 0) / items.length;

    
        const suggested_web_rate =
          items.reduce((sum, item) => sum + (item.suggested_web_rate || 0), 0) / items.length;
        const expected_web_rate =
          items.reduce((sum, item) => sum + (item.expected_web_rate || 0), 0) / items.length;
    
        return {
          items,
          total_units,
          occupied_units,
          occupancy_rate,
          unrentable_count,
          reserved_count,
          damaged_count,
          otherwise_unrentable_count,
          available_units,
          historical_move_ins_last_60_days_group,
          historical_move_ins_last_60_days_facility,
          move_ins_last_60_days_group,
          move_ins_last_60_days_facility,
          historical_move_ins_next_60_days_group,
          historical_move_ins_next_60_days_facility,
          projected_move_ins_group,
          projected_move_ins_facility,
          facility_projected_move_ins_scaled,
          blended_move_in_projection,
          company_current_move_out_occupied_ratio_last_60_days,
          company_current_move_outs,
          company_current_occupied_units,
          company_average_historical_move_out_occupied_ratio_last_60_days,
          company_historical_move_outs_last_60_days,
          company_historical_occupied_units_last_60_days,
          company_current_vs_historical_move_out_occupied_ratio,
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
          net_available_units_last_60_days,
          competitor_count,
          competitor_percentage_cheaper,
          competitor_percentage_more_expensive,
          average_standard_rate,
          average_web_rate,
          unit_group_projected_occupancy,
          third_quartile_occupancy,
          projected_occupancy_impact,
          unit_group_leasing_velocity,
          company_group_leasing_velocity,
          leasing_velocity_impact,
          competitor_impact,
          recent_period_average_move_in_rent,
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
      const unrentable_count = Object.values(subGroups).reduce((sum, group) => sum + group.unrentable_count, 0);
      const reserved_count = Object.values(subGroups).reduce((sum, group) => sum + group.reserved_count, 0);
      const damaged_count = Object.values(subGroups).reduce((sum, group) => sum + group.damaged_count, 0);
      const otherwise_unrentable_count = Object.values(subGroups).reduce((sum, group) => sum + group.otherwise_unrentable_count, 0);
      const available_units = Object.values(subGroups).reduce((sum, group) => sum + group.available_units, 0);

      const historical_move_ins_last_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.historical_move_ins_last_60_days_group,
        0
      );
      const historical_move_ins_last_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_last_60_days_facility, 0) /
        Object.values(subGroups).length;
    
      const move_ins_last_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.move_ins_last_60_days_group,
        0
      );
      const move_ins_last_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.move_ins_last_60_days_facility, 0) /
        Object.values(subGroups).length;
    
      const historical_move_ins_next_60_days_group = Object.values(subGroups).reduce(
        (sum, group) => sum + group.historical_move_ins_next_60_days_group,
        0
      );
      const historical_move_ins_next_60_days_facility =
        Object.values(subGroups).reduce((sum, group) => sum + group.historical_move_ins_next_60_days_facility, 0) /
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
    
      const company_current_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.company_current_move_outs, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.company_current_occupied_units, 0);
      
      const company_current_move_outs = Object.values(subGroups).reduce(
        (sum, group) => sum + group.company_current_move_outs,
        0
      );
      const company_current_occupied_units = Object.values(subGroups).reduce(
        (sum, group) => sum + group.company_current_occupied_units,
        0
      );
    
      const company_average_historical_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_move_outs_last_60_days, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_occupied_units_last_60_days, 0);
      
      const company_historical_move_outs_last_60_days = (
        Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_move_outs_last_60_days, 0)
      );
      const company_historical_occupied_units_last_60_days = (
        Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_occupied_units_last_60_days, 0)
      );
    
      const company_current_vs_historical_move_out_occupied_ratio =
        Object.values(subGroups).reduce((sum, group) => sum + group.company_current_move_outs, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.company_current_occupied_units, 0) /
        (
          Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_move_outs_last_60_days, 0) /
          Object.values(subGroups).reduce((sum, group) => sum + group.company_historical_occupied_units_last_60_days, 0)
        );
    
      const group_current_move_out_occupied_ratio_last_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.group_current_move_outs, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.group_current_occupied_units, 0);
      
      const group_current_move_outs = Object.values(subGroups).reduce((sum, group) => sum + group.group_current_move_outs, 0);
      const group_current_occupied_units = Object.values(subGroups).reduce(
        (sum, group) => sum + group.group_current_occupied_units,
        0
      );
    
      const group_average_historical_move_out_occupied_ratio_next_60_days =
        Object.values(subGroups).reduce((sum, group) => sum + group.group_historical_move_outs_next_60_days, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.group_historical_occupied_units_next_60_days, 0);
      
      const group_historical_move_outs_next_60_days = (
        Object.values(subGroups).reduce((sum, group) => sum + group.group_historical_move_outs_next_60_days, 0)
      );
      const group_historical_occupied_units_next_60_days = (
        Object.values(subGroups).reduce((sum, group) => sum + group.group_historical_occupied_units_next_60_days, 0)
      );
    
      const projected_move_out_occupied_ratio =
        Object.values(subGroups).reduce((sum, group) => sum + group.projected_move_outs_next_60_days, 0) /
        Object.values(subGroups).reduce((sum, group) => sum + group.group_current_occupied_units, 0);
      
      const projected_move_outs_next_60_days = Object.values(subGroups).reduce(
        (sum, group) => sum + group.projected_move_outs_next_60_days,
        0
      );
    
      const historical_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.historical_net_rentals, 0);
      const current_period_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.current_period_net_rentals, 0);
      
      
      
      const projected_net_rentals = Object.values(subGroups).reduce((sum, group) => sum + group.projected_net_rentals, 0);
    

      const unit_group_projected_occupancy = (
        occupied_units + Object.values(subGroups).reduce((sum, group) => sum + group.projected_net_rentals, 0)
      ) / total_units;



      const net_available_units_last_60_days = (
        Object.values(subGroups).reduce((sum, group) => sum + group.net_available_units_last_60_days, 0) / Object.values(subGroups).length
      );
    
      const competitor_count = Object.values(subGroups).reduce((sum, group) => sum + group.competitor_count, 0);
      const competitor_percentage_cheaper =
        Object.values(subGroups).reduce((sum, group) => sum + group.competitor_percentage_cheaper, 0) / Object.values(subGroups).length;
      const competitor_percentage_more_expensive =
        Object.values(subGroups).reduce((sum, group) => sum + group.competitor_percentage_more_expensive, 0) /
        Object.values(subGroups).length;

      const average_standard_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.average_standard_rate || 0), 0) / Object.values(subGroups).length;
      const average_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.average_web_rate || 0), 0) / Object.values(subGroups).length;
    
      const third_quartile_occupancy = Object.values(subGroups).reduce((sum, group) => sum + group.third_quartile_occupancy, 0);
    
      const projected_occupancy_impact =
        Object.values(subGroups).reduce((sum, group) => sum + (group.projected_occupancy_impact || 0), 0) / Object.values(subGroups).length;

    
      const unit_group_leasing_velocity =
        Object.values(subGroups).reduce((sum, group) => sum + (group.unit_group_leasing_velocity || 0), 0) / Object.values(subGroups).length;
      const company_group_leasing_velocity =
        Object.values(subGroups).reduce((sum, group) => sum + (group.company_group_leasing_velocity || 0), 0) / Object.values(subGroups).length;
      const leasing_velocity_impact =
        Object.values(subGroups).reduce((sum, group) => sum + (group.leasing_velocity_impact || 0), 0) / Object.values(subGroups).length;
      const competitor_impact = Object.values(subGroups).reduce((sum, group) => sum + (group.competitor_impact || 0), 0) /
        Object.values(subGroups).length;

      const recent_period_average_move_in_rent = items.reduce((sum, item) => sum + (item.recent_period_average_move_in_rent ?? 0), 0) / items.length;
    
      const suggested_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.suggested_web_rate || 0), 0) / Object.values(subGroups).length;
      const expected_web_rate =
        Object.values(subGroups).reduce((sum, group) => sum + (group.expected_web_rate || 0), 0) / Object.values(subGroups).length;
    
      return {
        items: [],
        total_units,
        occupied_units,
        occupancy_rate,
        unrentable_count,
        reserved_count,
        damaged_count,
        otherwise_unrentable_count,
        available_units,
        historical_move_ins_last_60_days_group,
        historical_move_ins_last_60_days_facility,
        move_ins_last_60_days_group,
        move_ins_last_60_days_facility,
        historical_move_ins_next_60_days_group,
        historical_move_ins_next_60_days_facility,
        projected_move_ins_group,
        projected_move_ins_facility,
        facility_projected_move_ins_scaled,
        blended_move_in_projection,
        company_current_move_out_occupied_ratio_last_60_days,
        company_current_move_outs,
        company_current_occupied_units,
        company_average_historical_move_out_occupied_ratio_last_60_days,
        company_historical_move_outs_last_60_days,
        company_historical_occupied_units_last_60_days,
        company_current_vs_historical_move_out_occupied_ratio,
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
        net_available_units_last_60_days,
        competitor_count,
        competitor_percentage_cheaper,
        competitor_percentage_more_expensive,
        recent_period_average_move_in_rent,
        average_standard_rate,
        average_web_rate,
        unit_group_projected_occupancy,
        third_quartile_occupancy,
        projected_occupancy_impact,
        unit_group_leasing_velocity,
        company_group_leasing_velocity,
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

  const renderGroup = (group: GroupedData, groupPath: string = '', level: number = 0): React.ReactNode => {
    const columns = [
      { key: 'total_units', label: 'Total Units', format: 'number_no_decimal' },
      { key: 'occupied_units', label: 'Occupied Units', format: 'number_no_decimal' },
      { key: 'occupancy_rate', label: 'Occupancy Rate', format: 'percentage' },
      { key: 'unrentable_count', label: 'Unrentable Units', format: 'number_no_decimal' },
      { key: 'reserved_count', label: 'Reserved Units', format: 'number_no_decimal' },
      { key: 'damaged_count', label: 'Damaged Units', format: 'number_no_decimal' },
      { key: 'otherwise_unrentable_count', label: 'Otherwise Unrentable Units', format: 'number_no_decimal' },
      { key: 'available_units', label: 'Available Units', format: 'number_no_decimal' },
      { key: 'days_with_zero_availability', label: 'Days with No Availability', format: 'number_no_decimal' },
      { key: 'days_with_low_availability', label: 'Days with Little Availability', format: 'number_no_decimal' },
      { key: 'historical_move_ins_last_60_days_group', label: 'Historical Move-Ins Last 60 Days (Group)', format: 'number_one_decimal' },
      { key: 'historical_move_ins_last_60_days_facility', label: 'Historical Move-Ins Last 60 Days (Facility)', format: 'number_one_decimal' },
      { key: 'historical_move_ins_last_60_days_company', label: 'Historical Move-Ins Last 60 Days (Company)', format: 'number_one_decimal' },
      { key: 'move_ins_last_60_days_group', label: 'Move-Ins Last 60 Days (Group)', format: 'number_no_decimal' },
      { key: 'move_ins_last_60_days_facility', label: 'Move-Ins Last 60 Days (Facility)', format: 'number_no_decimal' },
      { key: 'move_ins_last_60_days_company', label: 'Move-Ins Last 60 Days (Company)', format: 'number_no_decimal' },
      { key: 'historical_move_ins_next_60_days_group', label: 'Historical Move-Ins Next 60 Days (Group)', format: 'number_one_decimal' },
      { key: 'historical_move_ins_next_60_days_facility', label: 'Historical Move-Ins Next 60 Days (Facility)', format: 'number_one_decimal' },
      { key: 'historical_move_ins_next_60_days_company', label: 'Historical Move-Ins Next 60 Days (Company)', format: 'number_one_decimal' },
      { key: 'projected_move_ins_group', label: 'Projected Move-Ins (Group)', format: 'number_no_decimal' },
      { key: 'projected_move_ins_facility', label: 'Projected Move-Ins (Facility)', format: 'number_one_decimal' },
      { key: 'facility_projected_move_ins_scaled', label: 'Facility Projected Move-Ins (Scaled)', format: 'number_one_decimal' },
      { key: 'blended_move_in_projection', label: 'Blended Move-In Projection', format: 'number_one_decimal' },
      { key: 'company_current_move_out_occupied_ratio_last_60_days', label: 'Company Current Move-Out Occupied Ratio Last 60 Days', format: 'percentage' },
      { key: 'company_current_move_outs', label: 'Company Current Move-Outs', format: 'number_no_decimal' },
      { key: 'company_current_occupied_units', label: 'Company Current Occupied Units', format: 'number_no_decimal' },
      { key: 'company_average_historical_move_out_occupied_ratio_last_60_days', label: 'Company Average Historical Move-Out Occupied Ratio Last 60 Days', format: 'percentage' },
      { key: 'company_historical_move_outs_last_60_days', label: 'Company Historical Move-Outs Last 60 Days', format: 'number_one_decimal' },
      { key: 'company_historical_occupied_units_last_60_days', label: 'Company Historical Occupied Units Last 60 Days', format: 'number_one_decimal' },
      { key: 'company_current_vs_historical_move_out_occupied_ratio', label: 'Company Current vs Historical Move-Out Occupied Ratio', format: 'number_one_decimal' },
      { key: 'group_current_move_out_occupied_ratio_last_60_days', label: 'Group Current Move-Out Occupied Ratio Last 60 Days', format: 'percentage' },
      { key: 'group_current_move_outs', label: 'Group Current Move-Outs', format: 'number_no_decimal' },
      { key: 'group_current_occupied_units', label: 'Group Current Occupied Units', format: 'number_no_decimal' },
      { key: 'group_average_historical_move_out_occupied_ratio_next_60_days', label: 'Group Average Historical Move-Out Occupied Ratio Next 60 Days', format: 'percentage' },
      { key: 'group_historical_move_outs_next_60_days', label: 'Group Historical Move-Outs Next 60 Days', format: 'number_one_decimal' },
      { key: 'group_historical_occupied_units_next_60_days', label: 'Group Historical Occupied Units Next 60 Days', format: 'number_one_decimal' },
      { key: 'projected_move_out_occupied_ratio', label: 'Projected Move-Out Occupied Ratio', format: 'percentage' },
      { key: 'projected_move_outs_next_60_days', label: 'Projected Move-Outs Next 60 Days', format: 'number_no_decimal' },
      { key: 'historical_net_rentals', label: 'Historical Net Rentals', format: 'number_one_decimal' },
      { key: 'current_period_net_rentals', label: 'Current Period Net Rentals', format: 'number_no_decimal' },
      { key: 'projected_net_rentals', label: 'Projected Net Rentals', format: 'number_one_decimal' },
      { key: 'unit_group_projected_occupancy', label: 'Projected Occupancy', format: 'percentage' },
      { key: 'days_since_last_rental', label: 'Days Since Last Rental', format: 'number_no_decimal' },
      { key: 'competitor_count', label: 'Competitor Count', format: 'number_no_decimal' },
      { key: 'competitor_percentage_cheaper', label: 'Competitor % Cheaper', format: 'percentage' },
      { key: 'competitor_percentage_more_expensive', label: 'Competitor % More Expensive', format: 'percentage' },
      { key: 'mean_competitor_price', label: 'Mean Competitor Rate', format: 'currency' },
      { key: 'median_competitor_price', label: 'Median Competitor Rate', format: 'currency' },
      { key: 'long_term_customer_average', label: 'Long Term Customer Average', format: 'currency' },
      { key: 'recent_period_average_move_in_rent', label: 'Recent Period Average Move-In Rent', format: 'currency' },
      { key: 'average_standard_rate', label: 'Current Standard Rate', format: 'currency' },
      { key: 'average_web_rate', label: 'Current Web Rate', format: 'currency' },
      { key: 'projected_occupancy_impact', label: 'Projected Occupancy Impact', format: 'percentage' },
      { key: 'leasing_velocity_impact', label: 'Leasing Velocity Impact', format: 'percentage' },
      { key: 'unit_group_leasing_velocity', label: 'Leasing Velocity (Group)', format: 'percentage' },
      { key: 'company_group_leasing_velocity', label: 'Leasing Velocity (Company)', format: 'percentage' },
      { key: 'competitor_impact', label: 'Competitor Impact', format: 'percentage' },
      { key: 'suggested_web_rate', label: 'Suggested Web Rate', format: 'currency' },
      { key: 'effective_web_rate', label: 'Effective Web Rate', format: 'currency' },
    ];
  
    // Separate pinned and non-pinned columns
    const pinnedCols = columns.filter(col => pinnedColumns.includes(col.key));
    const nonPinnedCols = columns.filter(col => !pinnedColumns.includes(col.key));
    const sortedColumns = [...pinnedCols, ...nonPinnedCols];
  
    const formatValue = (value: number | string | null | undefined, format: string): string => {
      if (value === null || value === undefined) return '';
      switch (format) {
        case 'number_no_decimal':
          return parseFloat(value as string).toFixed(0);
        case 'number_one_decimal':
          return parseFloat(value as string).toFixed(1);
        case 'percentage':
          return (parseFloat(value as string) * 100).toFixed(1) + '%';
        case 'currency':
          return '$' + parseFloat(value as string).toFixed(2);
        default:
          return value as string;
      }
    };
    
  
    if (group.items.length > 0) {
      return group.items.map((item, index) => {
        const effectiveWebRate = effectiveWebRates[item.unit_group_id] ?? (item.suggested_web_rate !== null ? item.suggested_web_rate.toFixed(2) : null);
        return (
          <DataRow key={item.unit_group_id} even={index % 2 === 0}>
            <Td level={level} isSticky minimized={hiddenColumns.has('group')} isPinned={pinnedColumns.includes('group')} pinnedIndex={pinnedColumns.indexOf('group') + 1} even={index % 2 === 0}>{item.group_name}</Td>
            {sortedColumns.map((column, colIndex) => (
              <Td
                key={column.key}
                minimized={hiddenColumns.has(column.key)}
                isPinned={pinnedColumns.includes(column.key)}
                pinnedIndex={pinnedColumns.includes(column.key) ? pinnedColumns.indexOf(column.key) + 1 : undefined}
                even={index % 2 === 0}
              >
                {hiddenColumns.has(column.key) ? ' ' : formatValue(item[column.key], column.format)}
              </Td>
            ))}
            <Td minimized={hiddenColumns.has('effective_web_rate')} even={index % 2 === 0}>
              {hiddenColumns.has('effective_web_rate') ? ' ' : effectiveWebRate}
            </Td>
          </DataRow>
        );
      });
    }
  
    if (group.subGroups) {
      return Object.entries(group.subGroups).map(([key, subGroup], index) => {
        const newGroupPath = groupPath ? `${groupPath}-${key}` : key;
        const isExpanded = expandedGroups.has(newGroupPath);
        const groupKeys = Object.values(subGroup.items).map((item) => item.unit_group_id);
        return (
          <React.Fragment key={newGroupPath}>
            {level === 0 && index > 0 && <SeparatorRow />}
            <GroupRow level={level} isExpanded={isExpanded} onClick={() => toggleGroup(newGroupPath)}>
              <Td level={level} isSticky minimized={hiddenColumns.has('group')} isPinned={pinnedColumns.includes('group')} pinnedIndex={pinnedColumns.indexOf('group') + 1} even={index % 2 === 0}>
                <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
                {key}
              </Td>
              {sortedColumns.map((column, colIndex) => (
                <Td
                  key={column.key}
                  minimized={hiddenColumns.has(column.key)}
                  isPinned={pinnedColumns.includes(column.key)}
                  pinnedIndex={pinnedColumns.includes(column.key) ? pinnedColumns.indexOf(column.key) + 1 : undefined}
                  even={index % 2 === 0}
                >
                  {hiddenColumns.has(column.key) ? ' ' : formatValue(subGroup[column.key], column.format)}
                </Td>
              ))}
            </GroupRow>
            {isExpanded && renderGroup(subGroup, newGroupPath, level + 1)}
          </React.Fragment>
        );
      });
    }
  
    return null;
  };
  
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

  const renderHeader = () => {
    const columns = [
      { key: 'total_units', label: 'Total Units', tooltip: 'The total number of units in a particular group.' },
      { key: 'occupied_units', label: 'Occupied Units', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'occupancy_rate', label: 'Occupancy Rate', tooltip: 'Occupancy Rate: The ratio of occupied units to total units in a particular group. Formula: Occupancy Rate = Occupied Units / Total Units.' },
      { key: 'unrentable_count', label: 'Unrentable Units', tooltip: 'The number of units currently occupied in a particular group.'},
      { key: 'reserved_count', label: 'Reserved Units', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'damaged_count', label: 'Damaged Units', tooltip: 'The number of units currently occupied in a particular group.'},
      { key: 'otherwise_unrentable_count', label: 'Otherwise Unrentable Units', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'available_units', label: 'Available Units', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'days_with_zero_availability', label: 'Days with No Availability', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'days_with_low_availability', label: 'Days with Little Availability', tooltip: 'The number of units currently occupied in a particular group.' },
      { key: 'historical_move_ins_last_60_days_group', label: 'Historical Move-Ins Last 60 Days (Group)', tooltip: 'The average number of move-ins for the group in the last 60 days, calculated over the past four years. Formula: Historical Move-Ins Last 60 Days (Group) = Average(move-ins for last 60 days over the past four years).' },
      { key: 'historical_move_ins_last_60_days_facility', label: 'Historical Move-Ins Last 60 Days (Facility)', tooltip: 'The average number of move-ins for the facility in the last 60 days, calculated over the past four years. Formula: Historical Move-Ins Last 60 Days (Facility) = Average(move-ins for last 60 days over the past four years).' },
      { key: 'historical_move_ins_last_60_days_company', label: 'Historical Move-Ins Last 60 Days (Company)', tooltip: 'The average number of move-ins for the company in the last 60 days, calculated over the past four years. Formula: Historical Move-Ins Last 60 Days (Company) = Average(move-ins for last 60 days over the past four years).' },
      { key: 'move_ins_last_60_days_group', label: 'Move-Ins Last 60 Days (Group)', tooltip: 'The actual number of move-ins for the group in the last 60 days.' },
      { key: 'move_ins_last_60_days_facility', label: 'Move-Ins Last 60 Days (Facility)', tooltip: 'The actual number of move-ins for the facility in the last 60 days.' },
      { key: 'move_ins_last_60_days_company', label: 'Move-Ins Last 60 Days (Company)', tooltip: 'The actual number of move-ins for the company in the last 60 days.' },
      { key: 'historical_move_ins_next_60_days_group', label: 'Historical Move-Ins Next 60 Days (Group)', tooltip: 'The average number of move-ins for the group in the next 60 days, calculated over the past four years. Formula: Historical Move-Ins Next 60 Days (Group) = Average(move-ins for next 60 days over the past four years).' },
      { key: 'historical_move_ins_next_60_days_facility', label: 'Historical Move-Ins Next 60 Days (Facility)', tooltip: 'The average number of move-ins for the facility in the next 60 days, calculated over the past four years. Formula: Historical Move-Ins Next 60 Days (Facility) = Average(move-ins for next 60 days over the past four years).' },
      { key: 'historical_move_ins_next_60_days_company', label: 'Historical Move-Ins Next 60 Days (Company)', tooltip: 'The average number of move-ins for the company in the next 60 days, calculated over the past four years. Formula: Historical Move-Ins Next 60 Days (Company) = Average(move-ins for next 60 days over the past four years).' },
      { key: 'projected_move_ins_group', label: 'Projected Move-Ins (Group)', tooltip: 'The projected number of move-ins for the group in the next 60 days, based on historical trends and current data. Formula: Projected Move-Ins (Group) = Move-Ins Last 60 Days (Group) / Historical Move-Ins Last 60 Days (Group) * Historical Move-Ins Next 60 Days (Group).' },
      { key: 'projected_move_ins_facility', label: 'Projected Move-Ins (Facility)', tooltip: 'The projected number of move-ins for the facility in the next 60 days, based on historical trends and current data. Formula: Projected Move-Ins (Facility) = Move-Ins Last 60 Days (Facility) / Historical Move-Ins Last 60 Days (Facility) * Historical Move-Ins Next 60 Days (Facility).' },
      { key: 'facility_projected_move_ins_scaled', label: 'Facility Projected Move-Ins (Scaled)', tooltip: 'The projected number of move-ins for the facility, scaled to account for the total units in the group. Formula: Facility Projected Move-Ins (Scaled) = Projected Move-Ins (Facility) * (Total Units (Group) / Total Units (Facility)).' },
      { key: 'blended_move_in_projection', label: 'Blended Move-In Projection', tooltip: 'The average of the projected move-ins for the group and the scaled projected move-ins for the facility. Formula: Blended Move-In Projection = (Projected Move-Ins (Group) + Facility Projected Move-Ins (Scaled)) / 2.' },
      { key: 'company_current_move_out_occupied_ratio_last_60_days', label: 'Company Current Move-Out Occupied Ratio Last 60 Days', tooltip: 'The ratio of move-outs to occupied units for the facility in the last 60 days. Formula: Facility Current Move-Out Occupied Ratio Last 60 Days = Facility Current Move-Outs / Facility Current Occupied Units.' },
      { key: 'company_current_move_outs', label: 'Company Current Move-Outs', tooltip: 'The actual number of move-outs for the facility in the last 60 days.' },
      { key: 'company_current_occupied_units', label: 'Company Current Occupied Units', tooltip: 'The number of units currently occupied in the facility.' },
      { key: 'company_average_historical_move_out_occupied_ratio_last_60_days', label: 'Company Average Historical Move-Out Occupied Ratio Last 60 Days', tooltip: 'The average ratio of move-outs to occupied units for the facility in the last 60 days, calculated over the past four years. Formula: historical average(move-outs last 60 days / occupied units this date).' },
      { key: 'company_historical_move_outs_last_60_days', label: 'Company Historical Move-Outs Last 60 Days', tooltip: 'The average number of move-outs for the facility in the last 60 days, calculated over the past four years. Formula: Average(move-outs for the last 60 days over the past four years).' },
      { key: 'company_historical_occupied_units_last_60_days', label: 'Company Historical Occupied Units Last 60 Days', tooltip: 'The average number of occupied units in the facility for the last 60 days, calculated over the past four years. Formula: Facility Historical Occupied Units Last 60 Days = Average(occupied units for the last 60 days over the past four years).' },
      { key: 'company_current_vs_historical_move_out_occupied_ratio', label: 'Company Current vs Historical Move-Out Occupied Ratio', tooltip: 'The ratio of the current move-out occupied ratio to the historical average for the facility. Formula: Facility Current vs Historical Move-Out Occupied Ratio = Current Move-Out Occupied Ratio / Historical Move-Out Occupied Ratio.' },
      { key: 'group_current_move_out_occupied_ratio_last_60_days', label: 'Group Current Move-Out Occupied Ratio Last 60 Days', tooltip: 'The ratio of move-outs to occupied units for the group in the last 60 days. Formula: Group Current Move-Out Occupied Ratio Last 60 Days = Group Current Move-Outs / Group Current Occupied Units.' },
      { key: 'group_current_move_outs', label: 'Group Current Move-Outs', tooltip: 'The actual number of move-outs for the group in the last 60 days.' },
      { key: 'group_current_occupied_units', label: 'Group Current Occupied Units', tooltip: 'The number of units currently occupied in the group.' },
      { key: 'group_average_historical_move_out_occupied_ratio_next_60_days', label: 'Group Average Historical Move-Out Occupied Ratio Next 60 Days', tooltip: 'The average ratio of move-outs to occupied units for the group in the next 60 days, calculated over the past four years. Formula: historical average(move-outs next 60 days / occupied units in 60 days).' },
      { key: 'group_historical_move_outs_next_60_days', label: 'Group Historical Move-Outs Next 60 Days', tooltip: 'The average number of move-outs for the group in the next 60 days, calculated over the past four years. Formula: Average(move-outs for the next 60 days over the past four years).' },
      { key: 'group_historical_occupied_units_next_60_days', label: 'Group Historical Occupied Units Next 60 Days', tooltip: 'The average number of occupied units in the group for the next 60 days, calculated over the past four years. Formula: Group Historical Occupied Units Next 60 Days = Average(occupied units for the next 60 days over the past four years).' },
      { key: 'projected_move_out_occupied_ratio', label: 'Projected Move-Out Occupied Ratio', tooltip: 'The projected ratio of move-outs to occupied units for the group in the next 60 days, based on historical trends and current data. Formula: Projected Move-Out Occupied Ratio = (company_current_vs_historical_move_out_occupied_ratio * average_historical_move_out_occupied_ratio_next_60_days).' },
      { key: 'projected_move_outs_next_60_days', label: 'Projected Move-Outs Next 60 Days', tooltip: 'The projected number of move-outs for the group in the next 60 days, based on historical trends and current data. Formula: Projected Move-Outs Next 60 Days =(Projected Move-Out Occupied Ratio * Current Occupied Units).' },
      { key: 'historical_net_rentals', label: 'Historical Net Rentals', tooltip: 'The average net rentals for the group in the past, calculated as the difference between move-ins and move-outs over a given period. Formula: Historical Net Rentals = Average(move-ins - move-outs) over a given period.' },
      { key: 'current_period_net_rentals', label: 'Current Period Net Rentals', tooltip: 'The net rentals for the group in the current period, calculated as the difference between move-ins and move-outs. Formula: Current Period Net Rentals = Move-Ins - Move-Outs.' },
      { key: 'projected_net_rentals', label: 'Projected Net Rentals', tooltip: 'The projected net rentals for the group in the next 60 days, based on historical trends and current data. Formula: Projected Net Rentals = Projected Move-Ins - Projected Move-Outs.' },
      { key: 'unit_group_projected_occupancy', label: 'Projected Occupancy', tooltip: 'The projected occupancy rate for the group. Formula: Projected Occupancy = (Current Occupied Units + Projected Net Rentals) / Total Units.' },
      { key: 'days_since_last_rental', label: 'Days Since Last Rental', tooltip: 'The number of days since the last rental was made in the group. Formula: Days Since Last Rental = Current Date - Last Rental Date.' },
      { key: 'competitor_count', label: 'Competitor Count', tooltip: 'The number of competitors matching groups in a 5 mile radius of the facility.' },
      { key: 'competitor_percentage_cheaper', label: 'Competitor % Cheaper', tooltip: 'The percentage of competitors that are cheaper than our group. Formula: Competitor % Cheaper = (Number of Competitors with Lower Rates / Total Competitors) * 100.' },
      { key: 'competitor_percentage_more_expensive', label: 'Competitor % More Expensive', tooltip: 'The percentage of competitors that are more expensive that our group. Formula: Competitor % More Expensive = (Number of Competitors with Higher Rates / Total Competitors) * 100.' },
      { key: 'mean_competitor_price', label: 'Mean Competitor Rate', tooltip: 'The average rate of competitors in the vicinity of the group. Formula: Mean Competitor Rate = Sum of Competitor Rates / Number of Competitors.' },
      { key: 'median_competitor_price', label: 'Median Competitor Rate', tooltip: 'The median rate of competitors in the vicinity of the group. Formula: Median Competitor Rate = Median of Competitor Rates.' },
      { key: 'long_term_customer_average', label: 'Long Term Customer Average', tooltip: 'The average tenure of long-term customers in the group. Formula: Long Term Customer Average = Average tenure of customers who have been with the group for more than a specified period.' },
      { key: 'recent_period_average_move_in_rent', label: 'Recent Period Average Move-In Rent', tooltip: 'The average rent for move-ins during the recent period. Formula: Recent Period Average Move-In Rent = Sum of Rent for Move-Ins during Recent Period / Number of Move-Ins during Recent Period.' },
      { key: 'average_standard_rate', label: 'Current Standard Rate', tooltip: 'The current standard rate for the units in the group.' },
      { key: 'average_web_rate', label: 'Current Web Rate', tooltip: 'The current web rate for the units in the group.' },
      { key: 'projected_occupancy_impact', label: 'Projected Occupancy Impact', tooltip: 'The impact of projected move-ins and move-outs on the occupancy rate. Formula: Projected Occupancy Impact = IF(Group Projected Occupancy > 0.92) THEN ((Group Projected Occupancy / Adjusted Target Occupancy) * 1.25) ELSE ((Group Projected Occupancy / Adjusted Target Occupancy) * 0.75).' },
      { key: 'leasing_velocity_impact', label: 'Leasing Velocity Impact', tooltip: 'The impact of leasing velocity on the group\'s occupancy rate. Formula: Leasing Velocity Impact = IF(Group Leasing Velocity > Company Leasing Velocity) THEN ((Group Leasing Velocity - Company Leasing Velocity) / 3) ELSE ((Group Leasing Velocity - Company Leasing Velocity) / 2)' },
      { key: 'unit_group_leasing_velocity', label: 'Leasing Velocity (Group)', tooltip: 'The rate at which units are leased in the group. Formula: Leasing Velocity = (Group Move Ins Last 60 Days / 60 * 365) / Total Units.' },
      { key: 'company_group_leasing_velocity', label: 'Leasing Velocity (Company)', tooltip: 'The rate at which units are leased in the company. Formula: Leasing Velocity = (Company Group Historical Average Move Ins Last 60 Days / 60) * 365 / Total Company Group Units.' },
      { key: 'competitor_impact', label: 'Competitor Impact', tooltip: 'The impact of competitors on the group\'s occupancy rate. Formula: Competitor Impact = ((IF(% More Expensive > 0.6, % More Expensive - 0.6, IF(% More Expensive < 0.4, % More Expensive - 0.4, 0), 0))) * Competitor Count / 8).' },
      { key: 'suggested_web_rate', label: 'Suggested Web Rate', tooltip: 'The suggested web rate for units in the group. Formmula: Recent Period Average Move In Rate * ((1 + Projected Occupancy Impact) * (1 + Leasing Velocity Impact) * (1 + Competitor Impact)) ' },
      { key: 'effective_web_rate', label: 'Effective Web Rate', tooltip: 'The effective web rate for units in the group, allowing manual override of the suggested web rate.' }
    ];
  
    // Separate pinned and non-pinned columns
    const pinnedCols = columns.filter(col => pinnedColumns.includes(col.key));
    const nonPinnedCols = columns.filter(col => !pinnedColumns.includes(col.key));
    const sortedColumns = [...pinnedCols, ...nonPinnedCols];
  
    return (
      <thead>
        <tr>
          <GroupHeaderTh
            isSticky={true}
            isStickyLeft={true}
            minimized={hiddenColumns.has('group')}
            onClick={() => toggleColumn('group')}
            isGroupHeader={true}
            title="This is the group row that contains row groups for facility name, group type (climate, non-climate, or parking/non-storage), and area bucket."
          >
            <span className="text-content">Group</span>
          </GroupHeaderTh>
          {sortedColumns.map((column, index) => (
            <Th
              key={column.key}
              isSticky={true}
              minimized={hiddenColumns.has(column.key)}
              onClick={() => toggleColumn(column.key)}
              title={column.tooltip}
              isPinned={pinnedColumns.includes(column.key)}
              pinnedIndex={pinnedColumns.includes(column.key) ? pinnedColumns.indexOf(column.key) + 1 : undefined}
            >
              <span className="text-content">{column.label}</span>
              <span className="pin-icon" onClick={(e) => { e.stopPropagation(); togglePinColumn(column.key); }}>
                🟠
              </span>
            </Th>
          ))}
        </tr>
      </thead>
    );
  };
  
   
  return (
    <PageContainer>
      <TableWrapper ref={tableWrapperRef}>
        <Table>
          {renderHeader()}
          <tbody>{renderGroup(groupedData)}</tbody>
        </Table>
      </TableWrapper>
    </PageContainer>
  );
};

export default GroupableTable;