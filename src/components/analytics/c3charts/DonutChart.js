/* eslint-disable */

import React from 'react'
import * as c3 from 'c3';
import 'c3/c3.css';


const DonutChart=(props)=> {
    const {donutChartdata,donutChartProperties,fullScreenValue,uniqueIndex,colSpace}=props

    const firstEightElementsArray = []

    if (donutChartdata !== undefined) {
        let chartSize={}
        if(colSpace==="6"){
          chartSize= {
            height: 220,
            width: 550,
          }
        }else{
          chartSize= {
            height: 200,
            width: 350,
          }
        }
        if (donutChartdata.length > 0) {
          const arrayElements = donutChartdata[1]
          for (let index = 0; index < arrayElements.length; index += 1) {
            const element = arrayElements[index]
            firstEightElementsArray.push(element.slice(0, 5))
            // firstTenElementsArray.push(element)
          }
          // console.log("===>firstEightElementsArray<====",firstEightElementsArray.slice(0, 5))
          let donutColorData = ''
            const donutColor = donutChartProperties.donutcolor
            // console.log("===>donutColor<====",donutColor)
            const replaceSquareBrackets = donutChartProperties.donutcolor !== undefined ? donutColor.replace(/[\[\]']+/g, '') : ''
            const replaceAllDoubleQuotes = replaceSquareBrackets.replace(/\"/g, '')
            donutColorData = replaceAllDoubleQuotes.split(',')

            // console.log("===>donutColorData<====",donutColorData)

            // console.log("===>donutColorData<====",donutColorData)

            const chart = c3.generate({
              bindto: `#chart${uniqueIndex}`,
              data: {
                columns: fullScreenValue === false ? firstEightElementsArray.slice(0, 5) : donutChartdata[1],
                type: 'donut',
              },
              color: {
                pattern: donutColorData,
              },
              donut: {
                // title: fullScreenValue===true?`Total:${this.amountFormat(donutChartdata[0])}`:'',
                // title: `Total:${this.amountFormat(donutChartdata[0])}`,
              },
              legend: {
                position: 'right',
              },
              size: chartSize,
            })
            fullScreenValue === true ? chart.resize({ height: 500, width: 1250 }) : ''
          
        }
      }
    return (
      <>
        <div id={`chart${uniqueIndex}`} />
      </>
    );
}

export default DonutChart
