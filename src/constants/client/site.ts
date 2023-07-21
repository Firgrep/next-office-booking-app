export const ICON_SIZE_SM = 20; // in pixels

export const REFUND_TIME_LIMIT = 172_800_000; // in milliseonds

// * See tailwind.config.ts for the implementation of these colors.
// const customBlack = "#0a1121"
// const customBrown = "#863a12"
// const customPink = "#f68961"
// const customYellow = "#febe6b"
// const customLightPink = "#ffc9a7"
// const customGray = "#efefe9"

export const siteConfig = {
    companyName: "Rokni Office",
    webpageTagline: "The Modern Office",
    imgUrls: {
        conferenceRoom: "https://storage.cloud.google.com/rokni-office-media/conference-room.jpg?authuser=3",
        businessPeople: "https://storage.cloud.google.com/rokni-office-media/business-people.jpg?authuser=3",
        placeholder: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/07/dog-photo-tips-1.jpg",
    },
    colors: {
        nav: "bg-custom-black",
        navText: "text-custom-yellow",
        footer: "bg-custom-black",
        footerText: "text-custom-yellow",
        main: "bg-custom-gray",
    },
    price: {
        subscriptions: {
            pro: "30",
            plusConference: "25",
            plusPhone: "25",
            basic: "20",
            flexPay: "0",
        },
    },
}

// at end of conference room imgae ?authuser=3