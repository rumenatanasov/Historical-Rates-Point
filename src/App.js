import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';

const accessKey = 'b90bc3717c837dcdbcb690f3d7e8c4a0';
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      startDate: moment().toDate(),
      fromCurrency: "",
      currencies: [],
      result: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    axios
      .get(`http://data.fixer.io/api/symbols?access_key=${accessKey}`)
      .then(response => {
        let symbols = Object.keys(response.data.symbols)
        this.setState({ currencies: symbols});
      })
      .catch(err => {
        console.log("oppps", err);
      });
  }
  handleChange(date) {
    this.setState({
      startDate: date
    })
  }

  convertHandler = () => {
    let formatDate = moment(this.state.startDate).format('YYYY-MM-DD')
    axios
      .get(
        `http://data.fixer.io/api/${formatDate}?access_key=${accessKey}&symbols=${this.state.fromCurrency}`
      )
      .then(response => {
        let result = Number(Object.values(response.data.rates))
        this.setState({result: result.toFixed(5)})
        console.log(response)
      })
      .catch(error => {
        console.log("Opps", error.message);
      });

  };
  selectHandler = (event) => {
    if(event.target.name === 'from') {
      this.setState({ fromCurrency: event.target.value })
    } 

    if(event.target.name === 'currency') {
      this.setState({anotherCurrency: event.target.value})
    }
    
  };

  render() {
    return (
      <div className="container">
        <h3>Historical rates endpoint</h3>
          <div className="form-group">
            <label>Select Date: </label>
            <DatePicker
              maxDate={new Date(Date.now())}
              selected={this.state.startDate}
              onChange={this.handleChange}
              name="startDate"
              dateFormat="y-MM-dd"
            />
          </div>
          <div>Base currency: EUR</div>
          <select
            name="from"
            onChange={event => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))} 
          </select>
          <div>
          <button onClick={this.convertHandler}>Convert</button>
          <h1>{this.state.result}</h1>
          </div>
      </div>
    );
  }
}

export default App;