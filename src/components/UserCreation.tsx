import * as React from "react";
import * as Backend from "../backend";

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
        this.state = { userTokenText: "Please click the button below to create a user" };
    }

    public handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
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
                <button onClick={this.handleClick}>Create a User</button>
            </div>
        );
    }
}
