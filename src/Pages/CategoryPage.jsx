import Header from "../components/re-usable-components/Header";
import CategoryTable from "../components/CategotyTable";
import { Toaster } from "react-hot-toast";

function CategoryPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />
      <Toaster position="top-right" />
      <CategoryTable/>
    </div>
  );
}

export default CategoryPage;
