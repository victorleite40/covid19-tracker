import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

import './styles.css';

const options = {
	legend: {
		display: true,
		position: 'bottom'
	}
}

export default class Chart extends Component {
  render() {
    return (
      <div className={"statsChart" + this.props.page} >
        <h2>{this.props.title + " Statistics (%)" }</h2>
		<Doughnut width={100} height={77} 
			data={{
				labels: [
					'Active',
					'Recovered',
					'Fatal'
				],
				datasets: [{
					data: [this.props.activeStats , this.props.recoveredStats, this.props.fatalStats],
					backgroundColor: [
						'#EEAF1E',
						'#5AC923',
						'#575757'
					],
					hoverBackgroundColor: [
						'#EEAF1E',
						'#5AC923',
						'#575757'
					]
				}]
			}} 
		options={options} />
      </div>
    );
  }
};