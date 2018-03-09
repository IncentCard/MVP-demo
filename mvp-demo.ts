/* 
 * This demo shows off simple versions of the MVP features
*/

// Because I'm lazy and don't want to generate it every time
const authHeader = 'Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==';

// Dumb way of storing values. Will need to be a secure database eventually
var cardProduct;
var fundingSource;
var user;
var card;
var cardType;
var velocity;
var rewardPoints = 0;

// The random number is so I can see if the page refreshes correctly or not
console.log('Starting! ' + Math.random());

class CardProductTemplate {
    start_date;
    config;
    constructor(public name: string) {
        this.start_date = '2017-01-01';
        this.config = {
            'fulfillment': {
                'payment_instrument': 'VIRTUAL_PAN'
            },
            'poi': {
                'ecommerce': true
            },
            'card_life_cycle': {
                'activate_upon_issue': true
            }
            //TODO: figure out why this won't work with the simulation
            // ,
            // 'transaction_controls': {
            //     'always_require_pin': true
            // }
        }
    }
}

const fundingSourceTemplate = {
    'name': 'Program Funding'
}

enum CardTypes {
    piggy = 'PiggySaver',
    fatcat = 'FatCat'
}

interface velocityTemplate {
    usage_limit?: number;
    amount_limit?: number;
    velocity_window?: string;
    association: {
        card_product_token: string;
    }
    currency_code?: string;
}

//The spending controls on the entry level "Piggy Saver" card
var piggyTempate: velocityTemplate = {
    "usage_limit": 100,
    "amount_limit": 500,
    "velocity_window": "DAY",
    "association": {
        "card_product_token": "REPLACE"
    },
    "currency_code": "USD",
}

//The spending controls on the high end "Fat Cat Spender" card
var fatcatTempate: velocityTemplate = {
    "usage_limit": 100,
    "amount_limit": 1000,
    "velocity_window": "DAY",
    "association": {
        "card_product_token": "REPLACE"
    },
    "currency_code": "USD",
}

function updateBalance() {
    $.ajax({
        url: 'https://shared-sandbox-api.marqeta.com/v3/balances/' + user.token,
        type: 'get',
        headers: {
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            let gpa = data.gpa;
            $('#balance').text("The user's balance is: " + gpa.ledger_balance + ' and available balance is: ' + gpa.available_balance);
        }
    });
    $('#piggy-points').text(rewardPoints);
}

function createPin(pin: number) {
    $.ajax({
        url: 'https://shared-sandbox-api.marqeta.com/v3/pins/controltoken',
        type: 'post',
        data: JSON.stringify({
            "card_token": card.token
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.ajax({
                url: 'https://shared-sandbox-api.marqeta.com/v3/pins',
                type: 'put',
                data: JSON.stringify({
                    "control_token": data.control_token,
                    "pin": pin
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': authHeader
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                }
            })
        }
    })
}

function buildCard(type: CardTypes) {
    let product = new CardProductTemplate('Demo ' + type + ' card product');
    cardType = type;
    $.ajax({
        url: 'https://shared-sandbox-api.marqeta.com/v3/cardproducts',
        type: 'post',
        data: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            cardProduct = data;
            $('#product-token').text('Card product token: ' + cardProduct.token);
            let vel: velocityTemplate;
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
            let cardTemplate = {
                user_token: user.token,
                card_product_token: cardProduct.token
            };
            $.when(
                $.ajax({
                    url: 'https://shared-sandbox-api.marqeta.com/v3/velocitycontrols',
                    type: 'post',
                    data: JSON.stringify(vel),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        velocity = data;
                    }
                }),
                $.ajax({
                    url: 'https://shared-sandbox-api.marqeta.com/v3/cards',
                    type: 'post',
                    data: JSON.stringify(cardTemplate),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        card = data;
                        $('#card-token').text('Card token: ' + card.token);
                        createPin(2460);
                    }
                })
            ).done((a1, a2) => {
                $('#spend-div').css('visibility', 'visible');
            })
        }
    });
}

function transact(amount: number, pin: string) {
    let template = {
        card_token: card.token,
        amount: amount,
        mid: '24601',
        pin: pin
    };
    $.ajax({
        url: 'https://shared-sandbox-api.marqeta.com/v3/simulate/authorization',
        type: 'post',
        data: JSON.stringify(template),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            let transaction = data.transaction;
            if (transaction.state == 'DECLINED') {
                alert(transaction.response.memo);
            } else {
                if (cardType == CardTypes.piggy) {
                    rewardPoints += (amount * .1);
                }
                updateBalance();
            }
        }
    });
}

function fundUser(amount: number) {
    let template = {
        user_token: user.token,
        amount: amount,
        currency_code: 'USD',
        funding_source_token: fundingSource.token
    };
    $.ajax({
        url: 'https://shared-sandbox-api.marqeta.com/v3/gpaorders',
        type: 'post',
        data: JSON.stringify(template),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            updateBalance();
            $('#balances-button').css('visibility', 'visible');
            $('#card-div').css('visibility', 'visible');
        }
    });
}

$(document).ready(function () {
    console.log('Document ready');

    $('#piggy-button').click(function () {
        console.log('#piggy-button clicked!');
        buildCard(CardTypes.piggy);
    });

    $('#fatcat-button').click(function () {
        console.log('#fatcat-button clicked!');
        buildCard(CardTypes.fatcat);
    });

    $('#user-button').click(function () {
        console.log('#user-button clicked!');
        $.when(
            $.ajax({
                url: 'https://shared-sandbox-api.marqeta.com/v3/users',
                type: 'post',
                data: '{}',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': authHeader
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    user = data;
                    $('#user-token').text('User token: ' + user.token);
                }
            }),
            $.ajax({
                url: 'https://shared-sandbox-api.marqeta.com/v3/fundingsources/program',
                type: 'post',
                data: JSON.stringify(fundingSourceTemplate),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': authHeader
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    fundingSource = data;
                }
            })
        ).done((a1, a2) => {
            $('#balance-div').css('visibility', 'visible');
        });
    });

    $('#fund-button').click(function () {
        console.log('button clicked!');
        fundUser(100);
    });

    $('#balances-button').click(function () {
        console.log('update balance button clicked!');
        updateBalance();
    });

    $('#rewards-button').click(function () {
        console.log('rewards button clicked!');
        fundUser(rewardPoints);
    });

    $('#transaction-form').submit(function() {
        var values = {};
        $.each($('#transaction-form').serializeArray(), function (i, field) {
            values[field.name] = field.value;
        });
        let amount: number = Number(values['amount']);
        let pin: string = values['pin']
        transact(amount, pin)
        $('#rewards-div').css('visibility', 'visible');
        return false;
    })
})
