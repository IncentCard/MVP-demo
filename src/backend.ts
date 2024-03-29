const authHeader: string = "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==";
const baseUrl: string = "https://shared-sandbox-api.marqeta.com/v3/";
export const plaidData = {
    clientId: "5a8e1e7abdc6a47debd6f00a",
    publicKey: "c1b6deae8714f517df6688a1c8f59e",
    secret: "cd56c87bd373f0f8c98e43a912da94",
};

const fundingSourceTemplate: object = {
    name: "Program Funding",
};

export enum CardTypes {
    piggy = "PiggySaver",
    fatcat = "FatCat",
}

export async function createUser(): Promise<any> {
    return await fetch(baseUrl + "users", {
        body: "{}",
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            return data;
        });
}

export async function createFundingSource(): Promise<any> {
    return await fetch(baseUrl + "fundingsources/program", {
        body: JSON.stringify(fundingSourceTemplate),
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            return data;
        });
}

export async function updateBalance(userToken: string): Promise<string> {
    return await fetch(baseUrl + "balances" + "/" + userToken, {
        headers: {
            Accept: "application/json",
            Authorization: authHeader,
        },
        method: "GET",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            const gpa: any = data.gpa;
            return "The user's balance is: " +
                gpa.ledger_balance +
                " and available balance is: " +
                gpa.available_balance;
        });
}

export async function fundUser(amount: number, userToken: string, fundingSourceToken: string): Promise<void> {
    const template: object = {
        amount,
        currency_code: "USD",
        funding_source_token: fundingSourceToken,
        user_token: userToken,
    };

    return fetch(baseUrl + "gpaorders", {
        body: JSON.stringify(template),
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
}

class CardProductTemplate {
    // tslint:disable-next-line:variable-name
    public start_date: string;
    public config: object;
    constructor(public name: string) {
        this.start_date = "2017-01-01";
        this.config = {
            card_life_cycle: {
                activate_upon_issue: true,
            },
            fulfillment: {
                payment_instrument: "VIRTUAL_PAN",
            },
            poi: {
                ecommerce: true,
            },
            // todo: figure out why this won't work with the simulation
            // ,
            // "transaction_controls": {
            //     "always_require_pin": true
            // }
        };
    }
}

export interface CardData {
    cardProduct?: any;
    type: CardTypes;
}

interface VelocityTemplate {
    usage_limit?: number;
    amount_limit?: number;
    velocity_window?: string;
    association: {
        card_product_token: string;
    };
    currency_code?: string;
}

// the spending controls on the entry level "Piggy Saver" card
const piggyTemplate: VelocityTemplate = {
    amount_limit: 500,
    association: {
        card_product_token: "REPLACE",
    },
    currency_code: "USD",
    usage_limit: 100,
    velocity_window: "DAY",
};

// the spending controls on the high end "Fat Cat Spender" card
const fatCatTemplate: VelocityTemplate = {
    amount_limit: 1000,
    association: {
        card_product_token: "REPLACE",
    },
    currency_code: "USD",
    usage_limit: 100,
    velocity_window: "DAY",
};

function createVelocityControls(type: CardTypes, cardProductToken: string): void {
    let vel: VelocityTemplate;
    switch (type) {
        case CardTypes.piggy: {
            vel = piggyTemplate;
            break;
        }
        case CardTypes.fatcat: {
            vel = fatCatTemplate;
            break;
        }
        default: {
            console.log("Whoops! You didn't match the enum!!");
        }
    }
    vel.association.card_product_token = cardProductToken;

    (async () => {
        await fetch(baseUrl + "velocitycontrols", {
            body: JSON.stringify(vel),
            headers: {
                "Accept": "application/json",
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    })();
}

function createPin(pin: number, cardToken: string): void {
    (async () => {
        await fetch(baseUrl + "pins/controltoken", {
            body: JSON.stringify({
                card_token: cardToken,
            }),
            headers: {
                "Accept": "application/json",
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetch(baseUrl + "pins", {
                    body: JSON.stringify({
                        control_token: data.control_token,
                        pin,
                    }),
                    headers: {
                        "Accept": "application/json",
                        "Authorization": authHeader,
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then((response) => console.log("Created PIN"));
            });
    })();
}

async function createCard(userToken: string, cardProductToken: string): Promise<any> {
    const cardTemplate: object = {
        card_product_token: cardProductToken,
        user_token: userToken,
    };

    return await fetch(baseUrl + "cards", {
        body: JSON.stringify(cardTemplate),
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            createPin(2460, data.token);
            return data;
        });
}

export async function buildCard(type: CardTypes, userToken: string): Promise<string> {
    const product: CardProductTemplate = new CardProductTemplate("Demo " + type + " card product");
    return fetch(baseUrl + "cardproducts", {
        body: JSON.stringify(product),
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            createVelocityControls(type, data.token);
            return createCard(userToken, data.token)
                .then((card) => {
                    return card.token;
                });
        });
}

export async function transact(amount: number, cardToken: string, pin: string): Promise<void> {
    const template: object = {
        amount,
        card_token: cardToken,
        mid: "24601",
        pin,
    };
    return fetch(baseUrl + "simulate/authorization", {
        body: JSON.stringify(template),
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader,
            "Content-Type": "application/json",
        },
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            const transaction: any = data.transaction;
            if (transaction.state === "DECLINED") {
                alert(transaction.response.memo);
            }
            // todo: deny rewards points for failed transactions
        });
}
