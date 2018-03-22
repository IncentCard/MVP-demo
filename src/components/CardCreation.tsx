import * as React from "react";
import { CardTypes } from "../backend";
import { CardCreationButton } from "./CardCreationButton";

// tslint:disable:max-line-length

export interface CardCreationProperties {
    userToken: string;
    onCardCreated(cardToken: string, type: CardTypes): void;
}

export class CardCreation extends React.Component<CardCreationProperties, {}> {

    public render() {
        if (!this.props.userToken) {
            return null;
        } else {
            return (
                <div id="card-div">
                    <p>There are currently two card types to choose from! The PiggySaver&trade; card has a spending limit of $500 and grants
                        an industry leading 10% of your purchase value as PiggyBank Points&reg;!!! The FatCat&trade; card has an incredible
                        spending limit of $1000 at the cost of earning 100% less PiggyBank Points&reg;!!!!!
                    </p>
                    <CardCreationButton userToken={this.props.userToken} text="Create PiggySaver&trade; Card" cardType={CardTypes.piggy} onCardCreated={this.props.onCardCreated} />
                    <CardCreationButton userToken={this.props.userToken} text="Create FatCat&trade; Card" cardType={CardTypes.fatcat} onCardCreated={this.props.onCardCreated} />
                </div>
            );
        }
    }
}
