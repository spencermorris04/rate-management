'use client';

import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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
    suggested_web_rate: number;
    laddered_suggested_rate: number;
    scaled_suggested_rate: number;
    previous_bucket_size: number;
    previous_bucket_size_description: string;
    next_bucket_size: number;
    next_bucket_size_description: string;
    previous_bucket_laddered_rate: number;
    previous_bucket_laddered_rate_description: string;
    next_bucket_laddered_rate: number;
    next_bucket_laddered_rate_description: string;
    children?: Grouping[];
  }

  const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --header-bg: #f2f2f2;
    --row-bg-0: rgba(230, 243, 255, 0.95);
    --row-bg-1: rgba(255, 230, 230, 0.95);
    --row-bg-2: rgba(230, 255, 230, 0.95);
    --row-bg-3: rgba(255, 245, 230, 0.95);
    --row-hover-0: rgba(204, 235, 255, 1);
    --row-hover-1: rgba(255, 204, 204, 1);
    --row-hover-2: rgba(204, 255, 204, 1);
    --row-hover-3: rgba(255, 230, 204, 1);
    --minimized-bg: #FAC898;
    --minimized-color: #FAC898;
    --border-color: #d9d9d9;
    --pinned-bg: #d9d9d9;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #1a1a1a;
      --text-color: #ffffff;
      --header-bg: #2c2c2c;
      --row-bg-0: rgba(25, 50, 75, 0.95);
      --row-bg-1: rgba(75, 25, 25, 0.95);
      --row-bg-2: rgba(25, 75, 25, 0.95);
      --row-bg-3: rgba(75, 50, 25, 0.95);
      --row-hover-0: rgba(35, 70, 105, 1);
      --row-hover-1: rgba(105, 35, 35, 1);
      --row-hover-2: rgba(35, 105, 35, 1);
      --row-hover-3: rgba(105, 70, 35, 1);
      --minimized-bg: #8B5E3C;
      --minimized-color: #FAC898;
      --border-color: #444444;
      --pinned-bg: #3c3c3c;
    }
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
`;

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
  background-color: var(--bg-color);
`;

const getPinnedLeftPosition = (pinnedIndex: number | undefined, isStickyLeft: boolean) => {
  if (isStickyLeft) return 0;
  if (pinnedIndex === undefined) return 'auto';
  return `${200 + pinnedIndex * 150}px`;
};

const Th = styled.th<{ minimized?: boolean; pinnedIndex?: number; isStickyLeft?: boolean }>`
  border: none;
  padding: 8px 2px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 20;
  width: ${({ minimized }) => (minimized ? '40px' : '150px')};
  min-width: ${({ minimized }) => (minimized ? '40px' : '150px')};
  max-width: ${({ minimized }) => (minimized ? '40px' : '150px')};

  background-color: ${({ minimized }) => (minimized ? 'var(--minimized-bg)' : 'var(--header-bg)')};
  color: ${({ minimized }) => (minimized ? 'var(--minimized-color)' : 'var(--text-color)')};
  border-left: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : 'var(--border-color)')};
  border-right: 2px solid ${({ minimized }) => (minimized ? 'darkorange' : 'var(--border-color)')};

  ${({ isStickyLeft, pinnedIndex }) => {
    if (isStickyLeft) {
      return `
        left: 0;
        z-index: 21;
        width: 200px;
        min-width: 200px;
        max-width: 200px;
        font-size: 18px;
      `;
    } else if (pinnedIndex !== undefined) {
      return `
        left: ${200 + pinnedIndex * 150}px;
        z-index: 21;
        background-color: var(--pinned-bg);
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      `;
    }
    return '';
  }}

  .text-content {
    opacity: ${({ minimized }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')};
  }

  &::after {
    content: ${({ minimized }) => (minimized ? "'+'" : "''")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: ${({ minimized }) => (minimized ? '#000' : 'transparent')};
  }

  .pin-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')};
  }
`;

