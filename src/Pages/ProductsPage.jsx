import ProductTable from "../components/ProductTable"
import Header from "../components/re-usable-components/Header"

function ProductsPage() {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title="Products" />

            <main className="max-w-7xl mx-auto py-6 px-4  lg:px-8 xl:px-8">
            <ProductTable />

            </main>
        </div>
    )
}

export default ProductsPage