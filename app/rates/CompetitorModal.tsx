// CompetitorModal.tsx
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';

interface CompetitorData {
  storeName: string;
  unit: string;
  regularPrice: number;
  onlinePrice: number;
  group_key: string;
}

interface CompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CompetitorData[];
}

const ModalContent = styled.div`
  background-color: rgba(var(--bg-color-rgb), 0.9);
  border-radius: 12px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 300px;
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;
`;

const Th = styled.th`
  background-color: var(--header-bg);
  color: var(--text-color);
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: -30px;
  width: 30px;
  height: 30px;
  background-color: var(--header-bg);
  border: none;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: var(--border-color);
  }
`;

const CompetitorModal: React.FC<CompetitorModalProps> = ({ isOpen, onClose, data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [modalWidth, setModalWidth] = useState(800);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const { width } = contentRef.current.getBoundingClientRect();
      setModalWidth(Math.min(width + 40, 800));
      setModalPosition({
        x: (window.innerWidth - Math.min(width + 40, 800)) / 2,
        y: (window.innerHeight - 300) / 2,
      });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  return (
    <Rnd
      size={{ width: modalWidth, height: 'auto' }}
      position={modalPosition}
      onDragStop={(e, d) => {
        setModalPosition({ x: d.x, y: d.y });
      }}
      onResize={(e, direction, ref, delta, position) => {
        setModalWidth(ref.offsetWidth);
        setModalPosition(position);
      }}
      enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
      minWidth={300}
      maxWidth={800}
      bounds="window"
      style={{ zIndex: 1000 }}
    >
      <ModalContent ref={contentRef}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Store Name</Th>
                <Th>Group Type</Th>
                <Th>Unit Type</Th>
                <Th>Standard Rate</Th>
                <Th>Web Rate</Th>
              </tr>
            </Thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <Td>{item.storeName}</Td>
                  <Td>{item.group_key}</Td>
                  <Td>{item.unit}</Td>
                  <Td>${item.regularPrice}</Td>
                  <Td>${item.onlinePrice}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </ModalContent>
    </Rnd>
  );
};

export default CompetitorModal;