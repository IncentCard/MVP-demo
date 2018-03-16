import * as React from "react";

export interface RewardsProps {
    rewardsPoints: number;
}

export class Rewards extends React.Component<RewardsProps, {}> {

    // todo: make the claim rewards button work
    public render() {
        return (
            <div id="rewards-div">
                <h2>Rewards Center</h2>
                <p>PiggyBank Points&reg; earned: {this.props.rewardsPoints}</p>
                <button id="rewards-button">Claim Rewards</button>
            </div>
        );
    }
}
