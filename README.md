[![Linkedin](https://img.shields.io/badge/style--5eba00.svg?label=Thomas%20Mercuriot&logo=linkedin&style=social)](https://www.linkedin.com/in/thomasmercuriot/ "Let's connect on Linkedin !")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=20-blue?logo=node.js&logoColor=green)](https://nodejs.org "Go to Node.js homepage")
[![Made with React](https://badgen.net/static/React/%3E=17/blue)](https://react.dev "Go to React homepage")
![Last Commit](https://badgen.net/github/last-commit/thomasmercuriot/react-flight-radar)
![GitHub contributors](https://img.shields.io/github/contributors/thomasmercuriot/react-flight-radar)
![maintained - no](https://img.shields.io/badge/maintained-no-red)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue)

# Live Flight Tracking Web Application

## Introduction

This is the front-end component of my first personal full-stack project — a live flight tracking application inspired by one of my favorite apps : [FlightRadar24](https://www.flightradar24.com). As a passionate aviation enthusiast and aspiring developer, I embarked on this project to combine my interests in planes and coding ! :airplane:

Originally, I envisioned this as a front-end only project to test my knowledge after completing both Meta's [React Basics](https://coursera.org/verify/TLY5F2KZEV3S) and [Advanced React](https://coursera.org/verify/S3A3TA4QGEDD) courses. However, I soon discovered that accessing live flight data via API services was costly, leading me to explore alternatives, and after some research, I ventured into web scraping to obtain real-time data. Scraping data directly in the client-side React app proved to be problematic due to security restrictions around **CORS** (Cross-Origin Resource Sharing)[^1] and limitations around client-side requests. With these restrictions, the browser blocks direct requests to many servers for security reasons, making client-side scraping unfeasible. This led me to realize that I’d need a back-end component to handle data requests.

[^1]: [Wikipedia : CORS (Cross-Origin Resource Sharing)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

> [!WARNING]
> Web scraping is generally not recommended for several reasons :
>
> 1. **Legal and Ethical Concerns** : Many websites have terms of service that explicitly prohibit scraping, and scraping without permission can violate these terms, leading to potential legal action.
> 2. **Server Load** : Scraping can place a significant load on a website's server, potentially disrupting service for other users or even leading to IP bans if the site detects excessive requests.
> 3. **Data Integrity** : Websites can change their structure or data format at any time, which may break your scraping logic and lead to inaccurate or incomplete data.
>
> This code is intended for educational purposes only, as part of a personal project to practice and improve programming skills. This application is not intended for public use. If you plan to scrape data for more than personal use, it's highly recommended to seek permission from the website owner or use official APIs if available.

Since I’d only worked with [Ruby on Rails](https://rubyonrails.org) at that point, I figured this was the perfect opportunity to try out something new and more widely applicable. I chose [Node.js](https://nodejs.org) and [Express.js](https://expressjs.com) to build my own API because I was already familiar with [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and Express offers a straightforward way to create APIs. Developing my own API has not only expanded my technical skills but also given me invaluable experience with JavaScript on both the client and server sides.

You can check out the back-end repository [here](https://github.com/thomasmercuriot/node-flight-radar).

With a working back-end in place, I returned to developing the front-end, eager to apply my React skills. However, as my API relies heavily on web scraping, I found myself sometimes dealing with inconsistent or incorrect data. To handle these scenarios more efficiently and prevent runtime errors, I decided to use [TypeScript](https://www.typescriptlang.org/) on the front-end. This choice has allowed me to ensure data accuracy and type safety, bringing much-needed stability to my app. Learning TypeScript while building this project was challenging but extremely rewarding, as it has deepened my understanding of JavaScript and strengthened my overall development skills.

This app is built as a **Progressive Web App** (PWA)[^2], meaning it’s designed to offer a native app-like experience on mobile. This approach was a great way to make the app more user-friendly and align with my goal of building a modern, accessible tool for aviation enthusiasts and plane spotters.

[^2]: [Wikipedia : Progressive Web App (PWA)](https://en.wikipedia.org/wiki/Progressive_web_app)

Although this project began as a fun way to put my React skills to the test, it evolved into an amazing full-stack journey ! Not only did I dive into React and TypeScript on the front-end, I also built an API with Node.js and Express, all while learning on the fly. The code may still be rough around the edges, and I’m continuously learning to write cleaner, more concise, and DRY code, but I’m proud of what I’ve accomplished, and I hope others can find value in this project as well.

Thank you for taking the time to check out my project ! Your feedback and contributions are welcome, as I’m always looking to improve and learn more. Happy coding ! :rocket:
