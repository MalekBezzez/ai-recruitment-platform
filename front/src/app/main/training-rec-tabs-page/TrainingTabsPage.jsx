import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import SelfTrainingView from '../self-training-view/SelfTrainingView';
import CoachingTrainingView from '../coaching-view/CoachingView';
import StructuredTrainingView from '../structured-training-view/StructuredTrainingView';

const TrainingTabsPage = () => {
  const { planId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        centered
        sx={{
          backgroundColor: 'transparent',
          minHeight: 48,
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
        aria-label="Training type tabs"
      >
        {['Self Trainings', 'Coachings', 'Structured Trainings'].map((label, index) => (
          <Tab
            key={label}
            label={label}
            sx={{
              textTransform: 'none',
              fontWeight: '600',
              color: tabIndex === index ? '#222' : '#555',
              backgroundColor: tabIndex === index ? '#f0f0f0' : '#fff',
              borderRadius: 2,
              minWidth: 110,
              marginX: 0.75,
              paddingY: 1,
              borderBottom:
                tabIndex === index ? '3px solid #1976d2' : '3px solid #ddd',
              boxShadow:
                tabIndex === index ? '0 2px 6px rgb(25 118 210 / 0.2)' : 'none',
              transition: 'all 0.35s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: tabIndex === index ? '#e8e8e8' : '#e6f0ff',
                color: '#222',
                boxShadow:
                  tabIndex === index ? '0 2px 6px rgb(25 118 210 / 0.2)' : '0 1px 3px rgb(0 0 0 / 0.1)',
              },
            }}
            aria-selected={tabIndex === index}
            role="tab"
            id={`training-tab-${index}`}
            aria-controls={`training-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <SelfTrainingView planId={planId} />}
        {tabIndex === 1 && <CoachingTrainingView planId={planId} />}
        {tabIndex === 2 && <StructuredTrainingView planId={planId} />}
      </Box>
    </Box>
  );
};

export default TrainingTabsPage;
