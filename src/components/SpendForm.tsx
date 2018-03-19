import * as React from "react";
import * as Backend from "../backend";

export interface SpendFormProps {
    transact(amount: number, pin: string);
}

export interface SpendFormState {
    amount: number;
    pin: string;
}

export class SpendForm extends React.Component<SpendFormProps, SpendFormState> {
    constructor(props) {
        super(props);
        this.state = {amount: 10, pin: "2460"};
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleChangePin = this.handleChangePin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleChangeAmount(event) {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                amount: value,
            };
        });
    }

    public handleChangePin(event) {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                pin: value,
            };
        });
    }

    public handleSubmit(event) {
        event.preventDefault();
        this.props.transact(this.state.amount, this.state.pin);
    }

    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                Amount:
                <input type="text" name="amount" value={this.state.amount} onChange={this.handleChangeAmount} />
                <br/>
                PIN:
                <input type="text" name="pin" value={this.state.pin} onChange={this.handleChangePin}/>
                <br />
                <input type="submit" value="Spend!" />
            </form>
        );
    }
}
