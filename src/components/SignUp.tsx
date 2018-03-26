import * as React from "react";
import * as Backend from "../backend";
import { CreatedUserData, SignUpForm } from "./SignUpForm";

export interface SignUpProps {
    onUserCreated();
}

export interface SignUpState {
    createdAccounts: CreatedUserData[];
}

export class SignUp extends React.Component<SignUpProps, SignUpState> {
    constructor(props: SignUpProps) {
        super(props);
        this.state = {createdAccounts: []};
    }

    public handleUserCreated = (data: CreatedUserData) => {
        let createUser: boolean = true;
        this.state.createdAccounts.forEach((item) => {
            if (createUser && (data.ssn === item.ssn || data.userName === item.userName)) {
                alert("User name or SSN is already registered with IncentCard");
                createUser = false;
            }
        });

        if (!createUser) {
            return;
        }

        this.setState((prevState, props) => {
            const accounts = prevState.createdAccounts;
            accounts.push(data);
            return {
                createdAccounts: accounts,
            };
        });
        this.props.onUserCreated();
    }

    public render() {
        return (
            <div>
                <SignUpForm onUserRegistered={this.handleUserCreated} />
            </div>
        );
    }
}
