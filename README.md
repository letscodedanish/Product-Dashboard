# Advanced Data Table Web App

## Overview

This project is an advanced data table web application developed using React, leveraging the [Tanstack React Table](https://tanstack.com/table/latest/docs/introduction) and [Material React Table](https://www.material-react-table.com/) libraries. The app implements various features such as filtering, sorting, pagination, and more to provide an intuitive and powerful user experience for managing tabular data.
https://670f5d87a963f3f28984a9ba--hilarious-cranachan-90dc48.netlify.app/
## Features

- **View/Hide Columns**: Users can select which columns to display or hide in the table.
- **Sorting**: All columns support sorting functionality, allowing users to arrange data based on their preferences.
- **Filtering**: Comprehensive filtering options include:
  - **Fuzzy Search**: Search for rows based on the `name` column with tolerance for slight variations or typos.
  - **Multi-select Dropdowns**: Filter rows using exact matches on the `category` and `subcategory` columns, along with facet generation.
  - **Range Filters**: Users can filter data based on numeric ranges for the `price` column and date ranges for the `createdAt` column.
- **Grouping**: Data can be grouped by both `category` and `subcategory` columns simultaneously or independently.
- **Pagination**: The table displays results with pagination, showing 10 results per page.
- **Custom Cell Rendering**: Dates are displayed in local datetime format `DD-MMM-YYYY HH:MM` for `createdAt` and `updatedAt` columns.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
