import React from "react";
import { requireUser } from "@/lib/hooks";

const DashboardPage = async () => {
  const session = await requireUser();

  return <div>DashboardPage</div>;
};

export default DashboardPage;
