// @flow
import React, { PureComponent, Fragment } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import styles from './Chart.css';
import { STG_DIVISIBILITY } from '../../../../constants/config';

type Props = {
  data: any
};

export default class Chart extends PureComponent<Props> {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.ChartContainer}>
        <ResponsiveContainer width="100%" height={281}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorAmountSTG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#707EA3" stopOpacity={0.71} />
                <stop offset="95%" stopColor="#3D4869" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorSTGSTROKE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#46FF00" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF6C00" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Tooltip content={renderTooltip} />
            <Area
              type="monotone"
              dataKey="STG"
              stroke="url(#colorSTGSTROKE)"
              strokeWidth={2}
              fillOpacity={0.64}
              fill="url(#colorAmountSTG)"
              isAnimationActive={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickSize={0}
              mirror
              height={28}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

const renderTooltip = (props: any) => {
  const { payload } = props;
  return (
    <div>
      {payload[0] && (
        <Fragment>
          <div className={styles.XaxisLabel}>
            {payload[0].payload.tooltip.toFixed(STG_DIVISIBILITY)} STG
          </div>
        </Fragment>
      )}
    </div>
  );
};
