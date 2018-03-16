import * as React from "react";
import * as Backend from "../backend";

export interface SpendFormProps {
    cardToken: string;
    transact(amount: number);
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
        this.setState((prevState, props) => {
            return {
                amount: event.target.value,
                pin: prevState.pin,
            };
        });
    }

    public handleChangePin(event) {
        this.setState((prevState, props) => {
            return {
                amount: prevState.amount,
                pin: event.target.value,
            };
        });
    }

    // todo: make this refresh the user balance
    public handleSubmit(event) {
        event.preventDefault();
        Backend.transact(this.state.amount, this.state.pin, this.props.cardToken)
            .then(() => this.props.transact(this.state.amount));
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
