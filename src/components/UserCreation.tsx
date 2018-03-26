import * as React from "react";
import * as Backend from "../backend";
import { SignUp } from "./SignUp";

export interface UserCreationState {
    userTokenText?: string;
}

export interface UserCreationProps {
    onUserCreated(userToken: string): void;
    onFundingSourceCreated(fundingSourceToken: string): void;
}

export class UserCreation extends React.Component<UserCreationProps, UserCreationState> {
    constructor(props: any) {
        super(props);
        this.state = { userTokenText: "Please fill out the form below to create a user" };
    }

    public handleUserRegistered = () => {
        this.createUser();
    }

    public createUser(): void {
        Backend.createUser().then((user) => {
            this.props.onUserCreated(user.token);
            this.setState((prevState, props) => {
                return {
                    userTokenText: "User token: " + user.token,
                };
            });
        });
        Backend.createFundingSource().then((fundingSource) => {
            this.props.onFundingSourceCreated(fundingSource.token);
        });
    }

    public render() {
        return (
            <div>
                <p>{this.state.userTokenText}</p>
                <SignUp onUserCreated={this.handleUserRegistered} />
            </div>
        );
    }
}
