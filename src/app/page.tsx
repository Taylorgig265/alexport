import { PortfolioHome } from "@/components/site/PortfolioHome";
import { getPortfolioData } from "@/lib/data";

export default async function HomePage() {
  const data = await getPortfolioData();
  return <PortfolioHome data={data} />;
}
