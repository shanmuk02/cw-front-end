/* eslint-disable */

import React from 'react'
import * as c3 from 'c3';
import 'c3/c3.css';


const LineChart=(props)=> {
    const {lineChartdata,lineChartProperties,fullScreenValue,uniqueIndex}=props

    if (lineChartdata !== undefined) {

      

        const chart = c3.generate({
          bindto: `#chart${uniqueIndex}`,
          type: "line",
          data: {
            x: "x",
            columns: lineChartdata
          },
          /* color: {
            pattern: donutColorData,
          }, */
          axis: {
            x: {
              type: "categorized", // this needed to load string x value
              tick: {
                rotate: 20,
                multiline: false,
              },
            },
            y: {
              tick: {
                format: function (d) {
                  if (d / 1000000000 >= 1) {
                    return +(d / 1000000000).toFixed(1) + " B";
                  } else if (d / 1000000 >= 1) {
                    return +(d / 1000000).toFixed(1) + " M";
                  } else if (d / 1000 >= 1) {
                    return +(d / 1000).toFixed(1) + " K";
                  } else {
                    return d;
                  }
                },
              },
              height: 100,
              label: {
                text: lineChartProperties["Y"],
                position: /* element.rotatechart === 'Y' ? '' :  */ "outer-middle",
              },
            },
          },
          legend: {
            position: "top",
          },
          size: {
            height: 220,
            width: 500,
          },
        });
        fullScreenValue === true ? chart.resize({ height: 510, width: 1250 }) : ''
    }
    return (
      <>
        <div id={`chart${uniqueIndex}`} />
      </>
    );
}

export default LineChart
