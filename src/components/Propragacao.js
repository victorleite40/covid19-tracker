import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class Chart extends Component {
  render() {
    return (
      <div className="virusSpreadChart">
        <h1>Gráfico de Propagação</h1>
        <Line
          data={{
            labels: this.props.labelDate,
            datasets: [
              {
                label: 'Confirmados',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(227, 34, 34,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(227, 34, 34,1)',
                hoverBorderColor: 'rgba(227, 34, 34,1)',
                data: this.props.confirmedData
              },
              {
                label: 'Fatais',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(55,55,55,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,75,75,1)',
                hoverBorderColor: 'rgba(75,75,75,1)',
                data: this.props.fatalData
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