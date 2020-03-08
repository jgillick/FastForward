import { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag'
import { eachDayOfInterval, subDays, format } from 'date-fns';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { withApollo, getGraphqlErrors } from '../apollo/client';
import { AuthContext } from './Authenticated';

import css from './Chart.module.scss';

const REDIRECT_LOG_QUERY = gql`
  query redirectLogs(
    $name: String!,
    # $oAuthIdToken: String!,
  ) {
    redirectLogs(
      name: $name,
      # oAuthIdToken: $oAuthIdToken,
    ) {
      id
      createdAt
    }
  }
`;

const MIN_DAYS = 7;
const MAX_DAYS = 30;

const utcDate = () => new Date(new Date().toISOString());

export default withApollo(function Chart({ name }) {
  const { oAuthIdToken } = useContext(AuthContext);
  const { loading, data, error } = useQuery(REDIRECT_LOG_QUERY, {
    variables: {
      name,
      oAuthIdToken
    },
  });
  const [chartData, setChartData] = useState([]);

  /**
   * Parse the history data
   */
  useEffect(() => {
    console.log('Data', data);
    if (!data) return;
    const logs = data.redirectLogs;
    const dateGroups = {};

    // Create a 30-day range
    const now = utcDate();
    const days = eachDayOfInterval({
      start: subDays(now, MAX_DAYS),
      end: now,
    });
    days.forEach((day) => {
      dateGroups[format(day, 'yyyy-MM-dd')] = 0;
    });


    // Group by day
    logs.forEach((log) => {
      const [date, time] = log.createdAt.split('T');

      if (typeof dateGroups[date] !== 'undefined') {
        dateGroups[date]++;
      }
    });

    // Convert to array
    let dayArray = Object.entries(dateGroups).map(([key, value]) => ({
      date: key,
      count: value,
    }))
    dayArray.sort((a, b) => a.date.localeCompare(b.date));

    // Format dates
    dayArray.map((item) => {
      item.date = format(new Date(item.date), 'MMM do');
      return item;
    });

    // Reduce array to minimum of 7 days
    dayArray = dayArray.reduce((arr, day, i) => {
      if (
        arr.length
        || day.count > 0
        || i > dayArray.length - MIN_DAYS
      ) {
        arr.push(day);
      }
      return arr;
    }, []);

    setChartData(dayArray);
  }, [ data ]);


  if (error) {
    console.log('GraphQL error', getGraphqlErrors(error));
  }

  return (
    <>
      { loading && (
        <LinearProgress />
      )}
      { !loading &&
        (chartData.length === 0)
          ? (
            <Typography variant="body1" className={css.noData}>
              No data from the past 30 days.
            </Typography>
          ) : (
            <LineChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 5, left: 10 }}
            >
              <XAxis
                label="Time"
                dataKey="date"
                tick=""
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Redirects" stroke="#8884d8" />
            </LineChart>
          )
      }
    </>
  );
});
