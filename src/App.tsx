import "./App.css";
import Navbar from "./components/Navbar";
import ListingItem from "./components/listings/ListingItem";

function App() {
    return (
        <>
            <div className='flex w-screen align-top h-screen flex-col'>
                <Navbar/>
                <div className="p-2 flex flex-col items-center">
                    <ListingItem/>
                </div>

            </div>
        </>
    );
}

export default App;