const Td = styled.td<{ level?: number, minimized?: boolean, pinnedIndex?: number, isStickyLeft?: boolean, even?: boolean }>`
  border: none;
  padding: 18px 8px;
  padding-left: ${({ level }) => (level !== undefined ? `${level * 20 + 12}px` : '12px')};

  ${({ pinnedIndex, isStickyLeft = false }) => `
    position: ${pinnedIndex !== undefined || isStickyLeft ? 'sticky' : 'static'};
    left: ${getPinnedLeftPosition(pinnedIndex, isStickyLeft)};
    z-index: ${isStickyLeft ? 10 : pinnedIndex !== undefined ? 5 : 'auto'};
    background-color: inherit;
    box-shadow: ${pinnedIndex !== undefined || isStickyLeft ? '2px 0 5px rgba(0,0,0,0.1)' : 'none'};
    width: ${pinnedIndex !== undefined || isStickyLeft ? '150px' : 'auto'};
    min-width: ${pinnedIndex !== undefined || isStickyLeft ? '150px' : 'auto'};
    max-width: ${pinnedIndex !== undefined || isStickyLeft ? '150px' : 'none'};
  `}

  text-align: center;
  background-color: ${({ even }) => (even ? 'rgba(249, 249, 249, 0.3)' : 'rgba(255, 255, 255, 0.3)')};
  color: var(--text-color);
  
  ${({ isStickyLeft = false }) =>
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

  ${({ pinnedIndex, isStickyLeft = false }) =>
    (pinnedIndex !== undefined || isStickyLeft) &&
    `
    position: sticky;
    ${isStickyLeft ? 'left: 0;' : `left: ${200 + (pinnedIndex ?? 0) * 150}px;`}
    z-index: ${isStickyLeft ? 10 : 5};
    background-color: inherit;
    ${!isStickyLeft && 'box-shadow: 2px 0 5px rgba(0,0,0,0.1);'}
  `}

  .content {
    opacity: ${({ minimized = false }) => (minimized ? 0 : 1)};
    transition: opacity 0.3s;
    display: ${({ minimized = false }) => (minimized ? 'none' : 'block')};
  }
`;

const GroupRow = styled.tr<{ level: number; isExpanded: boolean }>`
  background-color: ${({ level }) => `var(--row-bg-${level % 4})`};

  &:hover {
    background-color: ${({ level }) => `var(--row-hover-${level % 4})`};
  }

  ${Td} {
    font-weight: bold;
    background-color: inherit;
  }
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  font-family: Arial, sans-serif;
  background-color: var(--bg-color);
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

const getLongestWord = (label: string) => {
  const words = label.split(' ');
  return words.reduce((longest, word) => word.length > longest.length ? word : longest);
};

const TableComponent: React.FC<TableComponentProps> = ({ initialData, loading }) => {
  const [data, setData] = useState<Grouping[]>(initialData);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force a re-render when the color scheme changes
      setData([...data]);
    };
    
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [data]);

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
    { key: 'competitor_impact', label: 'Isolated Competitor Pricing Rate Pressure' },
    { key: 'leasing_velocity', label: 'Leasing Velocity' },
    { key: 'leasing_velocity_impact', label: 'Isolated Leasing Velocity Rate Pressure' },
    { key: 'projected_occupancy', label: 'Projected Occupancy' },
    { key: 'projected_occupancy_impact', label: 'Isolated Projected Occupancy Impact Rate Pressure' },
    { key: 'rate_pressure', label: 'Suggested Rate Pressure' },
    { key: 'suggested_web_rate', label: 'Initially Suggested Web Rate' },
    { key: 'laddered_suggested_rate', label: 'Inital Size Ordering Rate Constraints' },
    { key: 'scaled_suggested_rate', label: 'Scaled Suggested Rate' },
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
          {sortedColumns.map((column, index) => {
            const isPinned = pinnedColumns.includes(column.key);
            const pinnedIndex = isPinned ? pinnedColumns.indexOf(column.key) : undefined;
            const isMinimized = hiddenColumns.has(column.key);
            return (
              <Th
                key={column.key}
                minimized={isMinimized}
                pinnedIndex={isPinned ? pinnedIndex : undefined}
                isStickyLeft={false}
                onClick={() => toggleColumn(column.key)}
              >
                <span className="text-content">
                  {column.label.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                      {word}
                      {i < column.label.split(' ').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
                {!isMinimized && (
                  <span 
                    className="pin-icon" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      togglePinColumn(column.key); 
                    }}
                  >
                    {isPinned ? '📌' : '📍'}
                  </span>
                )}
              </Th>
            );
          })}
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
          // Extract the first and last sections from unit_group_type
          const parts = group.unit_group_type.split(' | ');
          if (parts.length >= 3) {
            groupName = `${parts[0]} | ${parts[parts.length - 1]}`.trim();
          } else {
            groupName = group.unit_group_type;
          }
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
          {sortedColumns.map((column, index) => {
            const isPinned = pinnedColumns.includes(column.key);
            const pinnedIndex = isPinned ? pinnedColumns.indexOf(column.key) : undefined;
            const style = !isPinned ? {
              width: `${getLongestWord(column.label).length * 10 + 4}px`,
              minWidth: `${getLongestWord(column.label).length * 10 + 4}px`
            } : {};
            return (
              <Td
                key={column.key}
                minimized={hiddenColumns.has(column.key)}
                pinnedIndex={pinnedIndex}
                isStickyLeft={false}
                level={level}
                title={group[`${column.key}_description` as keyof Grouping] as string}
                style={style}
              >
                <span className="content">
                  {group[column.key as keyof Grouping] as React.ReactNode}
                </span>
              </Td>
            );
          })}
        </GroupRow>
        {!isBaseRow && expanded[key] && group.children && group.children.map(child => renderRows(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <>
    <GlobalStyle />
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
    </>
  );
};

export default TableComponent;
