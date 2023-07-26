export const ICON_SIZE_SM = 20; // in pixels

export const REFUND_TIME_LIMIT = 172_800_000; // in milliseonds
export const REFUND_TIME_LIMIT_SHORTER = REFUND_TIME_LIMIT - 600_000 // minus 10-minutes to act as a buffer

// * See tailwind.config.ts for the implementation of these colors.
// const customBlack = "#0a1121"
// const customBrown = "#863a12"
// const customPink = "#f68961"
// const customYellow = "#febe6b"
// const customLightPink = "#ffc9a7"
// const customGray = "#efefe9"

export const siteConfig = {
    companyName: "Pocket Office",
    webpageTagline: "Office Booking App built in Next.js & TypeScript",
    webUrl: "https://next-office-booking-app-gdwefi7iga-ew.a.run.app",
    webImg: "https://firebasestorage.googleapis.com/v0/b/portfolio-d0330.appspot.com/o/next-office-booking-app%2Fnext-office-booking-app-social-media.png?alt=media&token=4f608d86-48a6-49a9-b5a0-fd1c397a7f70",
    imgUrls: {
        conferenceRoom: "https://storage.cloud.google.com/rokni-office-media/conference-room.jpg?authuser=3",
        businessPeople: "https://storage.cloud.google.com/rokni-office-media/business-people.jpg?authuser=3",
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
            pro: "40",
            plusConference: "25",
            plusPhone: "25",
            basic: "10",
            flexPay: "0",
        },
    },
}
