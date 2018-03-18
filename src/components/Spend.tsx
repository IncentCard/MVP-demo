import * as React from "react";
import { SpendForm } from "./SpendForm";

export interface SpendProps {
    cardToken: string;
    transact(amount: number);
}

export class Spend extends React.Component<SpendProps, {}> {

    public render() {
        if (!this.props.cardToken) {
            return null;
        } else {
            return (
                <div id="spend-div">
                    <h1>Time to spend money!!!</h1>
                    <p>Card token: {this.props.cardToken}</p>
                    <SpendForm transact={this.props.transact} />
                </div>
            );
        }
    }
}
