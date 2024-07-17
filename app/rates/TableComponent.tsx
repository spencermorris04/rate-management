'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface Grouping {
    level: string;
    level_description: string;
    facility_name: string;
    facility_name_description: string;
    group_type: string;
    group_type_description: string;
    area_bucket: string;
    area_bucket_description: string;
    unit_group_type: string;
    unit_group_type_description: string;
    total_units: number;
    total_units_description: string;
    occupied_units: number;
    occupied_units_description: string;
    occupancy_rate: number;
    occupancy_rate_description: string;
    unrentable_count: number;
    unrentable_count_description: string;
    reserved_count: number;
    reserved_count_description: string;
    otherwise_unrentable_count: number;
    otherwise_unrentable_count_description: string;
    available_units: number;
    available_units_description: string;
    days_with_zero_availablity: string;
    days_with_zero_availablity_description: string;
    days_with_low_availability: number;
    days_with_low_availability_description: string;
    long_term_customer_average: number;
    long_term_customer_average_description: string;
    recent_period_average_move_in_rent: number;
    recent_period_average_move_in_rent_description: string;
    average_standard_rate: number;
    average_standard_rate_description: string;
    average_web_rate: number;
    average_web_rate_description: string;
    competitor_count: number;
    competitor_count_description: string;
    competitor_percentage_cheaper: number;
    competitor_percentage_cheaper_description: string;
    competitor_percentage_more_expensive: number;
    competitor_percentage_more_expensive_description: string;
    mean_competitor_price: number;
    mean_competitor_price_description: string;
    median_competitor_price: number;
    median_competitor_price_description: string;
    historical_move_ins_last_x_days: number;
    historical_move_ins_last_x_days_description: string;
    move_ins_last_x_days: number;
    move_ins_last_x_days_description: string;
    historical_move_ins_next_x_days: number;
    historical_move_ins_next_x_days_description: string;
    projected_move_ins: number;
    projected_move_ins_description: string;
    move_outs_last_x_days: number;
    move_outs_last_x_days_description: string;
    occupied_units_last_x_days: number;
    occupied_units_last_x_days_description: string;
    move_out_occupied_ratio_last_x_days: number;
    move_out_occupied_ratio_last_x_days_description: string;
    historical_move_outs_last_x_days: number;
    historical_move_outs_last_x_days_description: string;
    historical_occupied_units_last_x_days: number;
    historical_occupied_units_last_x_days_description: string;
    historical_move_out_occupied_ratio_last_x_days: number;
    historical_move_out_occupied_ratio_last_x_days_description: string;
    historical_move_outs_next_x_days: number;
    historical_move_outs_next_x_days_description: string;
    historical_occupied_units_next_x_days: number;
    historical_occupied_units_next_x_days_description: string;
    historical_move_out_occupied_ratio_next_x_days: number;
    historical_move_out_occupied_ratio_next_x_days_description: string;
    projected_move_ins_facility_scaled: number;
    projected_move_ins_facility_scaled_description: string;
    projected_move_ins_blended: number;
    projected_move_ins_blended_description: string;
    competitor_impact: number;
    competitor_impact_description: string;
    leasing_velocity: number;
    leasing_velocity_description: string;
    leasing_velocity_impact: number;
    leasing_velocity_impact_description: string;
    projected_occupancy: number;
    projected_occupancy_description: string;
    projected_occupancy_impact: number;
    projected_occupancy_impact_description: string;
    projected_move_outs_next_x_days: number;
    projected_move_outs_next_x_days_description: string;
    net_rentals_last_x_days: number;
    net_rentals_last_x_days_description: string;
    historical_net_rentals_last_x_days: number;
    historical_net_rentals_last_x_days_description: string;
    historical_net_rentals_next_x_days: number;
    historical_net_rentals_next_x_days_description: string;
    projected_net_rentals_next_x_days: number;
    projected_net_rentals_next_x_days_description: string;
    children?: Grouping[];
  }

const TableWrapper = styled.div`
  width: 80%;
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
`;

const Th = styled.th<{ minimized?: boolean; pinnedIndex?: number; isStickyLeft?: boolean }>`
  background-color: ${({ minimized }) => (minimized ? '#FAC898' : '#f2f2f2')};
  border: none;
  padding: 16px 12px;
  text-align: center;
  width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  min-width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  max-width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  position: sticky;
  top: 0;
  z-index: 20;
  color: ${({ minimized }) => (minimized ? '#FAC898' : '#000000')};
  border-left: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')};
  border-right: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : '#d9d9d9')};

  ${({ isStickyLeft }) =>
    isStickyLeft &&
    `
    left: 0;
    z-index: 21;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
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

  ${({ pinnedIndex }) =>
    pinnedIndex !== undefined &&
    `
    left: ${50 + pinnedIndex * 150}px;
    z-index: 25;
    background-color: #d9d9d9;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  `}

  .pin-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
  }
