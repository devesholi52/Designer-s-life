// Usage ::::
// url = https://lifeofdesigner.keycorp.in://home/:message    {message is the second perameter}
// url = lifeofdesigner://home/:message    {message is the second perameter}

export default {
    // The prefix name will be used to find the route name ---->
    prefixes: ['https://lifeofdesigner.keycorp.in://', 'lifeofdesigner://'],
    config: {
        // adding configurations for the screens
        screens: {
            Feed: {
                screens: {
                    Home: {
                        screens: {
                            HomeScreen: {
                                path: 'home/:message',
                                parse: {
                                    message: message => `${message}`,
                                },
                            },
                            ProductDetailScreen: {
                                path: 'ProductDetailScreen/:deeplinkId',
                                parse: {
                                    message: deeplinkId => `${deeplinkId}`,
                                },
                            },
                        }
                    },
                    Deal: {
                        // screens: {
                        //     SearchNew: {
                        //         path: 'SearchNew',
                        //     },
                        //     ProductDetailsDeal: {
                        //         path: 'ProductDetailsDeal',
                        //     }
                        // }
                    },
                }
            }
        },
    },
};