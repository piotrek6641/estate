function Navbar() {
    return (
        <>
            <div className="w-full h-16 bg-purple-600 p-2 flex justify-between items-center">
                <div className=""> Real Estate </div>
                <div> <input placeholder="Search..." className="rounded-lg p-1 bg-gray-200"/> </div>
                <div className="flex gap-2 pr-4">
                    <div> ITEM </div>
                    <div> ITEM </div>
                    <div> ITEM </div>
                    <div> ITEM </div>
                </div>
            </div>
        </>
    );
}
export default Navbar;