`;

const Td = styled.td<{ level?: number, minimized?: boolean, pinnedIndex?: number, isStickyLeft?: boolean, even?: boolean }>`
  border: none;
  padding: 18px 8px;
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};
  width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  min-width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  max-width: ${({ minimized }) => (minimized ? '5px' : '150px')};
  text-align: center;
  background-color: ${({ even }) => (even ? 'rgba(249, 249, 249, 0.3)' : 'rgba(255, 255, 255, 0.3)')};

  ${({ isStickyLeft }) =>
    isStickyLeft &&
    `
    position: sticky;
    left: 0;
    z-index: 5;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    text-align: left;
  `}

  ${({ pinnedIndex, isStickyLeft }) =>
    (pinnedIndex !== undefined || isStickyLeft) &&
    `
    position: sticky;
    ${isStickyLeft ? 'left: 0;' : `left: ${200 + pinnedIndex! * 150}px;`}
    z-index: ${isStickyLeft ? 10 : 5};
    background-color: inherit;
    ${!isStickyLeft && 'box-shadow: 2px 0 5px rgba(0,0,0,0.1);'}
  `}

  .content {
    opacity: ${({ minimized }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')};
  }
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

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  font-family: Arial, sans-serif;
  background-color: white;
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  cursor: default;
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-block;
  width: 20px;
  text-align: center;
  transition: transform 0.3s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
`;

interface TableComponentProps {
  initialData: Grouping[];
  loading: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ initialData, loading }) => {
  const [data, setData] = useState<Grouping[]>(initialData);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);

  const columns = [
    { key: 'total_units', label: 'Total Units' },
    { key: 'occupied_units', label: 'Occupied Units' },
    { key: 'occupancy_rate', label: 'Occupancy Rate' },
    { key: 'unrentable_count', label: 'Unrentable Units' },
    { key: 'reserved_count', label: 'Reserved Units' },
    { key: 'otherwise_unrentable_count', label: 'Otherwise Unrentable Units' },
    { key: 'available_units', label: 'Available Units' },
    { key: 'days_with_zero_availablity', label: 'Days with No Availability' },
    { key: 'days_with_low_availability', label: 'Days with Little Availability' },
    { key: 'long_term_customer_average', label: 'Long Term Customer Average' },
    { key: 'recent_period_average_move_in_rent', label: 'Recent Period Average Move-In Rent' },
    { key: 'average_standard_rate', label: 'Current Standard Rate' },
    { key: 'average_web_rate', label: 'Current Web Rate' },
    { key: 'competitor_count', label: 'Competitor Count' },
    { key: 'competitor_percentage_cheaper', label: 'Competitor % Cheaper' },
    { key: 'competitor_percentage_more_expensive', label: 'Competitor % More Expensive' },
    { key: 'mean_competitor_price', label: 'Mean Competitor Rate' },
    { key: 'median_competitor_price', label: 'Median Competitor Rate' },
    { key: 'historical_move_ins_last_x_days', label: 'Historical Move-Ins Last X Days' },
    { key: 'move_ins_last_x_days', label: 'Move-Ins Last X Days' },
    { key: 'historical_move_ins_next_x_days', label: 'Historical Move-Ins Next X Days' },
    { key: 'projected_move_ins', label: 'Projected Move-Ins (Raw)' },
    { key: 'projected_move_ins_facility_scaled', label: 'Projected Move-Ins Facility Scaled' },
    { key: 'projected_move_ins_blended', label: 'Blended Move-In Projection' },
    { key: 'move_outs_last_x_days', label: 'Move-Outs Last X Days' },
    { key: 'occupied_units_last_x_days', label: 'Occupied Units Last X Days' },
    { key: 'move_out_occupied_ratio_last_x_days', label: 'Move-Out Occupied Ratio Last X Days' },
    { key: 'historical_move_outs_last_x_days', label: 'Historical Move-Outs Last X Days' },
    { key: 'historical_occupied_units_last_x_days', label: 'Historical Occupied Units Last X Days' },
    { key: 'historical_move_out_occupied_ratio_last_x_days', label: 'Historical Move-Out Occupied Ratio Last X Days' },
    { key: 'historical_move_outs_next_x_days', label: 'Historical Move-Outs Next X Days' },
    { key: 'historical_occupied_units_next_x_days', label: 'Historical Occupied Units Next X Days' },
    { key: 'historical_move_out_occupied_ratio_next_x_days', label: 'Historical Move-Out Occupied Ratio Next X Days' },
    { key: 'projected_move_outs_next_x_days', label: 'Projected Move-Outs Next X Days' },
    { key: 'net_rentals_last_x_days', label: 'Net Rentals Last X Days' },
    { key: 'historical_net_rentals_last_x_days', label: 'Historical Net Rentals Last X Days' },
    { key: 'historical_net_rentals_next_x_days', label: 'Historical Net Rentals Next X Days' },
    { key: 'projected_net_rentals_next_x_days', label: 'Projected Net Rentals Next X Days' },
    { key: 'competitor_impact', label: 'Competitor Impact' },
    { key: 'leasing_velocity', label: 'Leasing Velocity' },
    { key: 'leasing_velocity_impact', label: 'Leasing Velocity Impact' },
    { key: 'projected_occupancy', label: 'Projected Occupancy' },
    { key: 'projected_occupancy_impact', label: 'Projected Occupancy Impact' },
  ];

  const toggleColumn = (column: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      next.has(column) ? next.delete(column) : next.add(column);
      return next;
    });
  };

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

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderHeader = () => {
    const pinnedCols = columns.filter(col => pinnedColumns.includes(col.key));
    const nonPinnedCols = columns.filter(col => !pinnedColumns.includes(col.key));
    const sortedColumns = [...pinnedCols, ...nonPinnedCols];
  
    return (
      <thead>
        <tr>
          <Th isStickyLeft>
            <span className="text-content">Group</span>
          </Th>
          {sortedColumns.map((column, index) => (
            <Th
              key={column.key}
              minimized={hiddenColumns.has(column.key)}
              pinnedIndex={pinnedColumns.includes(column.key) ? pinnedColumns.indexOf(column.key) + 1 : undefined}
              onClick={() => toggleColumn(column.key)}
            >
              <span className="text-content">{column.label}</span>
              <span 
                className="pin-icon" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  togglePinColumn(column.key); 
                }}
              >
                📌
              </span>
            </Th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderRows = (group: Grouping, level: number = 0) => {
    const key = `${group.facility_name}-${group.group_type}-${group.area_bucket}-${group.unit_group_type}`;
    let groupName = '';
  
    switch (level) {
      case 0:
        groupName = group.facility_name;
        break;
      case 1:
        groupName = group.group_type;
        break;
      case 2:
        groupName = group.area_bucket;
        break;
      case 3:
        // Extract only the third section from unit_group_type
        const parts = group.unit_group_type.split(' | ');
        groupName = parts.length === 3 ? parts[2] : group.unit_group_type;
        break;
      default:
        groupName = '';
    }
  
    const pinnedCols = columns.filter(col => pinnedColumns.includes(col.key));
    const nonPinnedCols = columns.filter(col => !pinnedColumns.includes(col.key));
    const sortedColumns = [...pinnedCols, ...nonPinnedCols];
  
    const isBaseRow = level === 3; // Treat 'unit_group' as the base row
  
    return (
      <React.Fragment key={key}>
        <GroupRow level={level} isExpanded={!!expanded[key]}>
          <Td isStickyLeft level={level} onClick={() => !isBaseRow && toggleExpand(key)}>
            {!isBaseRow && (
              <ExpandIcon isExpanded={!!expanded[key]}>▶</ExpandIcon>
            )}
            {groupName}
          </Td>
          {sortedColumns.map((column, index) => (
            <Td
              key={column.key}
              minimized={hiddenColumns.has(column.key)}
              pinnedIndex={pinnedColumns.includes(column.key) ? pinnedColumns.indexOf(column.key) : undefined}
              isStickyLeft={column.key === 'group'} // Add this line
              level={level}
              title={group[`${column.key}_description` as keyof Grouping] as string}
            >
              <span className="content">
                {group[column.key as keyof Grouping] as React.ReactNode}
              </span>
            </Td>
          ))}
        </GroupRow>
        {!isBaseRow && expanded[key] && group.children && group.children.map(child => renderRows(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <TableWrapper>
      {loading ? (
        <div>Loading...</div> // Placeholder for the loading state
      ) : (
        <Table>
          {renderHeader()}
          <tbody>
            {data.map(group => renderRows(group))}
          </tbody>
        </Table>
      )}
    </TableWrapper>
  );
};

export default TableComponent;
