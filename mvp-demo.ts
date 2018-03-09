/*
 * This demo shows off simple versions of the MVP features
*/

// because I'm lazy and don't want to generate it every time
const authHeader: string = "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==";

// dumb way of storing values. Will need to be a secure database eventually
var cardProduct: any;
var fundingSource: any;
var user: any;
var card: any;
var cardType: any;
var velocity: any;
var rewardPoints: number = 0;

// the random number is so I can see if the page refreshes correctly or not
console.log("Starting! " + Math.random());

class CardProductTemplate {
    start_date;
    config;
    constructor(public name: string) {
        this.start_date = "2017-01-01";
        this.config = {
            "fulfillment": {
                "payment_instrument": "VIRTUAL_PAN"
            },
            "poi": {
                "ecommerce": true
            },
            "card_life_cycle": {
                "activate_upon_issue": true
            }
            // todo: figure out why this won't work with the simulation
            // ,
            // "transaction_controls": {
            //     "always_require_pin": true
            // }
        };
    }
}

const fundingSourceTemplate: object = {
    "name": "Program Funding"
};

enum CardTypes {
    piggy = "PiggySaver",
    fatcat = "FatCat"
}

// tslint:disable-next-line:interface-name
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
var piggyTempate: VelocityTemplate = {
    "usage_limit": 100,
    "amount_limit": 500,
    "velocity_window": "DAY",
    "association": {
        "card_product_token": "REPLACE"
    },
    "currency_code": "USD",
};

// the spending controls on the high end "Fat Cat Spender" card
var fatcatTempate: VelocityTemplate = {
    "usage_limit": 100,
    "amount_limit": 1000,
    "velocity_window": "DAY",
    "association": {
        "card_product_token": "REPLACE"
    },
    "currency_code": "USD",
};

function updateBalance(): void {
    $.ajax({
        url: "https://shared-sandbox-api.marqeta.com/v3/balances/" + user.token,
        type: "get",
        headers: {
            "Accept": "application/json",
            "Authorization": authHeader
        },
        dataType: "json",
        success: function (data: any): void {
            console.log(data);
            let gpa: any = data.gpa;
            $("#balance").text("The user's balance is: " + gpa.ledger_balance + " and available balance is: " + gpa.available_balance);
        }
    });
    $("#piggy-points").text(rewardPoints);
}

function createPin(pin: number): void {
    $.ajax({
        url: "https://shared-sandbox-api.marqeta.com/v3/pins/controltoken",
        type: "post",
        data: JSON.stringify({
            "card_token": card.token
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authHeader
        },
        dataType: "json",
        success: function (data: any): void {
            console.log(data);
            $.ajax({
                url: "https://shared-sandbox-api.marqeta.com/v3/pins",
                type: "put",
                data: JSON.stringify({
                    "control_token": data.control_token,
                    "pin": pin
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader
                },
                dataType: "json",
                success: function (data: any): void {
                    console.log(data);
                }
            });
        }
    });
}

function buildCard(type: CardTypes): void {
    let product: CardProductTemplate = new CardProductTemplate("Demo " + type + " card product");
    cardType = type;
    $.ajax({
        url: "https://shared-sandbox-api.marqeta.com/v3/cardproducts",
        type: "post",
        data: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authHeader
        },
        dataType: "json",
        success: function (data: any): void {
            console.log(data);
            cardProduct = data;
            $("#product-token").text("Card product token: " + cardProduct.token);
            let vel: VelocityTemplate;
            switch (type) {
                case CardTypes.piggy: {
                    vel = piggyTempate;
                    break;
                }
                case CardTypes.fatcat: {
                    vel = fatcatTempate;
                    break;
                }
                default: {
                    console.log("Whoops! You didn't match the enum!!");
                }
            }
            vel.association.card_product_token = cardProduct.token;
            let cardTemplate: object = {
                user_token: user.token,
                card_product_token: cardProduct.token
            };
            $.when(
                $.ajax({
                    url: "https://shared-sandbox-api.marqeta.com/v3/velocitycontrols",
                    type: "post",
                    data: JSON.stringify(vel),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": authHeader
                    },
                    dataType: "json",
                    success: function (data: any): void {
                        console.log(data);
                        velocity = data;
                    }
                }),
                $.ajax({
                    url: "https://shared-sandbox-api.marqeta.com/v3/cards",
                    type: "post",
                    data: JSON.stringify(cardTemplate),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": authHeader
                    },
                    dataType: "json",
                    success: function (data: any): void {
                        console.log(data);
                        card = data;
                        $("#card-token").text("Card token: " + card.token);
                        createPin(2460);
                    }
                })
            ).done((a1, a2) => {
                $("#spend-div").css("visibility", "visible");
            });
        }
    });
}

