import * as React from "react";
import * as Backend from "../backend";

export interface UserBalanceProps {
    fundUser(amount: number): void;
}

export class FundUser extends React.Component<UserBalanceProps, {}> {
    constructor(props: UserBalanceProps) {
        super(props);
    }

    public handleClick = (e: React.MouseEvent<HTMLElement>): void => {
        e.preventDefault();
        this.props.fundUser(100);
    }

    public render() {
        return (
            <button onClick={this.handleClick}>Add $100</button>
        );
    }
}
