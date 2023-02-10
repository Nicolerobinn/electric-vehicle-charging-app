import React, { memo, useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';

const Chart = () => {
  const screenWidth = Dimensions.get('window').width;

  const [dataSet, setDataSet] = useState([
    Math.round(Math.random() * 10000) / 100,
    Math.round(Math.random() * 10000) / 100,
    Math.round(Math.random() * 10000) / 100,
    Math.round(Math.random() * 10000) / 100,
    Math.round(Math.random() * 10000) / 100,
  ]);
  let now = dayjs();
  const [timeSet, setTimeSet] = useState([
    now.add(0.25, 'minutes').format('hh:mm A'),
    now.add(0.5, 'minutes').format('hh:mm A'),
    now.add(0.75, 'minutes').format('hh:mm A'),
    now.add(1, 'minutes').format('hh:mm A'),
    now.add(1.25, 'minutes').format('hh:mm A'),
  ]);

  useEffect(() => {
    //   setInterval(function() {
    //     let copyTimeSet = timeSet;
    //     // console.log('copyTimeSet', copyTimeSet);
    //     copyTimeSet.shift()
    //     setTimeSet([...copyTimeSet, moment().add(25, 'seconds').format('hh:mm A')])
    //     let copyDataSet = dataSet;
    //     copyDataSet.shift()
    //     setDataSet([...copyDataSet, Math.round(Math.random() * 10000)])
    // }, 5000); // 60 * 1000 milsec
  }, []);

  const data = {
    // labels: ['11:00', '11:15', '11:30', '11:45', '12:00', '12:15'],
    labels: timeSet,
    datasets: [
      {
        // data: [20, 45, 28, 80, 99, 43],
        data: dataSet,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Power/KWh'], // optional
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(14, 63, 148, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      bezier
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Chart);
