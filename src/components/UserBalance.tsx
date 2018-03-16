import * as React from "react";
import * as Backend from "../backend";

export interface UserBalanceProps {
    fundingSource: any;
    user: any;
}

export interface UserBalanceState {
    balance: string;
}

export class UserBalance extends React.Component<UserBalanceProps, UserBalanceState> {
    constructor(props: UserBalanceProps) {
        super(props);
        this.state = { balance: "Add some money to the user's account!" };
        this.updateBalance = this.updateBalance.bind(this);
        this.fundUser = this.fundUser.bind(this);
    }

    public updateBalance(): void {
        Backend.updateBalance(this.props.user.token).then((balance) => {
            this.setState((prevState, props) => {
                return { balance };
            });
        });
    }

    // todo: make this take a variable amount
    public fundUser(): void {
        Backend.fundUser(this.props.user.token, this.props.fundingSource.token).then(() => {
            this.updateBalance();
        });
    }

    public render() {
        if (this.props.fundingSource) {
            return (
                <div>
                    <p>{this.state.balance}</p>
                    <button onClick={this.fundUser}>Add $100</button>
                    <button onClick={this.updateBalance}>Update Balance</button>
                </div>
            );
        } else {
            return null;
        }
    }
}
