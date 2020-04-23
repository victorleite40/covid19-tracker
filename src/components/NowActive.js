import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class Chart extends Component {
  render() {
    return (
      <div className="nowActiveChart">
        <h1>Casos Ativos Simultâneos</h1>
        <Line
          data={{
            labels: this.props.labelDate,
            datasets: [
              {
                label: 'Número de Casos Ativos',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(209, 148, 25,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(209, 148, 25,1)',
                hoverBorderColor: 'rgba(209, 148, 25,1)',
                data: this.props.activeData
              }
            ]
          }}
          width={100}
          height={35}
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