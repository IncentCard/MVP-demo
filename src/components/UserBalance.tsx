import * as React from "react";
import * as Backend from "../backend";

export interface UserBalanceProps {
    balance: string;
    updateBalance(): void;
    fundUser(amount: number): void;
}

export class UserBalance extends React.Component<UserBalanceProps, {}> {
    constructor(props: UserBalanceProps) {
        super(props);
        this.fundUser = this.fundUser.bind(this);
    }

    public fundUser(): void {
        this.props.fundUser(100);
    }

    public render() {
        if (this.props.balance) {
            return (
                <div>
                    <p>{this.props.balance}</p>
                    <button onClick={this.fundUser}>Add $100</button>
                    <button onClick={this.props.updateBalance}>Update Balance</button>
                </div>
            );
        } else {
            return null;
        }
    }
}
