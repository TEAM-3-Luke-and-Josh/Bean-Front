import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { tokens } from '../theme';

const RevenueChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const data = [
    {
      id: "revenue",
      color: colors.green[500],
      data: [
        { x: "Jan", y: 45200 },
        { x: "Feb", y: 48300 },
        { x: "Mar", y: 51400 },
        { x: "Apr", y: 49800 },
        { x: "May", y: 52600 },
        { x: "Jun", y: 54900 },
        { x: "Jul", y: 57200 },
        { x: "Aug", y: 55800 },
        { x: "Sep", y: 58400 },
        { x: "Oct", y: 56700 },
        { x: "Nov", y: 59300 },
        { x: "Dec", y: 59342 }
      ]
    }
  ];

  return (
    <Box
      gridColumn="span 12"
      gridRow="span 3"
      backgroundColor={colors.brown[100]}
      p={3}
      height="100%"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight="600" mb={1}>
            Revenue Generated
          </Typography>
          <Typography variant="h2" fontWeight="bold">
            $59,342.00
          </Typography>
        </Box>
      </Box>
      <Box height="250px" mt={2}>
        <ResponsiveLine
          data={data}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.green[100],
                },
              },
              legend: {
                text: {
                  fill: colors.green[100],
                  fontSize: 14,
                },
              },
              ticks: {
                line: {
                  stroke: colors.green[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.swap[200],
                  fontSize: 12,
                },
              },
            },
            legends: {
              text: {
                fill: colors.swap[200],
                fontSize: 13,
              },
            },
            tooltip: {
              container: {
                background: colors.brown[100],
                color: colors.green[100],
                fontSize: 14,
              },
            },
          }}
          margin={{ top: 20, right: 110, bottom: 50, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=" >-$,.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Revenue',
            legendOffset: -50,
            legendPosition: 'middle',
            format: ">-$,.2f"
          }}
          enableGridX={false}
          colors={colors.green[500]}
          pointSize={10}
          pointColor={colors.brown[100]}
          pointBorderWidth={2}
          pointBorderColor={colors.green[500]}
          pointLabelYOffset={-12}
          enableArea={true}
          areaBaselineValue={30000}
          areaOpacity={0.15}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: colors.brown[100],
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </Box>
    </Box>
  );
};

export default RevenueChart;