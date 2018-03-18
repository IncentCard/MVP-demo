import * as React from "react";
import { CardTypes } from "./backend";
import { CardCreation } from "./components/CardCreation";
import { Rewards } from "./components/Rewards";
import { Spend } from "./components/Spend";
import { UserCreation } from "./components/UserCreation";
import { UserBalance } from "./components/UserBalance";
import * as Backend from "./backend";

export interface RootState {
    userToken?: string;
    cardToken?: string;
    cardType?: CardTypes;
    rewardPoints?: number;
    userBalance?: string;
    fundingSourceToken?: string;
}

export class Root extends React.Component<{}, RootState> {
    constructor(props) {
        super(props);
        this.state = {rewardPoints: 0};
        this.updateCardToken = this.updateCardToken.bind(this);
        this.updateUserToken = this.updateUserToken.bind(this);
        this.transact = this.transact.bind(this);
        this.updateFundingSourceToken = this.updateFundingSourceToken.bind(this);
        this.updateBalance = this.updateBalance.bind(this);
        this.spendRewards = this.spendRewards.bind(this);
    }

    public updateUserToken(token: string): void {
        this.setState((prevState, props) => {
            return {
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
            };
        });
    }

    public transact(amount: number) {
        this.updateBalance();
        this.setState((prevState, props) => {
            return {
                rewardPoints: (prevState.rewardPoints) + (amount * 0.1),
            };
        });
    }

    public updateFundingSourceToken(token: string): void {
        this.setState(() => {
            return { fundingSourceToken: token };
        })
    }

    public updateBalance(): void {
        Backend.updateBalance(this.state.userToken).then((userBalance) => {
            this.setState(() => {
                return { userBalance };
            });
        });
    }

    public fundUser(amount: number): void {
        Backend.fundUser(amount, this.state.userToken, this.state.fundingSourceToken).then(() => {
            this.updateBalance();
        });
    }

    public spendRewards(amount: number): void {
        this.fundUser(this.state.rewardPoints);
        this.setState(() => {
            return { rewardPoints: 0 }
        })
    }

    public render() {
        return (
            <div>
                <UserCreation updateUserToken={this.updateUserToken} updateFundingSourceToken={this.updateFundingSourceToken}/>
                <UserBalance updateBalance={this.updateBalance} fundUser={this.fundUser} balance={this.state.userBalance}/>
                <CardCreation userToken={this.state.userToken} updateCardToken={this.updateCardToken} />
                <Spend cardToken={this.state.cardToken} transact={this.transact} />
                <Rewards rewardsPoints={this.state.rewardPoints} spendRewards={this.spendRewards}/>
            </div>
        );
    }
}
