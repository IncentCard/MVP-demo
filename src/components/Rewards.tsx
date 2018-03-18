import * as React from "react";

export interface RewardsProps {
    rewardsPoints: number;
    spendRewards(amount: number): void;
}

export class Rewards extends React.Component<RewardsProps, {}> {
    constructor(props: RewardsProps) {
        super(props);
        this.claimAllRewards = this.claimAllRewards.bind(this);
    }

    public claimAllRewards(): void {
        this.props.spendRewards(this.props.rewardsPoints);
    }

    public render() {
        if (!this.props.rewardsPoints) {
            return null;
        } else {
            return (
                <div id="rewards-div">
                    <h2>Rewards Center</h2>
                    <p>PiggyBank Points&reg; earned: {this.props.rewardsPoints}</p>
                    <button onClick={this.claimAllRewards}>Claim Rewards</button>
                </div>
            );
        }

    }
}
