import * as React from "react";
import * as Backend from "./backend";
import { CardCreation } from "./components/CardCreation";
import { FundUser } from "./components/FundUser";
import { Rewards } from "./components/Rewards";
import { Spend } from "./components/Spend";
import { UserBalance } from "./components/UserBalance";
import { UserCreation } from "./components/UserCreation";

export interface RootState {
    userToken?: string;
    cardToken?: string;
    cardType?: Backend.CardTypes;
    rewardPoints?: number;
    userBalance?: string;
    fundingSourceToken?: string;
}

export class Root extends React.Component<{}, RootState> {
    constructor(props) {
        super(props);
        this.state = {rewardPoints: 0};
    }

    public handleUserCreated = (userToken: string): void => {
        this.setState((prevState, props) => {
            return {
                userBalance: "Add some money to the user's account!",
                userToken,
            };
        });
    }

    public handleFundingSourceCreate = (fundingSourceToken: string): void => {
        this.setState((prevState, props) => {
            return { fundingSourceToken };
        });
    }

    public handleCardCreated = (cardToken: string, cardType: Backend.CardTypes): void => {
        console.log("updating card token");
        this.setState((prevState, props) => {
            return {
                cardToken,
                cardType,
            };
        });
    }

    public handleTransactionComplete = (amount: number): void => {
        this.setState((prevState, props) => {
            const points = this.state.cardType === Backend.CardTypes.piggy ? prevState.rewardPoints + (amount * 0.1)
                 : prevState.rewardPoints;
            return {
                rewardPoints: points,
            };
        });
    }

    public updateBalance = (): void => {
        Backend.updateBalance(this.state.userToken).then((userBalance) => {
            this.setState(() => {
                return { userBalance };
            });
        });
    }

    public fundUser = (amount: number): void => {
        Backend.fundUser(amount, this.state.userToken, this.state.fundingSourceToken).then(() => {
            this.updateBalance();
        });
    }

    public spendRewards = (amount: number): void => {
        this.fundUser(this.state.rewardPoints);
        this.setState(() => {
            return { rewardPoints: 0 };
        });
    }

    public render() {
        return (
            <div>
                <UserCreation onUserCreated={this.handleUserCreated}
                    onFundingSourceCreated={this.handleFundingSourceCreate}/>
                <UserBalance updateBalance={this.updateBalance} balance={this.state.userBalance}>
                    <FundUser fundUser={this.fundUser}/>
                </UserBalance>
                <CardCreation userToken={this.state.userToken} onCardCreated={this.handleCardCreated} />
                <Spend cardToken={this.state.cardToken} onTransactionComplete={this.handleTransactionComplete} />
                <Rewards rewardsPoints={this.state.rewardPoints} spendRewards={this.spendRewards}/>
            </div>
        );
    }
}
