import { useState } from "react";

export default function HomeGridDisplay(props) {
    const [isFlipped, setFlipped] = useState(false);

    const clickBehavior = () => {
        setFlipped(!isFlipped);
    }


    return (
        <>
            {isFlipped ?
                <div onClick={clickBehavior} className="flex flex-col col-span-2 justify-center items-center h-48 rounded-xl bg-blue-300 p-2 hover:cursor-pointer hover:bg-blue-500 ">
                    < h1 className="text-xl" > {props.description}</h1 >
                </div >
                :
                <div onClick={clickBehavior} className="flex flex-col col-span-2 justify-center items-center h-48 rounded-xl bg-blue-300 p-2 hover:cursor-pointer hover:bg-blue-500 ">
                    <p className="text-3xl font-semibold">{props.feature}</p>
                </div>
            }
        </>
    );
}