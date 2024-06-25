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
}

interface GroupedData {
  items: RateManagementItem[];
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  recent_period_average_move_in_rent: number | null;
  suggested_web_rate: number | null;
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
    suggested_web_rate: null
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
        return { items, total_units, occupied_units, occupancy_rate, recent_period_average_move_in_rent, suggested_web_rate };
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

      return { items: [], total_units, occupied_units, occupancy_rate, recent_period_average_move_in_rent, suggested_web_rate, subGroups };
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
          <Td>${item.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
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
              <Td>${subGroup.recent_period_average_move_in_rent?.toFixed(2) ?? 'N/A'}</Td>
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