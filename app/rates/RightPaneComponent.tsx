'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';

interface TimerCircleProps {
    progress: number;
}

interface RightPaneComponentProps {
    initialPeriodLength: number;
    initialTargetOccupancy: number;
    onUpdatePeriodLength: (periodLength: number) => Promise<void>;
    onUpdateTargetOccupancy: (targetOccupancy: number) => Promise<void>;
}

const RightPane = styled.div`
  width: 18%;
  height: 90vh;
  background-color: var(--bg-color);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: var(--input-bg-color);
  padding: 10px;
  border-radius: 10px;
`;

const PeriodLengthInput = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  background-color: var(--input-bg-color);
  color: var(--text-color);
  &:invalid {
    background-color: var(--invalid-bg-color);
  }
`;

const OccupancyDisplay = styled.div`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  background-color: var(--input-bg-color);
  color: var(--text-color);
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;

  &:hover {
    background-color: var(--button-hover-bg-color);
  }

  display: flex;
  align-items: center;
  justify-content: center;
`;

const FieldLabel = styled.div`
  width: 100%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const TimerCircle = styled.div<TimerCircleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 ${props => props.progress}%,
    #e0e0e0 ${props => props.progress}% 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const TimerText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const TimerLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const RightPaneComponent: React.FC<RightPaneComponentProps> = ({
    initialPeriodLength,
    initialTargetOccupancy,
    onUpdatePeriodLength,
    onUpdateTargetOccupancy
}) => {
    const [periodLength, setPeriodLength] = useState<number>(initialPeriodLength);
    const [targetOccupancy, setTargetOccupancy] = useState<number>(initialTargetOccupancy);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(35);
    const [isLoadingOccupancy, setIsLoadingOccupancy] = useState(false);
    const [countdownOccupancy, setCountdownOccupancy] = useState(5);
    const [isEditingOccupancy, setIsEditingOccupancy] = useState(false);
    const [isEditingPeriodLength, setIsEditingPeriodLength] = useState(false);

    const handlePeriodLengthSubmit = async () => {
        setIsLoading(true);
        setCountdown(35);

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        try {
            await onUpdatePeriodLength(periodLength);
        } catch (error) {
            console.error('Error updating period length:', error);
        } finally {
            setIsLoading(false);
            clearInterval(timer);
            setIsEditingPeriodLength(false);
        }
    };

    const handleTargetOccupancySubmit = async () => {
        setIsLoadingOccupancy(true);
        setCountdownOccupancy(5);

        const timer = setInterval(() => {
            setCountdownOccupancy((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        try {
            await onUpdateTargetOccupancy(targetOccupancy);
        } catch (error) {
            console.error('Error updating target occupancy:', error);
        } finally {
            setIsLoadingOccupancy(false);
            clearInterval(timer);
            setIsEditingOccupancy(false);
        }
    };

    const handleOccupancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.match(/^0\.\d{0,2}$/)) {
            setTargetOccupancy(parseFloat(value));
        }
    };

    const handlePeriodLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.match(/^\d{0,3}$/)) {
            setPeriodLength(parseInt(value) || 0);
        }
    };

    return (
        <RightPane>
            <FieldLabel>Period Length</FieldLabel>
            <InputContainer>
                {isEditingPeriodLength ? (
                    <PeriodLengthInput
                        type="text"
                        value={periodLength}
                        onChange={handlePeriodLengthChange}
                        onBlur={() => setIsEditingPeriodLength(false)}
                        autoFocus
                    />
                ) : (
                    <OccupancyDisplay onClick={() => setIsEditingPeriodLength(true)}>
                        {`${periodLength} days`}
                    </OccupancyDisplay>
                )}
                <SubmitButton onClick={handlePeriodLengthSubmit} disabled={isLoading || isEditingPeriodLength}>
                    <FiSend size={20} />
                </SubmitButton>
            </InputContainer>
            {isLoading && (
                <TimerContainer>
                    <TimerCircle progress={(35 - countdown) / 35 * 100}>
                        <TimerText>{countdown}</TimerText>
                    </TimerCircle>
                    <TimerLabel>Seconds remaining</TimerLabel>
                </TimerContainer>
            )}

            <FieldLabel>Target Occupancy</FieldLabel>
            <InputContainer>
                {isEditingOccupancy ? (
                    <PeriodLengthInput
                        type="text"
                        value={targetOccupancy.toFixed(2)}
                        onChange={handleOccupancyChange}
                        onBlur={() => setIsEditingOccupancy(false)}
                        autoFocus
                    />
                ) : (
                    <OccupancyDisplay onClick={() => setIsEditingOccupancy(true)}>
                        {`${Math.round(targetOccupancy * 100)}%`}
                    </OccupancyDisplay>
                )}
                <SubmitButton onClick={handleTargetOccupancySubmit} disabled={isLoadingOccupancy || isEditingOccupancy}>
                    <FiSend size={20} />
                </SubmitButton>
            </InputContainer>
            {isLoadingOccupancy && (
                <TimerContainer>
                    <TimerCircle progress={(5 - countdownOccupancy) / 5 * 100}>
                        <TimerText>{countdownOccupancy}</TimerText>
                    </TimerCircle>
                    <TimerLabel>Seconds remaining</TimerLabel>
                </TimerContainer>
            )}
        </RightPane>
    );
};

export default RightPaneComponent;
