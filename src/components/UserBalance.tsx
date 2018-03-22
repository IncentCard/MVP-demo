import * as React from "react";
import * as Backend from "../backend";
import { FundUser } from "./FundUser";

export interface UserBalanceProps {
    balance: string;
    updateBalance(): void;
}

export class UserBalance extends React.Component<UserBalanceProps, {}> {

    public render() {
        if (this.props.balance) {
            return (
                <div>
                    <p>{this.props.balance}</p>
                    <button onClick={this.props.updateBalance}>Update Balance</button>
                    {this.props.children}
                </div>
            );
        } else {
            return null;
        }
    }
}