function transact(amount: number, pin: string): void {
    let template: object = {
        card_token: card.token,
        amount: amount,
        mid: "24601",
        pin: pin
    };
    $.ajax({
        url: "https://shared-sandbox-api.marqeta.com/v3/simulate/authorization",
        type: "post",
        data: JSON.stringify(template),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authHeader
        },
        dataType: "json",
        success: function (data: any): void {
            console.log(data);
            let transaction: any = data.transaction;
            if (transaction.state === "DECLINED") {
                alert(transaction.response.memo);
            } else {
                if (cardType === CardTypes.piggy) {
                    rewardPoints += (amount * .1);
                }
                updateBalance();
            }
        }
    });
}

function fundUser(amount: number): any {
    let template: object = {
        user_token: user.token,
        amount: amount,
        currency_code: "USD",
        funding_source_token: fundingSource.token
    };
    $.ajax({
        url: "https://shared-sandbox-api.marqeta.com/v3/gpaorders",
        type: "post",
        data: JSON.stringify(template),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authHeader
        },
        dataType: "json",
        success: function (data: any): void {
            console.log(data);
            updateBalance();
            $("#balances-button").css("visibility", "visible");
            $("#card-div").css("visibility", "visible");
        }
    });
}

$(document).ready(() => {
    console.log("Document ready");

    $("#piggy-button").click(() => {
        console.log("#piggy-button clicked!");
        buildCard(CardTypes.piggy);
    });

    $("#fatcat-button").click(() => {
        console.log("#fatcat-button clicked!");
        buildCard(CardTypes.fatcat);
    });

    $("#user-button").click(() => {
        console.log("#user-button clicked!");
        $.when(
            $.ajax({
                url: "https://shared-sandbox-api.marqeta.com/v3/users",
                type: "post",
                data: "{}",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader
                },
                dataType: "json",
                success: function (data: any): void {
                    console.log(data);
                    user = data;
                    $("#user-token").text("User token: " + user.token);
                }
            }),
            $.ajax({
                url: "https://shared-sandbox-api.marqeta.com/v3/fundingsources/program",
                type: "post",
                data: JSON.stringify(fundingSourceTemplate),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader
                },
                dataType: "json",
                success: function (data: any): void {
                    console.log(data);
                    fundingSource = data;
                }
            })
        ).done((a1, a2) => {
            $("#balance-div").css("visibility", "visible");
        });
    });

    $("#fund-button").click(() => {
        console.log("button clicked!");
        fundUser(100);
    });

    $("#balances-button").click(() => {
        console.log("update balance button clicked!");
        updateBalance();
    });

    $("#rewards-button").click(() => {
        console.log("rewards button clicked!");
        fundUser(rewardPoints);
    });

    $("#transaction-form").submit(function (): boolean {
        var values: any = {};
        $.each($(this).serializeArray(), function (i: number, field: any): void {
            values[field.name] = field.value;
        });
        let amount: number = Number(values.amount);
        let pin: string = values.pin;
        transact(amount, pin);
        $("#rewards-div").css("visibility", "visible");
        return false;
    });
});
