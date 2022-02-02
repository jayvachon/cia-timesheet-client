import logo from './logo.svg';
import './App.css';
import store from './store'
import {Provider} from 'react-redux'
import HourColumn from './HourColumn'
import PeriodSelector from './PeriodSelector'
import {Component} from 'react'

class App extends Component {

  constructor(props) {
    
    super(props)
    this.state = {
      selectedPayPeriod: '',
      periodLabels: [],
      payPeriods: {
        previous: [],
        current: [],
      },
      completed: false,
    }

  }

  componentDidMount() {
    this.getPayPeriods = this.getPayPeriods.bind(this)
    this.selectPayPeriod = this.selectPayPeriod.bind(this)
    this.completeTimesheet = this.completeTimesheet.bind(this)
    this.getPayPeriods()
  }

  getPayPeriods() {
    return fetch(`https://codeimmersivesadmissions.website/timesheet/api/pay-periods`, {
        crossDomain: true,
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(res => {
      return res.json()
      
    })
    .then(json => {
      const periods = json;

      this.setState({
        payPeriods: {
          previous: {
            label: `${periods.previous[0].date} - ${periods.previous[periods.previous.length-1].date} (Previous)`,
            dates: periods.previous,
          },
          current: {
            label: `${periods.current[0].date} - ${periods.current[periods.current.length-1].date} (Current)`,
            dates: periods.current,
          },
        }
      })

      let periodLabels = [];
      periodLabels.push({
        value: 'previous',
        label: this.state.payPeriods.previous.label,
      })
      periodLabels.push({
        value: 'current',
        label: this.state.payPeriods.current.label,
      })

      this.setState({
        periodLabels,
        selectedPayPeriod: this.state.payPeriods.current,
      })
      
      return periods
    })
    .catch(err => {
        console.log(err)
    })
  }

  selectPayPeriod(value) {
    this.setState({
      selectedPayPeriod: this.state.payPeriods[value.value]
    })
  }

  completeTimesheet() {
    this.setState({ completed: true })
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div className="container">
            <header className="App-header">
              <h1>Code Immersives Timesheet</h1>
            </header>
              {this.state.completed &&
                <section>
                  <p>Your timesheet has been successfully submitted! A copy has been sent to Anthony for payroll. The downloaded PDF is for your records.</p>
                </section>
              }
              {!this.state.completed &&
                <section>
                  <PeriodSelector
                    value={this.state.selectedPayPeriod}
                    options={this.state.periodLabels}
                    callback={this.selectPayPeriod}
                  />
                  <HourColumn
                    payPeriod={this.state.selectedPayPeriod}
                    callback={this.completeTimesheet}/>
                </section>
              }
          </div>
        </div>
      </Provider>
    )
  }
}

export default App;
