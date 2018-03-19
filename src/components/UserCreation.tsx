import * as React from "react";
import * as Backend from "../backend";
import { UserBalance } from "./UserBalance";

export interface UserCreationState {
    userTokenText?: string;
}

export interface UserCreationProps {
    updateUserToken(token: string): void;
    updateFundingSourceToken(token: string): void;
}

export class UserCreation extends React.Component<UserCreationProps, UserCreationState> {
    constructor(props: any) {
        super(props);
        this.state = { userTokenText: "Please click the button below to create a user" };
        this.createUser = this.createUser.bind(this);
    }

    public createUser(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();
        Backend.createUser().then((user) => {
            this.setState((prevState, props) => {
                props.updateUserToken(user.token);
                return {
                    userTokenText: "User token: " + user.token,
                };
            });
        });
        Backend.createFundingSource().then((fundingSource) => {
            this.props.updateFundingSourceToken(fundingSource.token);
        });
    }

    public render() {
        return (
            <div>
                <p>{this.state.userTokenText}</p>
                <button onClick={this.createUser}>Create a User</button>
            </div>
        );
    }
}
