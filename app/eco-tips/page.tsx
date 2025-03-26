// app/eco-tips/page.tsx
import React from "react";
import EcoTips from "./EcoTips";
import Layout from "@/app/components/Layout";

const EcoTipsPage = () => {
  return (
    <Layout>
      <div className="relative">
        <div className="absolute right-4 top-4 z-50">
        </div>
        <EcoTips />
      </div>
    </Layout>
  );
};

export default EcoTipsPage;
