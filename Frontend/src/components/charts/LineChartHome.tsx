import { redPrimary } from '@/lib/common';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    spent: 4000000,
  },
  {
    name: 'Feb',
    spent: 3800000,
  },
  {
    name: 'Mar',
    spent: 2000000,
  },
  {
    name: 'Apr',
    spent: 2780000,
  },
  {
    name: 'May',
    spent: 2900000,
  },
  {
    name: 'June',
    spent: 2400000,
  },
  {
    name: 'July',
    spent: 2490000,
  },
  {
    name: 'Aug',
    spent: 3490000,
  },
  {
    name: 'Sep',
    spent: 3490000,
  },
  {
    name: 'Oct',
    spent: 3490000,
  },
  {
    name: 'Nov',
    spent: 3490000,
  },
  {
    name: 'Dec',
    spent: 3490000,
  },
];

export default class LineChartHome extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <Tooltip contentStyle={{backgroundColor:'gray', color:'white'}} itemStyle={{color:'white'}} />
          <Line type="natural" dataKey="spent" stroke={redPrimary} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
