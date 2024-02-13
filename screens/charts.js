import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Svg, Line, Text } from "react-native-svg";

const ChartsScreen = () => {
  const xAxisValues = Array.from({ length: 10 }, (_, index) => index + 1);
  const yAxisValues = Array.from({ length: 8 }, (_, index) => index + 1);

  const chartWidth = 30 * xAxisValues.length;
  const chartHeight = 370;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Svg
        height="100%"
        width={chartWidth}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <View style={styles.chartContainer}>
          {/* Horizontal Grid Lines */}
          {yAxisValues.map((y, index) => (
            <Line
              key={`gridLineY-${index}`}
              x1={0}
              y1={(y / yAxisValues.length) * chartHeight}
              x2={chartWidth}
              y2={(y / yAxisValues.length) * chartHeight}
              stroke="lightgray"
              strokeWidth="1"
            />
          ))}

          {/* Vertical Grid Lines */}
          {xAxisValues.map((x, index) => (
            <Line
              key={`gridLineX-${index}`}
              x1={(x / xAxisValues.length) * chartWidth}
              y1={0}
              x2={(x / xAxisValues.length) * chartWidth}
              y2={chartHeight}
              stroke="lightgray"
              strokeWidth="1"
            />
          ))}

          {/* Axes Labels */}
          <Text
            x={(chartWidth / 2) - 20}
            y={chartHeight + 40}
            fill="black"
            fontSize="14"
            textAnchor="middle"
          >
            X-Axis Label
          </Text>
          <Text
            x={40}
            y={(chartHeight / 2) + 10}
            fill="black"
            fontSize="14"
            textAnchor="middle"
            transform={`rotate(-90, 8, ${(chartHeight / 2) + 10})`}
          >
            Y-Axis Label
          </Text>
        </View>
      </Svg>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChartsScreen;
