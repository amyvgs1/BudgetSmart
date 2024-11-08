import trash from "/src/assets/trash.png";

export default function ListItem(props) {

    const removeItem = () => {
        props.addListItem((prevItems) => {
            return props.itemsList.filter((item, i) => i !== props.index);
        });
    }


    return (
        <div className="grid grid-cols-10 gap-3 w-1/2 rounded-md bg-blue-200 p-2">
            <div className="col-span-9">
                <h1>{props.itemName}</h1>
            </div>

            <div onClick={removeItem} className="col-span-1 h-5 w-5 hover:cursor-pointer">
                <img src={trash} width={30} height={30}/>
            </div>
        </div>
    );
}