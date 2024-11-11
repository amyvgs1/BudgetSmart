// /src/pages/ArticlesPage.jsx

import React from 'react';

// Sample article data (can be replaced with dynamic data later)
const articles = [
  {
    id: 1,
    title: "How to Budget Money in 5 Steps",
    summary: "Learn the basics of budgeting and how to set realistic goals.",
    imageUrl: "https://images.ctfassets.net/pdf29us7flmy/5ANIqx0tpBDmYVTH1Xuozm/566dbf7c8228d188f542625b9223183a/Image_from_iOS__2_.png?w=720&q=100&fm=jpg", // Replace with actual image URLs
    link: "https://www.nerdwallet.com/article/finance/how-to-budget",
  },
  {
    id: 2,
    title: "Top Budgeting Tools for 2024",
    summary: "Explore the best tools to help you manage your finances this year.",
    imageUrl: "https://themoneymindedmom.com/wp-content/uploads/2024/08/72f3dc_8a90d43e05144f8185208ba84ce6c580mv2.png-e1724068992325.webp",
    link: "https://www.forbes.com/advisor/banking/best-budgeting-apps/",
  },
  {
    id: 3,
    title: "Creating a Monthly Budget",
    summary: "Step-by-step guide to creating and sticking to a monthly budget.",
    imageUrl: "https://image.cnbcfm.com/api/v1/image/107037713-1648487438323-MonthlyBudgetVS.png?v=1648487520",
    link: "https://www.bankrate.com/banking/how-to-make-a-monthly-budget/",
  },
  {
    id: 4,
    title: "Corporate Budgeting",
    summary: "Descriptive guide on how to navigate budgeting in the corporate world.",
    imageUrl: "https://www.501c3.org/wp-content/uploads/2021/10/group-of-businessmen-discussion-analysis-sharing-calculations-about-the-company-budget.jpg",
    link: "https://www.onestream.com/blog/corporate-budget-planning/",
  },
  {
    id: 5,
    title: "Tips for budgeting to meet your financial goals",
    summary: "Practical tips for creating and maintaining a budget that suits your needs. ",
    imageUrl: "https://www.stash.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Frb0flvpwcnag%2F3Ui9tTKGAmz94KGqqkS6OF%2Fbaf28b6586a6c36b5b3cf322a12dd8e2%2FBudgeting-apps-1.png&w=3840&q=75",
    link: "https://www.usa.gov/features/budgeting-to-meet-financial-goals",
  },
  {
    id: 6,
    title: "Glossary of budget terms | Office of Financial Management",
    summary: "Glossary of a variety of budgeting terms at your disposal for you and your team.",
    imageUrl: "https://marvel-b1-cdn.bc0a.com/f00000000062824/38bc230840c9f50584b1-d888d963ac10c75c13e82e39a8a7bfe5.ssl.cf1.rackcdn.com/50-30-20%20Blog.png",
    link: "https://ofm.wa.gov/budget/glossary-budget-terms",
  },
];

const ArticlesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Budgeting Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.summary}</p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;