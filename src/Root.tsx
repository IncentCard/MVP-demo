import * as React from "react";
import { CardTypes } from "./backend";
import { CardCreation } from "./components/CardCreation";
import { Rewards } from "./components/Rewards";
import { Spend } from "./components/Spend";
import { UserCreation } from "./components/UserCreation";

export interface RootState {
    userToken?: string;
    cardToken?: string;
    cardType?: CardTypes;
    rewardPoints?: number;
}

export class Root extends React.Component<{}, RootState> {
    constructor(props) {
        super(props);
        this.state = {rewardPoints: 0};
        this.updateCardToken = this.updateCardToken.bind(this);
        this.updateUserToken = this.updateUserToken.bind(this);
        this.transact = this.transact.bind(this);
    }

    public updateUserToken(token: string): void {
        this.setState((prevState, props) => {
            return {
                cardToken: prevState.cardToken,
                cardType: prevState.cardType,
                rewardPoints: prevState.rewardPoints,
                userToken: token,
            };
        });
    }

    public updateCardToken(token: string, type: CardTypes): void {
        console.log("updating card token");
        this.setState((prevState, props) => {
            return {
                cardToken: token,
                cardType: type,
                rewardPoints: prevState.rewardPoints,
                userToken: prevState.userToken,
            };
        });
    }

    public transact(amount: number) {
        this.setState((prevState, props) => {
            return {
                cardToken: prevState.cardToken,
                cardType: prevState.cardType,
                rewardPoints: prevState.rewardPoints + (amount * 0.1),
                userToken: prevState.userToken,
            };
        });
    }

    public render() {
        return (
            <div>
                <UserCreation updateUserToken={this.updateUserToken} />
                <CardCreation userToken={this.state.userToken} updateCardToken={this.updateCardToken}/>
                <Spend cardToken={this.state.cardToken} transact={this.transact}/>
                <Rewards rewardsPoints={this.state.rewardPoints}/>
            </div>
        );
    }
}
