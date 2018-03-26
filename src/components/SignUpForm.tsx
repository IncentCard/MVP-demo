import * as React from "react";
import * as Backend from "../backend";

export interface CreatedUserData {
    ssn: number;
    userName: string;
}

export interface SignUpFormProps {
    onUserRegistered(data: CreatedUserData);
}

export interface SignUpFormState {
    userName: string;
    ssn: number;
}

export class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
    constructor(props: SignUpFormProps) {
        super(props);
        this.state = {
            ssn: undefined,
            userName: "",
        };
    }

    public handleChangeUserName = (event): void => {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                userName: value,
            };
        });
    }

    public handleChangeSsn = (event): void => {
        const value = event.target.value;
        this.setState((prevState, props) => {
            return {
                ssn: value,
            };
        });
    }

    public handleSubmit = (event): void => {
        event.preventDefault();
        this.props.onUserRegistered({
            ssn: this.state.ssn,
            userName: this.state.userName,
        });
    }

    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                User Name:<br/>
                <input type="text" name="userName" value={this.state.userName} onChange={this.handleChangeUserName} />
                <br/>
                SSN:<br/>
                <input type="number" name="ssn" onChange={this.handleChangeSsn}/>
                <br />
                <input type="submit" value="Create Account" />
            </form>
        );
    }
}
