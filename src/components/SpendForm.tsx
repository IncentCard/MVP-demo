import * as React from "react";
import * as Backend from "../backend";

export interface SpendFormProps {
    cardToken: string;
    onTransactionComplete(amount: number);
}

export interface SpendFormState {
    amount: number;
    pin: string;
}

export class SpendForm extends React.Component<SpendFormProps, SpendFormState> {
    constructor(props) {
        super(props);
        this.state = {amount: 10, pin: "2460"};
    }

    public handleChangeAmount = (event): void => {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                amount: value,
            };
        });
    }

    public handleChangePin = (event): void => {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                pin: value,
            };
        });
    }

    public handleSubmit = (event): void => {
        event.preventDefault();
        this.transact(this.state.amount, this.props.cardToken, this.state.pin);
    }

    public transact(amount: number, cardToken: string, pin: string = "2460") {
        Backend.transact(amount, cardToken, pin).then(() => {
            this.props.onTransactionComplete(amount);
        });
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
