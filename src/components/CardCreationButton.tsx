import * as React from "react";
import * as Backend from "../backend";

export interface CardCreationButtonProps {
    text: string;
    cardType: Backend.CardTypes;
    userToken: string;
    onCardCreated(cardToken: string, cardType: Backend.CardTypes): void;
}

export class CardCreationButton extends React.Component<CardCreationButtonProps, {}> {
    constructor(props: CardCreationButtonProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    public onClick(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();
        Backend.buildCard(this.props.cardType, this.props.userToken).then((cardToken) => {
            this.props.onCardCreated(cardToken, this.props.cardType);
        });
    }

    public render() {
        return (
            <button onClick={this.onClick}>{this.props.text}</button>
        );
    }
}
