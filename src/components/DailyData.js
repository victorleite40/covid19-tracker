import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export default class Chart extends Component {
  render() {
    return (
      <div className="nowActiveChart">
        <h1>Daily Cases</h1>
        <Bar
          data={{
            labels: this.props.labelDate,
            datasets: [
              {
                label: 'Recovered',
                fill: false,
                backgroundColor: '#8aeb63',
                borderColor: '#8aeb63',
                borderWidth: 1,
                hoverBackgroundColor: '#8aeb63',
                hoverBorderColor: '#8aeb63',
                data: this.props.recovered
              },
              {
                label: 'Fatal',
                fill: false,
                backgroundColor: '#757575',
                borderColor: '#757575',
                borderWidth: 1,
                hoverBackgroundColor: '#757575',
                hoverBorderColor: '#757575',
                data: this.props.fatal
              }
            ]
          }}
          width={100}
          height={33}
          options={
            { 
              maintainAspectRatio: true,
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  boxWidth: 5
                }              
              },
              tooltips: {
                legendColorBackground: 'rgba(75,75,75,1)',
                mode: 'index',
                intersect: false
              },
              hover: {
                mode: 'index',
                intersect: false
              }
            }
          }
        />
      </div>
    );
  }
};