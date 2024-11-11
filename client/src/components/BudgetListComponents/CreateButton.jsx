export default function CreateButton(props) {
    return (
        <div className="flex flex-row justify-center items-center rounded-full h-10 w-10 bg-orange-400 hover:bg-orange-200 hover:cursor-pointer" onClick={props.clickFunc}>
            <span className="font-bold text-4xl"><p>+</p></span>
        </div>
    );
}