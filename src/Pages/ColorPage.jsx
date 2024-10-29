import Header from "../components/re-usable-components/Header"
import ColorTable from "../components/ColorTable";


const ColorPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Sales Dashboard' />

            <main className="max-w-7xl mx-auto py-6 px-4  lg:px-8 xl:px-8">
            <ColorTable />
            </main>
        </div>
    );
};
export default ColorPage;