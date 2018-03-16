import * as React from "react";
import * as Backend from "../backend";
import { UserBalance } from "./UserBalance";

export interface UserCreationState {
    userToken?: string;
    user?: any;
    fundingSource?: any;
}

export interface UserCreationProps {
    updateUserToken(token: string): void;
}

export class UserCreation extends React.Component<UserCreationProps, UserCreationState> {
    constructor(props: any) {
        super(props);
        this.state = { userToken: "Please click the button below to create a user" };
        this.createUser = this.createUser.bind(this);
    }

    public createUser(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();
        Backend.createUser().then((user) => {
            this.setState((prevState, props) => {
                props.updateUserToken(user.token);
                return {
                    fundingSource: prevState.fundingSource,
                    user,
                    userToken: "User token: " + user.token,
                };
            });
        });
        Backend.createFundingSource().then((fundingSource) => {
            this.setState((prevState, props) => {
                return {
                    fundingSource,
                    user: prevState.user,
                    userToken: prevState.userToken,
                };
            });
        });
    }

    public render() {
        return (
            <div>
                <p>{this.state.userToken}</p>
                <button onClick={this.createUser}>Create a User</button>
                <UserBalance fundingSource={this.state.fundingSource} user={this.state.user} />
            </div>
        );
    }
}
