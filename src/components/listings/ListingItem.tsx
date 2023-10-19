function ListingItem() {
    return (
        <>
            <div className="border border-solid border-black p-2 w-1/2 flex">
                <div className="h-64 bg-black basis-1/3 text-white"> Image </div>
                <div className="py-2 px-4 basis-2/3 flex flex-col justify-between">
                    <div className="">
                        Location: Anywhere?
                    </div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores porro, fugit recusandae tempore voluptatum tempora aperiam odit sequi reiciendis dolor voluptates alias repellat autem inventore? Repellat blanditiis ea perferendis recusandae?
                    <div className="flex justify-between">
                        <div> Listed: 2min ago</div>
                        <div> Price: 1000$ </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListingItem;
